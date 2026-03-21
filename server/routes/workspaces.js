const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { createAuditLog } = require('../services/auditLog');
const db = require('../services/db');
const { z } = require('zod');

// ============================================================
// GET /api/workspaces/mine
// Returns workspaces the authenticated user can access.
// super_admin/developer see all active workspaces.
// ============================================================
router.get('/mine', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const globalRole = req.globalRole;

    let rows;
    if (['super_admin', 'developer'].includes(globalRole)) {
      ({ rows } = await db.query(
        `SELECT w.*, 'owner' AS workspace_role, 'active' AS membership_status
         FROM workspaces w
         WHERE w.status = 'active'
         ORDER BY w.name`
      ));
    } else {
      ({ rows } = await db.query(
        `SELECT w.*, wm.workspace_role, wm.status AS membership_status
         FROM workspace_memberships wm
         JOIN workspaces w ON wm.workspace_id = w.id
         WHERE wm.user_id = $1
           AND wm.status = 'active'
           AND w.status = 'active'
         ORDER BY w.name`,
        [userId]
      ));
    }

    res.json({ workspaces: rows });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/workspaces/users
// List all user profiles. developer/super_admin only.
// ============================================================
router.get('/users', requireAuth, requireRole('super_admin', 'developer'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT up.*,
              json_agg(
                json_build_object(
                  'membership_id', wm.id,
                  'workspace_id', wm.workspace_id,
                  'workspace_slug', w.slug,
                  'workspace_name', w.name,
                  'workspace_role', wm.workspace_role,
                  'status', wm.status
                )
              ) FILTER (WHERE wm.id IS NOT NULL) AS memberships
       FROM user_profiles up
       LEFT JOIN workspace_memberships wm ON wm.user_id = up.id
       LEFT JOIN workspaces w ON wm.workspace_id = w.id
       GROUP BY up.id
       ORDER BY up.created_at DESC`
    );
    res.json({ users: rows });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/workspaces/users
// Create or update a user profile. developer/super_admin only.
// Body: { id (auth UUID), email, full_name, global_role }
// ============================================================
const upsertUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  global_role: z.enum(['member', 'legal', 'operations', 'admin', 'developer', 'super_admin']),
});

router.post('/users', requireAuth, requireRole('super_admin', 'developer'), async (req, res, next) => {
  try {
    const parsed = upsertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const { id, email, full_name, global_role } = parsed.data;

    const { rows } = await db.query(
      `INSERT INTO user_profiles (id, email, full_name, global_role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE
         SET email = EXCLUDED.email,
             full_name = EXCLUDED.full_name,
             global_role = EXCLUDED.global_role,
             updated_at = NOW()
       RETURNING *`,
      [id, email, full_name || null, global_role]
    );

    await createAuditLog({
      action: 'user_profile.upsert',
      actor_id: req.user.id,
      actor_email: req.user.email,
      resource_type: 'user_profile',
      resource_id: id,
      metadata: { email, global_role },
    });

    res.status(201).json({ user_profile: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/workspaces/assign
// Assign a user to a workspace. developer/super_admin only.
// Body: { user_id (auth UUID), workspace_slug, workspace_role }
// ============================================================
const assignSchema = z.object({
  user_id: z.string().uuid(),
  workspace_slug: z.string().min(1),
  workspace_role: z.enum(['owner', 'editor', 'viewer', 'legal_reviewer']),
});

router.post('/assign', requireAuth, requireRole('super_admin', 'developer'), async (req, res, next) => {
  try {
    const parsed = assignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const { user_id, workspace_slug, workspace_role } = parsed.data;

    const wsResult = await db.query(
      `SELECT id, name FROM workspaces WHERE slug = $1 AND status = 'active'`,
      [workspace_slug]
    );
    if (!wsResult.rows.length) {
      return res.status(404).json({ error: `Workspace '${workspace_slug}' not found` });
    }
    const workspace = wsResult.rows[0];

    const { rows } = await db.query(
      `INSERT INTO workspace_memberships (workspace_id, user_id, workspace_role, granted_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (workspace_id, user_id) DO UPDATE
         SET workspace_role = EXCLUDED.workspace_role,
             status = 'active',
             granted_by = EXCLUDED.granted_by
       RETURNING *`,
      [workspace.id, user_id, workspace_role, req.user.id]
    );

    await createAuditLog({
      workspace_id: workspace.id,
      action: 'workspace.access_granted',
      actor_id: req.user.id,
      actor_email: req.user.email,
      resource_type: 'workspace_membership',
      resource_id: rows[0].id,
      metadata: { user_id, workspace_slug, workspace_role },
    });

    res.status(201).json({ membership: rows[0] });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// DELETE /api/workspaces/assign/:membershipId
// Revoke a workspace membership. developer/super_admin only.
// ============================================================
router.delete('/assign/:membershipId', requireAuth, requireRole('super_admin', 'developer'), async (req, res, next) => {
  try {
    const { membershipId } = req.params;

    const { rows } = await db.query(
      `UPDATE workspace_memberships
       SET status = 'revoked'
       WHERE id = $1
       RETURNING *`,
      [membershipId]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    await createAuditLog({
      workspace_id: rows[0].workspace_id,
      action: 'workspace.access_revoked',
      actor_id: req.user.id,
      actor_email: req.user.email,
      resource_type: 'workspace_membership',
      resource_id: membershipId,
      metadata: { revoked_user_id: rows[0].user_id },
    });

    res.json({ message: 'Access revoked.', membership_id: membershipId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { createAuditLog } = require('../services/auditLog');
const db = require('../services/db');

// All admin routes require auth + admin/super_admin/developer role
router.use(requireAuth, requireRole('admin', 'super_admin', 'developer'));

// GET /api/admin/applications — list applications by status, optionally scoped to workspace
router.get('/applications', async (req, res, next) => {
  try {
    const { status, workspace_id } = req.query;
    const params = [];
    const conditions = [];

    if (status) {
      params.push(status);
      conditions.push(`a.status = $${params.length}`);
    }
    if (workspace_id) {
      params.push(workspace_id);
      conditions.push(`a.workspace_id = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await db.query(
      `SELECT a.id, a.workspace_id, w.slug AS workspace_slug,
              a.first_name, a.last_name, a.email, a.membership_tier,
              a.motivation, a.referral, a.status, a.created_at
       FROM applications a
       LEFT JOIN workspaces w ON w.id = a.workspace_id
       ${where}
       ORDER BY a.created_at DESC`,
      params
    );
    res.json({ applications: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/applications/:id/approve
router.post('/applications/:id/approve', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(`SELECT * FROM applications WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Application not found' });

    const app = rows[0];
    if (app.status !== 'pending') {
      return res.status(409).json({ error: `Application is already ${app.status}` });
    }

    await db.query(
      `UPDATE applications SET status = 'approved', reviewed_at = NOW(), reviewed_by = $2 WHERE id = $1`,
      [id, req.user.id]
    );

    // Create member record, workspace-scoped if the application had a workspace
    await db.query(
      `INSERT INTO members (workspace_id, first_name, last_name, email, membership_tier, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       ON CONFLICT (email) DO UPDATE
         SET membership_tier = EXCLUDED.membership_tier,
             workspace_id    = EXCLUDED.workspace_id,
             status          = 'active'`,
      [app.workspace_id || null, app.first_name, app.last_name, app.email, app.membership_tier]
    );

    await createAuditLog({
      workspace_id: app.workspace_id || null,
      action: 'application.approved',
      actor_id: req.user.id,
      actor_email: req.user.email,
      resource_type: 'application',
      resource_id: id,
      metadata: { email: app.email, tier: app.membership_tier },
    });

    res.json({ message: 'Application approved.', application_id: id });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/applications/:id/reject
router.post('/applications/:id/reject', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { rows } = await db.query(`SELECT * FROM applications WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Application not found' });

    const app = rows[0];
    if (app.status !== 'pending') {
      return res.status(409).json({ error: `Application is already ${app.status}` });
    }

    await db.query(
      `UPDATE applications SET status = 'rejected', reviewed_at = NOW(), reviewed_by = $2, rejection_reason = $3 WHERE id = $1`,
      [id, req.user.id, reason || null]
    );

    await createAuditLog({
      workspace_id: app.workspace_id || null,
      action: 'application.rejected',
      actor_id: req.user.id,
      actor_email: req.user.email,
      resource_type: 'application',
      resource_id: id,
      metadata: { email: app.email, reason },
    });

    res.json({ message: 'Application rejected.', application_id: id });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/audit-log — optionally filter by workspace
router.get('/audit-log', async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const params = [];
    let where = '';
    if (workspace_id) {
      params.push(workspace_id);
      where = 'WHERE workspace_id = $1';
    }

    const { rows } = await db.query(
      `SELECT id, workspace_id, action, actor_id, actor_email,
              resource_type, resource_id, metadata, created_at
       FROM audit_logs
       ${where}
       ORDER BY created_at DESC
       LIMIT 100`,
      params
    );
    res.json({ logs: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

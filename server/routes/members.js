const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const db = require('../services/db');

// GET /api/members — workspace-scoped when workspace_id query param provided
router.get('/', requireAuth, requireRole('admin', 'operations', 'developer', 'super_admin'), async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const params = [];
    let where = '';
    if (workspace_id) {
      params.push(workspace_id);
      where = 'WHERE m.workspace_id = $1';
    }

    const { rows } = await db.query(
      `SELECT m.id, m.workspace_id, w.slug AS workspace_slug,
              m.first_name, m.last_name, m.email, m.membership_tier, m.status, m.created_at
       FROM members m
       LEFT JOIN workspaces w ON w.id = m.workspace_id
       ${where}
       ORDER BY m.created_at DESC`,
      params
    );
    res.json({ members: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/members
router.post('/', requireAuth, requireRole('admin', 'developer', 'super_admin'), async (req, res, next) => {
  try {
    const { first_name, last_name, email, membership_tier, status = 'active', workspace_id } = req.body;
    const { rows } = await db.query(
      `INSERT INTO members (workspace_id, first_name, last_name, email, membership_tier, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [workspace_id || null, first_name, last_name, email, membership_tier, status]
    );
    res.status(201).json({ member: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

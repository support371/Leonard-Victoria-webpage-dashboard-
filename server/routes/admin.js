const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { createAuditLog } = require('../services/auditLog');
const db = require('../services/db');

// All admin routes require auth + admin role
router.use(requireAuth, requireRole('admin'));

// GET /api/admin/applications — list applications by status
router.get('/applications', async (req, res, next) => {
  try {
    const { status } = req.query;
    const params = [];
    let where = '';
    if (status) {
      params.push(status);
      where = `WHERE status = $1`;
    }
    const { rows } = await db.query(
      `SELECT id, first_name, last_name, email, membership_tier, motivation, referral, status, created_at
       FROM applications ${where}
       ORDER BY created_at DESC`,
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

    // Fetch the application
    const { rows } = await db.query(`SELECT * FROM applications WHERE id = $1`, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Application not found' });

    const app = rows[0];
    if (app.status !== 'pending') {
      return res.status(409).json({ error: `Application is already ${app.status}` });
    }

    // Update status
    await db.query(`UPDATE applications SET status = 'approved', reviewed_at = NOW() WHERE id = $1`, [id]);

    // Create member record
    await db.query(
      `INSERT INTO members (first_name, last_name, email, membership_tier, status)
       VALUES ($1, $2, $3, $4, 'active')
       ON CONFLICT (email) DO UPDATE SET membership_tier = EXCLUDED.membership_tier, status = 'active'`,
      [app.first_name, app.last_name, app.email, app.membership_tier]
    );

    // Audit log
    await createAuditLog({
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
      `UPDATE applications SET status = 'rejected', reviewed_at = NOW(), rejection_reason = $2 WHERE id = $1`,
      [id, reason || null]
    );

    await createAuditLog({
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

// GET /api/admin/audit-log
router.get('/audit-log', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, action, actor_id, actor_email, resource_type, resource_id, metadata, created_at
       FROM audit_logs
       ORDER BY created_at DESC
       LIMIT 100`
    );
    res.json({ logs: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

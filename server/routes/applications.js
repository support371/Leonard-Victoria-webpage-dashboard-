const router = require('express').Router();
const { validate, memberApplicationSchema } = require('../validation/schemas');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const db = require('../services/db');

// POST /api/applications — public submission
// workspace_slug is optional; if provided the application is associated with that workspace
router.post('/', strictRateLimiter, validate(memberApplicationSchema), async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, membership_tier, motivation, referral, workspace_slug } = req.body;

    // Resolve workspace_id if slug provided
    let workspace_id = null;
    if (workspace_slug) {
      const wsResult = await db.query(
        `SELECT id FROM workspaces WHERE slug = $1 AND status = 'active'`,
        [workspace_slug]
      );
      if (wsResult.rows.length) workspace_id = wsResult.rows[0].id;
    }

    // Check for duplicate pending application in this workspace
    const existing = await db.query(
      `SELECT id FROM applications
       WHERE email = $1 AND status = 'pending'
         AND ($2::uuid IS NULL OR workspace_id = $2)`,
      [email, workspace_id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An application for this email is already pending.' });
    }

    const { rows } = await db.query(
      `INSERT INTO applications
         (workspace_id, first_name, last_name, email, phone, membership_tier, motivation, referral, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id, first_name, last_name, email, membership_tier, status, created_at`,
      [workspace_id, first_name, last_name, email, phone || null, membership_tier, motivation, referral || null]
    );
    res.status(201).json({
      application: rows[0],
      message: 'Application received. We will be in touch soon.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

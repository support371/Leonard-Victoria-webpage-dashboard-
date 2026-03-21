const router = require('express').Router();
const { validate, memberApplicationSchema } = require('../validation/schemas');
const { strictRateLimiter } = require('../middleware/rateLimiter');
const db = require('../services/db');

// POST /api/applications — public submission
router.post('/', strictRateLimiter, validate(memberApplicationSchema), async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, membership_tier, motivation, referral } = req.body;

    // Check for duplicate
    const existing = await db.query(
      `SELECT id FROM applications WHERE email = $1 AND status = 'pending'`,
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An application for this email is already pending.' });
    }

    const { rows } = await db.query(
      `INSERT INTO applications (first_name, last_name, email, phone, membership_tier, motivation, referral, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING id, first_name, last_name, email, membership_tier, status, created_at`,
      [first_name, last_name, email, phone || null, membership_tier, motivation, referral || null]
    );
    res.status(201).json({ application: rows[0], message: 'Application received. We will be in touch soon.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

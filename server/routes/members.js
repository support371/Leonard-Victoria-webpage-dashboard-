const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const db = require('../services/db');

// GET /api/members — list all members (admin/operations only)
router.get('/', requireAuth, requireRole('admin', 'operations'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, first_name, last_name, email, membership_tier, status, created_at
       FROM members
       ORDER BY created_at DESC`
    );
    res.json({ members: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/members — create member (admin only)
router.post('/', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const { first_name, last_name, email, membership_tier, status = 'active' } = req.body;
    const { rows } = await db.query(
      `INSERT INTO members (first_name, last_name, email, membership_tier, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [first_name, last_name, email, membership_tier, status]
    );
    res.status(201).json({ member: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

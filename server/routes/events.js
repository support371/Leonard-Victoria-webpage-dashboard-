const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../services/db');

// GET /api/events — public list of upcoming events
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, description, event_date, location, capacity, category, member_only
       FROM events
       WHERE event_date >= NOW()
       ORDER BY event_date ASC`
    );
    res.json({ events: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/events/:id/register — authenticated event registration
router.post('/:id/register', requireAuth, async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check existing registration
    const existing = await db.query(
      `SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already registered for this event.' });
    }

    await db.query(
      `INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)`,
      [eventId, userId]
    );
    res.json({ message: 'Registration confirmed.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

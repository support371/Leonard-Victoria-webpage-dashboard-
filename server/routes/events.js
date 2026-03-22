const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../services/db');

// GET /api/events — public list of upcoming events (global; no workspace filter)
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

    // Fetch the event to get its workspace_id
    const eventResult = await db.query(
      `SELECT id, workspace_id FROM events WHERE id = $1`,
      [eventId]
    );
    if (!eventResult.rows.length) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    const event = eventResult.rows[0];

    // Check existing registration
    const existing = await db.query(
      `SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2`,
      [eventId, userId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already registered for this event.' });
    }

    // Insert with workspace_id inherited from the event
    await db.query(
      `INSERT INTO event_registrations (workspace_id, event_id, user_id) VALUES ($1, $2, $3)`,
      [event.workspace_id || null, eventId, userId]
    );
    res.json({ message: 'Registration confirmed.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db } = require('../services/db');

// Get featured content for Community Hub
router.get('/hub', async (req, res, next) => {
  try {
    // This would typically join with featured_placements
    // For now, return active/featured content
    const profiles = await db.query(
      `SELECT p.*, u.full_name, u.email
       FROM community_profiles p
       JOIN user_profiles u ON p.user_id = u.id
       WHERE p.status = 'active'
       ORDER BY p.created_at DESC LIMIT 6`
    );

    const content = await db.query(
      "SELECT * FROM community_content WHERE status = 'active' AND featured = true ORDER BY created_at DESC"
    );

    const events = await db.query(
      "SELECT * FROM events WHERE event_date > NOW() ORDER BY event_date ASC LIMIT 3"
    );

    res.json({
      featured_profiles: profiles.rows,
      stories: content.rows,
      upcoming_events: events.rows
    });
  } catch (err) {
    next(err);
  }
});

// Search/Filter Profiles
router.get('/profiles', async (req, res, next) => {
  try {
    const { type, region, availability } = req.query;
    let query = `
      SELECT p.*, u.full_name
      FROM community_profiles p
      JOIN user_profiles u ON p.user_id = u.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND p.profile_type = $${params.length}`;
    }
    if (region) {
      params.push(`%${region}%`);
      query += ` AND p.region ILIKE $${params.length}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get Profile Detail
router.get('/profiles/:id', async (req, res, next) => {
  try {
    const profile = await db.query(
      `SELECT p.*, u.full_name, u.email
       FROM community_profiles p
       JOIN user_profiles u ON p.user_id = u.id
       WHERE p.id = $1 AND p.status = 'active'`,
      [req.params.id]
    );

    if (profile.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const services = await db.query(
      "SELECT * FROM community_services WHERE profile_id = $1 AND status = 'active'",
      [req.params.id]
    );

    res.json({
      ...profile.rows[0],
      services: services.rows
    });
  } catch (err) {
    next(err);
  }
});

// Search/Filter Services
router.get('/services', async (req, res, next) => {
  try {
    const { category, audience } = req.query;
    let query = `
      SELECT s.*, p.profile_type, u.full_name as practitioner_name
      FROM community_services s
      JOIN community_profiles p ON s.profile_id = p.id
      JOIN user_profiles u ON p.user_id = u.id
      WHERE s.status = 'active'
    `;
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND s.category = $${params.length}`;
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

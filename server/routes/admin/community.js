const express = require('express');
const router = express.Router();
const { db } = require('../../services/db');
const { requireAuth, requireRole } = require('../../middleware/auth');

// All routes require admin or operations roles
router.use(requireAuth);
router.use(requireRole(['admin', 'operations', 'super_admin']));

// List Pending Profiles/Services for Review Center
router.get('/review/pending', async (req, res, next) => {
  try {
    const profiles = await db.query(
      "SELECT p.*, u.full_name, u.email FROM community_profiles p JOIN user_profiles u ON p.user_id = u.id WHERE p.status = 'pending'"
    );
    const services = await db.query(
      "SELECT s.*, u.full_name as practitioner_name FROM community_services s JOIN community_profiles p ON s.profile_id = p.id JOIN user_profiles u ON p.user_id = u.id WHERE s.status = 'pending'"
    );
    const stories = await db.query(
      "SELECT * FROM community_content WHERE status = 'pending'"
    );

    res.json({
      pending_profiles: profiles.rows,
      pending_services: services.rows,
      pending_stories: stories.rows
    });
  } catch (err) {
    next(err);
  }
});

// Approve/Reject Community Resources
router.post('/review/:type/:id/approve', async (req, res, next) => {
  try {
    const { type, id } = req.params;
    let table;
    switch (type) {
      case 'profile': table = 'community_profiles'; break;
      case 'service': table = 'community_services'; break;
      case 'content': table = 'community_content'; break;
      default: return res.status(400).json({ error: 'Invalid resource type' });
    }

    const result = await db.query(
      `UPDATE ${table} SET status = 'active', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ success: true, resource: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Update Featured Placement
router.post('/featured/update', async (req, res, next) => {
  try {
    const { section, resource_type, resource_id, sort_order, active } = req.body;

    const result = await db.query(
      `INSERT INTO featured_placements (section, resource_type, resource_id, sort_order, active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (section, resource_id) DO UPDATE
       SET sort_order = $4, active = $5
       RETURNING *`,
      [section, resource_type, resource_id, sort_order, active]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

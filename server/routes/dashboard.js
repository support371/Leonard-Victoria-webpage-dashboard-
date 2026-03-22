const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const db = require('../services/db');

// GET /api/dashboard — aggregated stats
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [
      membersResult,
      pendingResult,
      eventsResult,
      revenueResult,
      activityResult,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) as total_members FROM members WHERE status = 'active'`),
      db.query(`SELECT COUNT(*) as pending_applications FROM applications WHERE status = 'pending'`),
      db.query(
        `SELECT COUNT(*) as upcoming_events FROM events WHERE event_date >= NOW() AND event_date <= NOW() + interval '30 days'`
      ),
      db.query(
        `SELECT COALESCE(SUM(amount_cents), 0) as total_cents
         FROM payment_transactions
         WHERE status = 'completed'
         AND created_at >= date_trunc('month', NOW())`
      ),
      db.query(
        `SELECT action, actor_email, created_at as timestamp FROM audit_logs
         ORDER BY created_at DESC LIMIT 10`
      ),
    ]);

    const stats = {
      total_members: parseInt(membersResult.rows[0].total_members, 10),
      pending_applications: parseInt(pendingResult.rows[0].pending_applications, 10),
      upcoming_events: parseInt(eventsResult.rows[0].upcoming_events, 10),
      monthly_revenue: Math.round(parseInt(revenueResult.rows[0].total_cents, 10) / 100),
    };

    const recent_activity = activityResult.rows.map((r) => ({
      action: r.action,
      timestamp: new Date(r.timestamp).toLocaleString(),
    }));

    res.json({ stats, recent_activity });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

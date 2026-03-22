/**
 * Bernard Programs Portal — /api/portal/bernard
 * All routes are scoped to the bernard workspace only.
 */
const express = require('express');
const { z } = require('zod');
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');
const { requireWorkspaceAccess } = require('../middleware/workspace');
const { logAudit } = require('../services/auditLog');

const router = express.Router();

router.use((req, _res, next) => {
  req.params.workspaceSlug = 'bernard';
  next();
});
router.use(requireAuth);
router.use(requireWorkspaceAccess());

const wid = (req) => req.workspace.id;

// ── Schemas ─────────────────────────────────────────────────────────────────

const programSchema = z.object({
  name:           z.string().min(2),
  description:    z.string().optional().nullable(),
  category:       z.enum(['education','community','leadership','wellness','advocacy','social','other']).default('community'),
  status:         z.enum(['active','inactive','completed','planned']).default('active'),
  start_date:     z.string().optional().nullable(),
  end_date:       z.string().optional().nullable(),
  capacity:       z.number().int().optional().nullable(),
  lead_name:      z.string().optional().nullable(),
  budget_cents:   z.number().int().optional().nullable(),
  location:       z.string().optional().nullable(),
  is_recurring:   z.boolean().default(false),
  notes:          z.string().optional().nullable(),
});

const eventSchema = z.object({
  title:       z.string().min(2),
  description: z.string().optional().nullable(),
  event_date:  z.string(),
  location:    z.string().optional().nullable(),
  capacity:    z.number().int().optional().nullable(),
  category:    z.string().optional().nullable(),
  member_only: z.boolean().default(false),
});

const enrollmentSchema = z.object({
  program_id:   z.string().uuid(),
  member_email: z.string().email(),
  status:       z.enum(['enrolled','completed','withdrawn','waitlisted']).default('enrolled'),
});

// ── Dashboard ────────────────────────────────────────────────────────────────

router.get('/dashboard', async (req, res, next) => {
  try {
    const [progResult, eventResult, memberResult, enrollResult, recentResult] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*)::int                                           AS total_programs,
          COUNT(*) FILTER (WHERE status = 'active')::int         AS active_programs,
          COUNT(*) FILTER (WHERE status = 'planned')::int        AS planned_programs,
          COUNT(*) FILTER (WHERE status = 'completed')::int      AS completed_programs,
          COALESCE(SUM(enrolled_count), 0)::int                  AS total_enrolled
        FROM programs WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT
          COUNT(*)::int                                           AS total_events,
          COUNT(*) FILTER (WHERE event_date >= NOW())::int       AS upcoming_events,
          COUNT(*) FILTER (WHERE event_date >= NOW() - INTERVAL '30 days'
                            AND event_date < NOW())::int         AS recent_events
        FROM events WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT
          COUNT(*)::int                                           AS total_members,
          COUNT(*) FILTER (WHERE status = 'active')::int         AS active_members,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_this_month
        FROM members WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT COUNT(*)::int AS total_enrollments,
               COUNT(*) FILTER (WHERE status = 'completed')::int AS completed
        FROM program_enrollments WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT action, actor_email, created_at
        FROM audit_logs WHERE workspace_id = $1
        ORDER BY created_at DESC LIMIT 8
      `, [wid(req)]),
    ]);

    // Upcoming events
    const upcomingEvents = await db.query(`
      SELECT id, title, event_date, location, category, member_only
      FROM events WHERE workspace_id = $1 AND event_date >= NOW()
      ORDER BY event_date ASC LIMIT 5
    `, [wid(req)]);

    // Top programs by enrollment
    const topPrograms = await db.query(`
      SELECT id, name, category, status, enrolled_count, capacity
      FROM programs WHERE workspace_id = $1 AND status = 'active'
      ORDER BY enrolled_count DESC LIMIT 5
    `, [wid(req)]);

    res.json({
      programs:        progResult.rows[0],
      events:          eventResult.rows[0],
      members:         memberResult.rows[0],
      enrollments:     enrollResult.rows[0],
      upcoming_events: upcomingEvents.rows,
      top_programs:    topPrograms.rows,
      recent_activity: recentResult.rows,
    });
  } catch (err) { next(err); }
});

// ── Programs ──────────────────────────────────────────────────────────────────

router.get('/programs', async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const conditions = ['workspace_id = $1'];
    const params = [wid(req)];
    if (status)   { conditions.push(`status = $${params.push(status)}`); }
    if (category) { conditions.push(`category = $${params.push(category)}`); }

    const { rows } = await db.query(`
      SELECT * FROM programs WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
    `, params);
    res.json({ programs: rows });
  } catch (err) { next(err); }
});

router.post('/programs', async (req, res, next) => {
  try {
    const data = programSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO programs (workspace_id, name, description, category, status,
        start_date, end_date, capacity, lead_name, budget_cents, location, is_recurring, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
    `, [wid(req), data.name, data.description, data.category, data.status,
        data.start_date, data.end_date, data.capacity, data.lead_name,
        data.budget_cents, data.location, data.is_recurring, data.notes]);

    await logAudit({ workspaceId: wid(req), action: 'program.created', actorId: req.user.id,
      actorEmail: req.user.email, resourceType: 'program', resourceId: rows[0].id });
    res.status(201).json({ program: rows[0] });
  } catch (err) { next(err); }
});

router.get('/programs/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM programs WHERE id = $1 AND workspace_id = $2',
      [req.params.id, wid(req)]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Program not found' });

    const enrollments = await db.query(
      'SELECT * FROM program_enrollments WHERE program_id = $1 ORDER BY enrolled_at DESC',
      [req.params.id]
    );
    res.json({ program: rows[0], enrollments: enrollments.rows });
  } catch (err) { next(err); }
});

router.put('/programs/:id', async (req, res, next) => {
  try {
    const data = programSchema.partial().parse(req.body);
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 3}`);
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    const { rows } = await db.query(`
      UPDATE programs SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND workspace_id = $2 RETURNING *
    `, [req.params.id, wid(req), ...Object.values(data)]);
    if (!rows[0]) return res.status(404).json({ error: 'Program not found' });
    res.json({ program: rows[0] });
  } catch (err) { next(err); }
});

// ── Events ────────────────────────────────────────────────────────────────────

router.get('/events', async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const conditions = ['workspace_id = $1'];
    const params = [wid(req)];
    if (upcoming === 'true') { conditions.push(`event_date >= NOW()`); }

    const { rows } = await db.query(`
      SELECT e.*,
        (SELECT COUNT(*)::int FROM event_registrations er WHERE er.event_id = e.id) AS registration_count
      FROM events e WHERE ${conditions.join(' AND ')}
      ORDER BY e.event_date DESC
    `, params);
    res.json({ events: rows });
  } catch (err) { next(err); }
});

router.post('/events', async (req, res, next) => {
  try {
    const data = eventSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO events (workspace_id, title, description, event_date, location, capacity, category, member_only)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [wid(req), data.title, data.description, data.event_date, data.location,
        data.capacity, data.category, data.member_only]);

    await logAudit({ workspaceId: wid(req), action: 'event.created', actorId: req.user.id,
      actorEmail: req.user.email, resourceType: 'event', resourceId: rows[0].id });
    res.status(201).json({ event: rows[0] });
  } catch (err) { next(err); }
});

router.put('/events/:id', async (req, res, next) => {
  try {
    const data = eventSchema.partial().parse(req.body);
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 3}`);
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    const { rows } = await db.query(`
      UPDATE events SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND workspace_id = $2 RETURNING *
    `, [req.params.id, wid(req), ...Object.values(data)]);
    if (!rows[0]) return res.status(404).json({ error: 'Event not found' });
    res.json({ event: rows[0] });
  } catch (err) { next(err); }
});

// ── Members ───────────────────────────────────────────────────────────────────

router.get('/members', async (req, res, next) => {
  try {
    const { status, tier } = req.query;
    const conditions = ['workspace_id = $1'];
    const params = [wid(req)];
    if (status) { conditions.push(`status = $${params.push(status)}`); }
    if (tier)   { conditions.push(`membership_tier = $${params.push(tier)}`); }

    const { rows } = await db.query(`
      SELECT id, first_name, last_name, email, phone, membership_tier, status, created_at
      FROM members WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
    `, params);
    res.json({ members: rows });
  } catch (err) { next(err); }
});

// ── Enrollments ────────────────────────────────────────────────────────────────

router.post('/enrollments', async (req, res, next) => {
  try {
    const data = enrollmentSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO program_enrollments (workspace_id, program_id, member_email, status)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (program_id, member_email) DO UPDATE SET status = EXCLUDED.status
      RETURNING *
    `, [wid(req), data.program_id, data.member_email, data.status]);

    // Update enrolled count
    await db.query(`
      UPDATE programs SET enrolled_count = (
        SELECT COUNT(*) FROM program_enrollments
        WHERE program_id = $1 AND status = 'enrolled'
      ) WHERE id = $1
    `, [data.program_id]);

    res.status(201).json({ enrollment: rows[0] });
  } catch (err) { next(err); }
});

// ── Settings ─────────────────────────────────────────────────────────────────

router.get('/settings', async (req, res, next) => {
  try {
    const wsResult = await db.query(
      'SELECT id, name, slug, workspace_type, settings FROM workspaces WHERE id = $1',
      [wid(req)]
    );
    const membersResult = await db.query(`
      SELECT up.id AS user_id, up.email, up.full_name, wm.workspace_role
      FROM workspace_memberships wm
      JOIN user_profiles up ON wm.user_id = up.id
      WHERE wm.workspace_id = $1 AND wm.status = 'active'
      ORDER BY up.full_name
    `, [wid(req)]);

    res.json({
      workspace: wsResult.rows[0],
      members:   membersResult.rows,
      settings:  wsResult.rows[0]?.settings || {},
    });
  } catch (err) { next(err); }
});

router.put('/settings', async (req, res, next) => {
  try {
    const { settings } = req.body;
    const { rows } = await db.query(
      'UPDATE workspaces SET settings = $1 WHERE id = $2 RETURNING settings',
      [JSON.stringify(settings), wid(req)]
    );
    res.json({ settings: rows[0].settings });
  } catch (err) { next(err); }
});

module.exports = router;

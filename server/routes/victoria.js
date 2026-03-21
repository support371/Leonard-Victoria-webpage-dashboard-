/**
 * Victoria Governance Portal — /api/portal/victoria
 * All routes are scoped to the victoria workspace only.
 */
const express = require('express');
const { z } = require('zod');
const db = require('../services/db');
const { requireAuth } = require('../middleware/auth');
const { requireWorkspaceAccess } = require('../middleware/workspace');
const { logAudit } = require('../services/auditLog');

const router = express.Router();

// Inject workspace slug so requireWorkspaceAccess() works without a URL param
router.use((req, _res, next) => {
  req.params.workspaceSlug = 'victoria';
  next();
});
router.use(requireAuth);
router.use(requireWorkspaceAccess());

const wid = (req) => req.workspace.id;

// ── Schemas ─────────────────────────────────────────────────────────────────

const meetingSchema = z.object({
  title:          z.string().min(2),
  meeting_type:   z.enum(['board','committee','general_membership','working_group','other']).default('general'),
  status:         z.enum(['scheduled','in_progress','completed','cancelled']).default('scheduled'),
  meeting_date:   z.string(),
  location:       z.string().optional().nullable(),
  virtual_link:   z.string().optional().nullable(),
  agenda:         z.string().optional().nullable(),
  minutes:        z.string().optional().nullable(),
  attendee_count: z.number().int().optional().nullable(),
  quorum_reached: z.boolean().optional().nullable(),
  chaired_by:     z.string().optional().nullable(),
  recorded_by:    z.string().optional().nullable(),
  notes:          z.string().optional().nullable(),
});

const resolutionSchema = z.object({
  title:             z.string().min(2),
  resolution_number: z.string().optional().nullable(),
  description:       z.string().optional().nullable(),
  category:          z.enum(['governance','finance','policy','membership','legal','operations','other']).default('governance'),
  status:            z.enum(['proposed','under_review','passed','failed','withdrawn','superseded']).default('proposed'),
  votes_for:         z.number().int().default(0),
  votes_against:     z.number().int().default(0),
  votes_abstain:     z.number().int().default(0),
  proposed_by:       z.string().optional().nullable(),
  meeting_id:        z.string().uuid().optional().nullable(),
  passed_at:         z.string().optional().nullable(),
  effective_date:    z.string().optional().nullable(),
  notes:             z.string().optional().nullable(),
});

const committeeSchema = z.object({
  name:             z.string().min(2),
  purpose:          z.string().optional().nullable(),
  chair:            z.string().optional().nullable(),
  status:           z.enum(['active','inactive','dissolved']).default('active'),
  meeting_cadence:  z.string().optional().nullable(),
  member_count:     z.number().int().default(0),
});

// ── Dashboard ────────────────────────────────────────────────────────────────

router.get('/dashboard', async (req, res, next) => {
  try {
    const [meetsResult, resResult, comResult, docsResult, recentResult] = await Promise.all([
      db.query(`
        SELECT
          COUNT(*)::int                                                AS total_meetings,
          COUNT(*) FILTER (WHERE status = 'scheduled')::int           AS upcoming_meetings,
          COUNT(*) FILTER (WHERE status = 'completed')::int           AS completed_meetings,
          COUNT(*) FILTER (WHERE meeting_date >= NOW() - INTERVAL '30 days')::int AS recent_30d
        FROM meetings WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT
          COUNT(*)::int                                        AS total_resolutions,
          COUNT(*) FILTER (WHERE status = 'passed')::int      AS passed,
          COUNT(*) FILTER (WHERE status = 'proposed')::int    AS proposed,
          COUNT(*) FILTER (WHERE status = 'under_review')::int AS under_review
        FROM resolutions WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT COUNT(*)::int AS total_committees,
               COUNT(*) FILTER (WHERE status = 'active')::int AS active_committees
        FROM committees WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT COUNT(*)::int AS total_documents,
               COUNT(*) FILTER (WHERE category IN ('governance','legal'))::int AS governance_docs
        FROM documents WHERE workspace_id = $1
      `, [wid(req)]),
      db.query(`
        SELECT action, actor_email, created_at
        FROM audit_logs
        WHERE workspace_id = $1
        ORDER BY created_at DESC
        LIMIT 8
      `, [wid(req)]),
    ]);

    // Upcoming meetings next 30 days
    const upcomingResult = await db.query(`
      SELECT id, title, meeting_type, meeting_date, location, status
      FROM meetings
      WHERE workspace_id = $1 AND meeting_date >= NOW() AND status = 'scheduled'
      ORDER BY meeting_date ASC
      LIMIT 5
    `, [wid(req)]);

    res.json({
      meetings:        meetsResult.rows[0],
      resolutions:     resResult.rows[0],
      committees:      comResult.rows[0],
      documents:       docsResult.rows[0],
      upcoming:        upcomingResult.rows,
      recent_activity: recentResult.rows,
    });
  } catch (err) { next(err); }
});

// ── Meetings ─────────────────────────────────────────────────────────────────

router.get('/meetings', async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const conditions = ['workspace_id = $1'];
    const params = [wid(req)];
    if (status) { conditions.push(`status = $${params.push(status)}`); }
    if (type)   { conditions.push(`meeting_type = $${params.push(type)}`); }

    const { rows } = await db.query(`
      SELECT * FROM meetings WHERE ${conditions.join(' AND ')}
      ORDER BY meeting_date DESC
    `, params);
    res.json({ meetings: rows });
  } catch (err) { next(err); }
});

router.post('/meetings', async (req, res, next) => {
  try {
    const data = meetingSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO meetings (workspace_id, title, meeting_type, status, meeting_date,
        location, virtual_link, agenda, minutes, attendee_count, quorum_reached,
        chaired_by, recorded_by, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [wid(req), data.title, data.meeting_type, data.status, data.meeting_date,
        data.location, data.virtual_link, data.agenda, data.minutes, data.attendee_count,
        data.quorum_reached, data.chaired_by, data.recorded_by, data.notes]);

    await logAudit({ workspaceId: wid(req), action: 'meeting.created', actorId: req.user.id,
      actorEmail: req.user.email, resourceType: 'meeting', resourceId: rows[0].id });
    res.status(201).json({ meeting: rows[0] });
  } catch (err) { next(err); }
});

router.get('/meetings/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM meetings WHERE id = $1 AND workspace_id = $2',
      [req.params.id, wid(req)]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Meeting not found' });
    const resRows = await db.query(
      'SELECT * FROM resolutions WHERE meeting_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json({ meeting: rows[0], resolutions: resRows.rows });
  } catch (err) { next(err); }
});

router.put('/meetings/:id', async (req, res, next) => {
  try {
    const data = meetingSchema.partial().parse(req.body);
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 3}`);
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    const { rows } = await db.query(`
      UPDATE meetings SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND workspace_id = $2 RETURNING *
    `, [req.params.id, wid(req), ...Object.values(data)]);
    if (!rows[0]) return res.status(404).json({ error: 'Meeting not found' });
    res.json({ meeting: rows[0] });
  } catch (err) { next(err); }
});

// ── Resolutions ───────────────────────────────────────────────────────────────

router.get('/resolutions', async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const conditions = ['r.workspace_id = $1'];
    const params = [wid(req)];
    if (status)   { conditions.push(`r.status = $${params.push(status)}`); }
    if (category) { conditions.push(`r.category = $${params.push(category)}`); }

    const { rows } = await db.query(`
      SELECT r.*, m.title AS meeting_title, m.meeting_date
      FROM resolutions r
      LEFT JOIN meetings m ON r.meeting_id = m.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY r.created_at DESC
    `, params);
    res.json({ resolutions: rows });
  } catch (err) { next(err); }
});

router.post('/resolutions', async (req, res, next) => {
  try {
    const data = resolutionSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO resolutions (workspace_id, title, resolution_number, description, category,
        status, votes_for, votes_against, votes_abstain, proposed_by, meeting_id,
        passed_at, effective_date, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [wid(req), data.title, data.resolution_number, data.description, data.category,
        data.status, data.votes_for, data.votes_against, data.votes_abstain, data.proposed_by,
        data.meeting_id, data.passed_at, data.effective_date, data.notes]);

    await logAudit({ workspaceId: wid(req), action: 'resolution.created', actorId: req.user.id,
      actorEmail: req.user.email, resourceType: 'resolution', resourceId: rows[0].id });
    res.status(201).json({ resolution: rows[0] });
  } catch (err) { next(err); }
});

router.put('/resolutions/:id', async (req, res, next) => {
  try {
    const data = resolutionSchema.partial().parse(req.body);
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 3}`);
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    const { rows } = await db.query(`
      UPDATE resolutions SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND workspace_id = $2 RETURNING *
    `, [req.params.id, wid(req), ...Object.values(data)]);
    if (!rows[0]) return res.status(404).json({ error: 'Resolution not found' });
    res.json({ resolution: rows[0] });
  } catch (err) { next(err); }
});

// ── Committees ────────────────────────────────────────────────────────────────

router.get('/committees', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM committees WHERE workspace_id = $1 ORDER BY name ASC',
      [wid(req)]
    );
    res.json({ committees: rows });
  } catch (err) { next(err); }
});

router.post('/committees', async (req, res, next) => {
  try {
    const data = committeeSchema.parse(req.body);
    const { rows } = await db.query(`
      INSERT INTO committees (workspace_id, name, purpose, chair, status, meeting_cadence, member_count)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *
    `, [wid(req), data.name, data.purpose, data.chair, data.status, data.meeting_cadence, data.member_count]);
    res.status(201).json({ committee: rows[0] });
  } catch (err) { next(err); }
});

router.put('/committees/:id', async (req, res, next) => {
  try {
    const data = committeeSchema.partial().parse(req.body);
    const fields = Object.keys(data).map((k, i) => `${k} = $${i + 3}`);
    if (!fields.length) return res.status(400).json({ error: 'No fields to update' });
    const { rows } = await db.query(`
      UPDATE committees SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1 AND workspace_id = $2 RETURNING *
    `, [req.params.id, wid(req), ...Object.values(data)]);
    if (!rows[0]) return res.status(404).json({ error: 'Committee not found' });
    res.json({ committee: rows[0] });
  } catch (err) { next(err); }
});

// ── Documents (governance-scoped) ────────────────────────────────────────────

router.get('/documents', async (req, res, next) => {
  try {
    const { category } = req.query;
    const conditions = ['workspace_id = $1'];
    const params = [wid(req)];
    if (category) { conditions.push(`category = $${params.push(category)}`); }

    const { rows } = await db.query(`
      SELECT id, title, category, description, filename, size_bytes, content_type, created_at
      FROM documents WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
    `, params);
    res.json({ documents: rows });
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

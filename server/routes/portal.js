const router = require('express').Router({ mergeParams: true });
const { requireAuth } = require('../middleware/auth');
const { requireWorkspaceAccess } = require('../middleware/workspace');
const { supabaseAdmin } = require('../services/supabaseAdmin');
const db = require('../services/db');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'documents';
// Signed URL expiry in seconds (1 hour)
const SIGNED_URL_TTL = 3600;

// ============================================================
// GET /api/portal/:workspaceSlug/dashboard
// Workspace-scoped stats.
// ============================================================
router.get('/:workspaceSlug/dashboard',
  requireAuth,
  requireWorkspaceAccess(),
  async (req, res, next) => {
    try {
      const workspaceId = req.workspace.id;

      const [membersR, applicationsR, docsR, eventsR, revenueR, activityR] = await Promise.all([
        db.query(
          `SELECT COUNT(*) AS total FROM members WHERE workspace_id = $1 AND status = 'active'`,
          [workspaceId]
        ),
        db.query(
          `SELECT COUNT(*) AS total FROM applications WHERE workspace_id = $1 AND status = 'pending'`,
          [workspaceId]
        ),
        db.query(
          `SELECT COUNT(*) AS total FROM documents WHERE workspace_id = $1`,
          [workspaceId]
        ),
        db.query(
          `SELECT COUNT(*) AS total FROM events
           WHERE workspace_id = $1 AND event_date >= NOW() AND event_date <= NOW() + interval '30 days'`,
          [workspaceId]
        ),
        db.query(
          `SELECT COALESCE(SUM(amount_cents), 0) AS total_cents
           FROM payment_transactions
           WHERE workspace_id = $1 AND status = 'completed'
             AND created_at >= date_trunc('month', NOW())`,
          [workspaceId]
        ),
        db.query(
          `SELECT action, actor_email, created_at
           FROM audit_logs
           WHERE workspace_id = $1
           ORDER BY created_at DESC LIMIT 10`,
          [workspaceId]
        ),
      ]);

      res.json({
        workspace: {
          slug: req.workspace.slug,
          name: req.workspace.name,
          workspace_type: req.workspace.workspace_type,
        },
        workspace_role: req.workspaceRole,
        stats: {
          active_members:       parseInt(membersR.rows[0].total, 10),
          pending_applications: parseInt(applicationsR.rows[0].total, 10),
          documents:            parseInt(docsR.rows[0].total, 10),
          upcoming_events:      parseInt(eventsR.rows[0].total, 10),
          monthly_revenue:      Math.round(parseInt(revenueR.rows[0].total_cents, 10) / 100),
        },
        recent_activity: activityR.rows.map((r) => ({
          action: r.action,
          actor: r.actor_email,
          timestamp: new Date(r.created_at).toLocaleString(),
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================
// GET /api/portal/:workspaceSlug/documents
// Workspace-scoped document listing. Returns signed download URLs.
// ============================================================
router.get('/:workspaceSlug/documents',
  requireAuth,
  requireWorkspaceAccess(),
  async (req, res, next) => {
    try {
      const workspaceId = req.workspace.id;

      const { rows } = await db.query(
        `SELECT d.id, d.title, d.category, d.description, d.filename,
                d.size_bytes, d.content_type, d.storage_path, d.created_at,
                u.email AS uploaded_by
         FROM documents d
         LEFT JOIN users u ON u.auth_id = d.uploader_id
         WHERE d.workspace_id = $1
         ORDER BY d.created_at DESC`,
        [workspaceId]
      );

      // Generate short-lived signed download URLs for each document
      const documents = await Promise.all(
        rows.map(async (doc) => {
          let signed_url = null;
          if (doc.storage_path) {
            const { data, error } = await supabaseAdmin.storage
              .from(BUCKET)
              .createSignedUrl(doc.storage_path, SIGNED_URL_TTL);
            if (!error) signed_url = data?.signedUrl || null;
          }
          return { ...doc, signed_url };
        })
      );

      res.json({ workspace_slug: req.workspace.slug, documents });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================
// POST /api/portal/:workspaceSlug/documents/upload-url
// Get a signed upload URL for a workspace-scoped document.
// ============================================================
router.post('/:workspaceSlug/documents/upload-url',
  requireAuth,
  requireWorkspaceAccess(),
  async (req, res, next) => {
    try {
      const { filename, content_type } = req.body;
      if (!filename) return res.status(400).json({ error: 'filename required' });

      const ext = filename.split('.').pop();
      // Workspace-scoped storage path
      const storagePath = `${req.workspace.slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUploadUrl(storagePath);

      if (error) throw error;

      res.json({ path: storagePath, token: data.token, signed_url: data.signedUrl });
    } catch (err) {
      next(err);
    }
  }
);

// ============================================================
// POST /api/portal/:workspaceSlug/documents
// Save document metadata after upload.
// ============================================================
router.post('/:workspaceSlug/documents',
  requireAuth,
  requireWorkspaceAccess(),
  async (req, res, next) => {
    try {
      const { title, category, description, storage_path, filename, size_bytes, content_type } = req.body;
      if (!title) return res.status(400).json({ error: 'title required' });

      const { rows } = await db.query(
        `INSERT INTO documents
           (workspace_id, title, category, description, storage_path, filename, size_bytes, content_type, uploader_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          req.workspace.id,
          title,
          category || 'general',
          description || null,
          storage_path || null,
          filename || null,
          size_bytes || null,
          content_type || null,
          req.user.id,
        ]
      );

      res.status(201).json({ document: rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

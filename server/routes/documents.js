// Legacy /api/documents routes retained for backward compatibility.
// New workspace-scoped document access is at /api/portal/:workspaceSlug/documents
const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate, documentSchema } = require('../validation/schemas');
const { supabaseAdmin } = require('../services/supabaseAdmin');
const db = require('../services/db');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'documents';
const SIGNED_URL_TTL = 3600;

// GET /api/documents — admin/developer/operations/legal only; returns all docs cross-workspace
router.get('/', requireAuth, requireRole('admin', 'operations', 'legal', 'developer', 'super_admin'), async (req, res, next) => {
  try {
    const { workspace_id } = req.query;
    const params = [];
    let where = '';
    if (workspace_id) {
      params.push(workspace_id);
      where = 'WHERE d.workspace_id = $1';
    }

    const { rows } = await db.query(
      `SELECT d.id, d.workspace_id, d.title, d.category, d.description, d.filename,
              d.size_bytes, d.content_type, d.storage_path, d.created_at,
              u.email AS uploaded_by, w.slug AS workspace_slug
       FROM documents d
       LEFT JOIN users u ON u.auth_id = d.uploader_id
       LEFT JOIN workspaces w ON w.id = d.workspace_id
       ${where}
       ORDER BY d.created_at DESC`,
      params
    );

    // Generate signed URLs
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

    res.json({ documents });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents/upload-url
router.post('/upload-url', requireAuth, requireRole('admin', 'operations', 'legal', 'developer', 'super_admin'), async (req, res, next) => {
  try {
    const { filename, workspace_slug } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const ext = filename.split('.').pop();
    const prefix = workspace_slug || 'general';
    const storagePath = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) throw error;

    res.json({ path: storagePath, token: data.token, signed_url: data.signedUrl });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents
router.post('/', requireAuth, requireRole('admin', 'operations', 'legal', 'developer', 'super_admin'), validate(documentSchema), async (req, res, next) => {
  try {
    const { title, category, description, storage_path, filename, size_bytes, content_type, workspace_id } = req.body;

    const { rows } = await db.query(
      `INSERT INTO documents
         (workspace_id, title, category, description, storage_path, filename, size_bytes, content_type, uploader_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [workspace_id || null, title, category, description || null, storage_path || null,
       filename || null, size_bytes || null, content_type || null, req.user.id]
    );
    res.status(201).json({ document: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

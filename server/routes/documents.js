const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate, documentSchema } = require('../validation/schemas');
const { supabaseAdmin } = require('../services/supabaseAdmin');
const db = require('../services/db');

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'documents';

// GET /api/documents — restricted to admin, operations, legal
router.get('/', requireAuth, requireRole('admin', 'operations', 'legal'), async (req, res, next) => {
  try {
    const { rows } = await db.query(
      // uploader_id stores the Supabase auth UUID (users.auth_id), not users.id
      `SELECT d.*, u.email as uploaded_by
       FROM documents d
       LEFT JOIN users u ON u.auth_id = d.uploader_id
       ORDER BY d.created_at DESC`
    );
    res.json({ documents: rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents/upload-url — restricted to admin, operations, legal
router.post('/upload-url', requireAuth, requireRole('admin', 'operations', 'legal'), async (req, res, next) => {
  try {
    const { filename, content_type, category } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const ext = filename.split('.').pop();
    const path = `${category || 'general'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error) throw error;

    res.json({ path, token: data.token, signed_url: data.signedUrl });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents — restricted to admin, operations, legal
router.post('/', requireAuth, requireRole('admin', 'operations', 'legal'), validate(documentSchema), async (req, res, next) => {
  try {
    const { title, category, description, storage_path, filename, size_bytes, content_type } = req.body;

    // Get a public URL or signed URL for the stored file
    let public_url = null;
    if (storage_path) {
      const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storage_path);
      public_url = data?.publicUrl || null;
    }

    const { rows } = await db.query(
      `INSERT INTO documents (title, category, description, storage_path, filename, size_bytes, content_type, public_url, uploader_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, category, description || null, storage_path || null, filename || null,
       size_bytes || null, content_type || null, public_url, req.user.id]
    );
    res.status(201).json({ document: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

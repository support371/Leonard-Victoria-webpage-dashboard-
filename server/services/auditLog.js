const db = require('./db');

/**
 * Create an audit log entry. Never throws — audit failures must not crash callers.
 * @param {object} opts
 * @param {string|null}  [opts.workspace_id]   - UUID of the workspace context (null for global actions)
 * @param {string}        opts.action          - e.g. 'application.approved'
 * @param {string}        opts.actor_id        - Supabase auth UUID of the acting user
 * @param {string}       [opts.actor_email]
 * @param {string}        opts.resource_type   - e.g. 'application'
 * @param {string|number}[opts.resource_id]
 * @param {object}       [opts.metadata]
 */
async function createAuditLog({ workspace_id, action, actor_id, actor_email, resource_type, resource_id, metadata }) {
  try {
    await db.query(
      `INSERT INTO audit_logs (workspace_id, action, actor_id, actor_email, resource_type, resource_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        workspace_id || null,
        action,
        actor_id,
        actor_email || null,
        resource_type,
        resource_id?.toString() || null,
        JSON.stringify(metadata || {}),
      ]
    );
  } catch (err) {
    console.error('Audit log insert failed:', err.message);
  }
}

module.exports = { createAuditLog };

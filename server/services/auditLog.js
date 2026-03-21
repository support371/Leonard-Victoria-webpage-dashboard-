const db = require('./db');

/**
 * Create an audit log entry.
 * @param {object} opts
 * @param {string} opts.action - e.g. 'application.approved'
 * @param {string} opts.actor_id - UUID of the acting user
 * @param {string} [opts.actor_email]
 * @param {string} opts.resource_type - e.g. 'application'
 * @param {string|number} [opts.resource_id]
 * @param {object} [opts.metadata]
 */
async function createAuditLog({ action, actor_id, actor_email, resource_type, resource_id, metadata }) {
  try {
    await db.query(
      `INSERT INTO audit_logs (action, actor_id, actor_email, resource_type, resource_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [action, actor_id, actor_email || null, resource_type, resource_id?.toString() || null, JSON.stringify(metadata || {})]
    );
  } catch (err) {
    // Audit log failures should not crash the main request
    console.error('Audit log insert failed:', err.message);
  }
}

module.exports = { createAuditLog };

const { supabaseAdmin } = require('../services/supabaseAdmin');
const db = require('../services/db');

/**
 * Verify Supabase JWT. Attaches req.user (Supabase user object).
 * Also loads req.userProfile from user_profiles and sets req.globalRole.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }
  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;

  // Load DB-managed profile for role resolution
  try {
    const { rows } = await db.query(
      'SELECT * FROM user_profiles WHERE id = $1',
      [user.id]
    );
    if (rows.length) {
      req.userProfile = rows[0];
      req.globalRole = rows[0].global_role;
    } else {
      // Fall back to Supabase user_metadata role if no DB profile exists yet
      req.globalRole = user.user_metadata?.role || 'member';
    }
  } catch (_) {
    // DB unavailable — degrade gracefully to metadata role
    req.globalRole = user.user_metadata?.role || 'member';
  }

  next();
}

/**
 * Require one of the specified global roles.
 * Must be used after requireAuth.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.globalRole;
    const isPrivileged = ['super_admin', 'developer'].includes(role);
    if (!isPrivileged && !roles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };

const { supabaseAdmin } = require('../services/supabaseAdmin');

/**
 * Require a valid Supabase JWT.
 * Attaches req.user on success.
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
  next();
}

/**
 * Require one of the specified roles.
 * Must be used after requireAuth.
 * @param {...string} roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role;
    const isAdmin = userRole === 'admin';
    if (!isAdmin && !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };

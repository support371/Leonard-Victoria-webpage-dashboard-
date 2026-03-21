const db = require('../services/db');

/**
 * Verify the authenticated user has access to the workspace identified by
 * req.params[slugParam] (default 'workspaceSlug').
 *
 * Attaches:
 *   req.workspace           — the workspaces row
 *   req.workspaceMembership — the workspace_memberships row (null for super_admin/developer)
 *   req.workspaceRole       — the user's role within the workspace
 *
 * super_admin and developer bypass membership checks and have full access.
 */
function requireWorkspaceAccess(slugParam = 'workspaceSlug') {
  return async (req, res, next) => {
    const slug = req.params[slugParam];
    const userId = req.user?.id;
    const globalRole = req.globalRole;

    if (!slug || !userId) {
      return res.status(400).json({ error: 'Workspace slug and auth required' });
    }

    try {
      // Fetch workspace record
      const wsResult = await db.query(
        `SELECT * FROM workspaces WHERE slug = $1 AND status = 'active'`,
        [slug]
      );
      if (!wsResult.rows.length) {
        return res.status(404).json({ error: 'Workspace not found' });
      }
      const workspace = wsResult.rows[0];

      // super_admin and developer skip membership check
      if (['super_admin', 'developer'].includes(globalRole)) {
        req.workspace = workspace;
        req.workspaceRole = 'owner'; // effective role for privileged users
        req.workspaceMembership = null;
        return next();
      }

      // Verify active membership
      const memResult = await db.query(
        `SELECT * FROM workspace_memberships
         WHERE user_id = $1 AND workspace_id = $2 AND status = 'active'`,
        [userId, workspace.id]
      );
      if (!memResult.rows.length) {
        return res.status(403).json({ error: 'Access denied to this workspace' });
      }

      req.workspace = workspace;
      req.workspaceMembership = memResult.rows[0];
      req.workspaceRole = memResult.rows[0].workspace_role;
      next();
    } catch (err) {
      next(err);
    }
  };
}

/**
 * Require one of the specified workspace-level roles.
 * Must be used after requireWorkspaceAccess.
 * super_admin and developer always pass.
 */
function requireWorkspaceRole(...roles) {
  return (req, res, next) => {
    const globalRole = req.globalRole;
    if (['super_admin', 'developer'].includes(globalRole)) return next();

    const workspaceRole = req.workspaceRole;
    if (!roles.includes(workspaceRole)) {
      return res.status(403).json({ error: 'Insufficient workspace role' });
    }
    next();
  };
}

module.exports = { requireWorkspaceAccess, requireWorkspaceRole };

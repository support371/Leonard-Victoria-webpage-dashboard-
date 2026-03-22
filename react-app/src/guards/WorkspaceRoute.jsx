import { Navigate, useParams } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useAuth } from '../hooks/useAuth';

/**
 * Guards a route that requires membership in the workspace identified by :workspaceSlug.
 * - Redirects to /portal if user has no access to that workspace.
 * - Redirects to /login if unauthenticated.
 * - Shows a loading state while fetching workspace list.
 */
export default function WorkspaceRoute({ children }) {
  const { workspaceSlug } = useParams();
  const { session, loading: authLoading } = useAuth();
  const { data: workspaces, isLoading: wsLoading, error } = useWorkspaces();

  if (authLoading || wsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return <Navigate to="/portal" replace />;
  }

  const hasAccess = workspaces?.some((w) => w.slug === workspaceSlug);
  if (!hasAccess) {
    return <Navigate to="/portal" replace />;
  }

  return children;
}

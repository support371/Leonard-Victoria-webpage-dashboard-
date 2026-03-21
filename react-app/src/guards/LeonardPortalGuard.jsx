import { Navigate } from 'react-router-dom';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useAuth } from '../hooks/useAuth';

/**
 * Guards all /portal/leonard/* routes.
 * Requires authentication + active membership in the 'leonard' workspace.
 * super_admin and developer are included in the workspaces/mine response automatically.
 */
export default function LeonardPortalGuard({ children }) {
  const { session, loading: authLoading } = useAuth();
  const { data: workspaces, isLoading: wsLoading, error } = useWorkspaces();

  if (authLoading || wsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-navy-700 border-t-transparent" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (error)    return <Navigate to="/portal" replace />;

  const hasAccess = workspaces?.some((w) => w.slug === 'leonard');
  if (!hasAccess) return <Navigate to="/portal" replace />;

  return children;
}

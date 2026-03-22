import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Loader2 } from 'lucide-react';

export default function VictoriaPortalGuard({ children }) {
  const { session, loading: authLoading } = useAuth();
  const { data: workspaces, isLoading: wsLoading, error } = useWorkspaces();

  if (authLoading || wsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-950">
        <Loader2 className="animate-spin h-8 w-8 text-purple-400" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (error)    return <Navigate to="/portal" replace />;

  const hasAccess = workspaces?.some((w) => w.slug === 'victoria');
  if (!hasAccess) return <Navigate to="/portal" replace />;

  return children;
}

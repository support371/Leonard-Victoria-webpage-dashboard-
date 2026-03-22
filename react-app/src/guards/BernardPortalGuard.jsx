import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Loader2 } from 'lucide-react';

export default function BernardPortalGuard({ children }) {
  const { session, loading: authLoading } = useAuth();
  const { data: workspaces, isLoading: wsLoading, error } = useWorkspaces();

  if (authLoading || wsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-400" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (error)    return <Navigate to="/portal" replace />;

  const hasAccess = workspaces?.some((w) => w.slug === 'bernard');
  if (!hasAccess) return <Navigate to="/portal" replace />;

  return children;
}

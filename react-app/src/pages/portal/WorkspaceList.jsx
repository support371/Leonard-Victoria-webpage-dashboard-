import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, ShieldAlert } from 'lucide-react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useAuth } from '../../hooks/useAuth';

const WORKSPACE_COLORS = {
  leonard:   'bg-blue-100 text-blue-700',
  victoria:  'bg-purple-100 text-purple-700',
  bernard:   'bg-emerald-100 text-emerald-700',
  developer: 'bg-orange-100 text-orange-700',
};

export default function WorkspaceList() {
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const { session } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-red-400 mb-3" />
          <p className="text-gray-600">Failed to load workspaces. Please refresh.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-navy-900">Your Portals</h1>
          <p className="mt-2 text-gray-500">
            Select a workspace to access its portal.
          </p>
          {session?.user?.email && (
            <p className="mt-1 text-sm text-gray-400">Signed in as {session.user.email}</p>
          )}
        </div>

        {workspaces?.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No workspaces assigned</p>
            <p className="text-gray-400 text-sm mt-1">
              Contact an administrator to be granted access.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {workspaces?.map((ws) => {
            const colorClass = WORKSPACE_COLORS[ws.slug] || 'bg-gray-100 text-gray-700';
            const isDeveloper = ws.slug === 'developer';

            return (
              <button
                key={ws.id}
                onClick={() =>
                  navigate(isDeveloper ? '/portal/developer' : `/portal/${ws.slug}`)
                }
                className="group relative flex items-center gap-4 rounded-xl bg-white border border-gray-200 px-6 py-5 text-left shadow-sm hover:shadow-md hover:border-navy-400 transition-all"
              >
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-lg font-bold ${colorClass}`}>
                  {ws.name?.[0]?.toUpperCase() || ws.slug[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-900 truncate">{ws.name}</p>
                  <p className="text-sm text-gray-400 truncate capitalize">
                    {ws.workspace_role} · {ws.workspace_type || 'workspace'}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-300 group-hover:text-navy-500 transition-colors flex-shrink-0"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

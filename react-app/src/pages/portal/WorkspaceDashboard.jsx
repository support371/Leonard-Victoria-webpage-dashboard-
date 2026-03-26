import { useParams } from 'react-router-dom';
import {
  Users,
  FileText,
  ClipboardList,
  CalendarDays,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useWorkspaceDashboard } from '../../hooks/useWorkspaces';
import StatsCard from '../../components/ui/StatsCard';

function ActivityItem({ action, actor, timestamp }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="h-8 w-8 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
        <Activity size={14} className="text-navy-600" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{action}</p>
        <p className="text-xs text-gray-400">
          {actor} · {timestamp}
        </p>
      </div>
    </div>
  );
}

export default function WorkspaceDashboard() {
  const { workspaceSlug } = useParams();
  const { data, isLoading, error } = useWorkspaceDashboard(workspaceSlug);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-navy-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
        Failed to load dashboard data.
      </div>
    );
  }

  const { workspace, stats, recent_activity } = data || {};

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto min-h-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">{workspace?.name || workspaceSlug}</h1>
        <p className="text-gray-500 capitalize text-sm mt-1">
          {workspace?.workspace_type} · Role: {data?.workspace_role}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Active Members"
          value={stats?.active_members ?? '—'}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Pending Applications"
          value={stats?.pending_applications ?? '—'}
          icon={ClipboardList}
          color="yellow"
        />
        <StatsCard
          title="Documents"
          value={stats?.documents ?? '—'}
          icon={FileText}
          color="purple"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats?.upcoming_events ?? '—'}
          icon={CalendarDays}
          color="green"
        />
        <StatsCard
          title="Monthly Revenue"
          value={stats?.monthly_revenue != null ? `$${stats.monthly_revenue.toLocaleString()}` : '—'}
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-navy-900">Recent Activity</h2>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          {recent_activity?.length ? (
            recent_activity.map((item, i) => (
              <ActivityItem
                key={i}
                action={item.action}
                actor={item.actor}
                timestamp={item.timestamp}
              />
            ))
          ) : (
            <p className="py-6 text-sm text-gray-400 text-center">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}

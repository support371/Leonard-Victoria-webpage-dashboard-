import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import StatsCard from '../../components/ui/StatsCard';
import { apiClient } from '../../lib/api';

export default function PortalDashboard() {
  const { user, role } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard');
      return res.data;
    },
  });

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email} · {role || 'member'}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Members"
            value={stats?.total_members ?? '—'}
            trend={stats?.member_growth}
            subtitle="vs last month"
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Pending Applications"
            value={stats?.pending_applications ?? '—'}
            subtitle="awaiting review"
            icon={FileText}
            color="amber"
          />
          <StatsCard
            title="Upcoming Events"
            value={stats?.upcoming_events ?? '—'}
            subtitle="in next 30 days"
            icon={Calendar}
            color="purple"
          />
          <StatsCard
            title="Monthly Revenue"
            value={stats?.monthly_revenue ? `$${stats.monthly_revenue.toLocaleString()}` : '—'}
            trend={stats?.revenue_growth}
            subtitle="membership dues"
            icon={DollarSign}
            color="green"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {data?.recent_activity?.length > 0 ? (
            <ul className="space-y-3">
              {data.recent_activity.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-navy-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-gray-800">{item.action}</span>
                    <span className="text-gray-400 ml-2 text-xs">{item.timestamp}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No recent activity.</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Upload a document', href: '/portal/documents' },
              { label: 'View member list', href: '/portal/members' },
              { label: 'Browse events', href: '/events' },
              { label: 'Contact staff', href: '/contact' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="block px-4 py-2.5 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-navy-300 transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

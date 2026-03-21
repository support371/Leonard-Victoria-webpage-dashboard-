import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, Users, TrendingUp, Loader2, Activity } from 'lucide-react';
import { useBernardDashboard } from '../../../hooks/useBernard';

function KpiCard({ label, value, sub, color = 'text-emerald-900', icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon size={18} className="text-emerald-600" />
        </div>}
      </div>
    </div>
  );
}

export default function BernardDashboard() {
  const { data, isLoading, error } = useBernardDashboard();
  const navigate = useNavigate();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-6 w-6 text-emerald-500" /></div>;
  if (error)     return <div className="p-8 text-red-500 text-sm">{error.message}</div>;

  const { programs, events, members, enrollments, upcoming_events, top_programs, recent_activity } = data || {};

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-emerald-950">Community Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bernard workspace — programs &amp; community dashboard</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Programs"  value={programs?.active_programs}   icon={BookOpen}
          sub={`${programs?.total_enrolled || 0} enrolled`} />
        <KpiCard label="Upcoming Events"  value={events?.upcoming_events}     icon={CalendarDays}
          sub={`${events?.total_events || 0} total`} color="text-blue-700" />
        <KpiCard label="Active Members"   value={members?.active_members}     icon={Users}
          sub={`${members?.new_this_month || 0} new this month`} color="text-green-700" />
        <KpiCard label="Completions"      value={enrollments?.completed}      icon={TrendingUp}
          sub="program completions" color="text-orange-700" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Programs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-emerald-900">Top Programs</h2>
            <button onClick={() => navigate('/portal/bernard/programs')} className="text-xs text-emerald-600 hover:text-emerald-800">View all →</button>
          </div>
          {!top_programs?.length ? (
            <p className="text-xs text-gray-400 py-4 text-center">No active programs yet.</p>
          ) : (
            <div className="space-y-3">
              {top_programs.map((p) => {
                const pct = p.capacity ? Math.min(100, Math.round((p.enrolled_count / p.capacity) * 100)) : 0;
                return (
                  <div key={p.id} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-emerald-900 truncate">{p.name}</span>
                      <span className="text-gray-500 ml-2 flex-shrink-0">{p.enrolled_count}/{p.capacity || '∞'}</span>
                    </div>
                    {p.capacity && (
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <p className="text-xs text-gray-400 capitalize mt-1">{p.category}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-emerald-900">Upcoming Events</h2>
            <button onClick={() => navigate('/portal/bernard/events')} className="text-xs text-emerald-600 hover:text-emerald-800">View all →</button>
          </div>
          {!upcoming_events?.length ? (
            <p className="text-xs text-gray-400 py-4 text-center">No upcoming events.</p>
          ) : (
            <div className="space-y-3">
              {upcoming_events.map((e) => (
                <div key={e.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CalendarDays size={14} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-emerald-900 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400">{new Date(e.event_date).toLocaleDateString()}{e.location && ` · ${e.location}`}</p>
                  </div>
                  {e.member_only && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0">Members</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-emerald-900 mb-4 flex items-center gap-2"><Activity size={14} /> Recent Activity</h2>
        {!recent_activity?.length ? (
          <p className="text-xs text-gray-400 py-4 text-center">No recent activity.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent_activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Activity size={12} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{item.action.replace('.', ' — ')}</p>
                  <p className="text-xs text-gray-400">{item.actor_email} · {new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Programs', path: '/portal/bernard/programs', icon: BookOpen },
          { label: 'Events',   path: '/portal/bernard/events',   icon: CalendarDays },
          { label: 'Members',  path: '/portal/bernard/members',  icon: Users },
          { label: 'Settings', path: '/portal/bernard/settings', icon: TrendingUp },
        ].map(({ label, path, icon: Icon }) => (
          <button key={path} onClick={() => navigate(path)}
            className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-emerald-800">
            <Icon size={16} className="text-emerald-500" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

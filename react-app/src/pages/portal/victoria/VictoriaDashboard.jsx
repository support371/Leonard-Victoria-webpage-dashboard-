import { useNavigate } from 'react-router-dom';
import {
  CalendarClock, ScrollText, Users2, FileText,
  CheckCircle2, Clock, Loader2, Activity,
} from 'lucide-react';
import { useVictoriaDashboard } from '../../../hooks/useVictoria';

function KpiCard({ label, value, sub, color = 'text-purple-900', icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
          <Icon size={18} className="text-purple-600" />
        </div>}
      </div>
    </div>
  );
}

export default function VictoriaDashboard() {
  const { data, isLoading, error } = useVictoriaDashboard();
  const navigate = useNavigate();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>;
  if (error)     return <div className="p-8 text-red-500 text-sm">{error.message}</div>;

  const { meetings, resolutions, committees, documents, upcoming, recent_activity } = data || {};

  const fmt = (ts) => ts ? new Date(ts).toLocaleDateString() : '—';
  const fmtTime = (ts) => ts ? new Date(ts).toLocaleString() : '—';

  const MEETING_TYPE_LABEL = {
    board: 'Board', committee: 'Committee', general_membership: 'General',
    working_group: 'Working Group', other: 'Other',
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-purple-950">Governance Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Victoria workspace — governance dashboard</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Upcoming Meetings"   value={meetings?.upcoming_meetings}  icon={CalendarClock}
          sub={`${meetings?.total_meetings || 0} total`} />
        <KpiCard label="Active Resolutions"  value={resolutions?.under_review}    icon={ScrollText}
          sub={`${resolutions?.passed || 0} passed`}    color="text-green-700" />
        <KpiCard label="Committees"          value={committees?.active_committees} icon={Users2}
          sub="active"  />
        <KpiCard label="Governance Docs"     value={documents?.governance_docs}    icon={FileText}
          sub={`${documents?.total_documents || 0} total docs`} />
      </div>

      {/* Resolution Summary */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-purple-900 mb-4">Resolution Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Passed',       value: resolutions?.passed,       color: 'bg-green-500' },
              { label: 'Proposed',     value: resolutions?.proposed,     color: 'bg-purple-400' },
              { label: 'Under Review', value: resolutions?.under_review, color: 'bg-yellow-400' },
            ].map(({ label, value, color }) => {
              const total = (resolutions?.total_resolutions || 1);
              const pct = Math.round(((value || 0) / total) * 100);
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-medium text-gray-800">{value || 0}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-purple-900">Upcoming Meetings</h2>
            <button onClick={() => navigate('/portal/victoria/meetings')}
              className="text-xs text-purple-600 hover:text-purple-800">View all →</button>
          </div>
          {!upcoming?.length ? (
            <p className="text-xs text-gray-400 py-4 text-center">No upcoming meetings scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <CalendarClock size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{m.title}</p>
                    <p className="text-xs text-gray-400">{MEETING_TYPE_LABEL[m.meeting_type]} · {fmt(m.meeting_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
          <Activity size={14} /> Recent Activity
        </h2>
        {!recent_activity?.length ? (
          <p className="text-xs text-gray-400 py-4 text-center">No recent activity.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent_activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Activity size={12} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{item.action.replace('.', ' — ')}</p>
                  <p className="text-xs text-gray-400">{item.actor_email} · {fmtTime(item.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Meetings',    path: '/portal/victoria/meetings',   icon: CalendarClock },
          { label: 'Resolutions', path: '/portal/victoria/resolutions', icon: ScrollText },
          { label: 'Committees',  path: '/portal/victoria/committees',  icon: Users2 },
          { label: 'Documents',   path: '/portal/victoria/documents',   icon: FileText },
        ].map(({ label, path, icon: Icon }) => (
          <button key={path} onClick={() => navigate(path)}
            className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-purple-800">
            <Icon size={16} className="text-purple-500" /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

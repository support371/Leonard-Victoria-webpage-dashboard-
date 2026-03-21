import { useNavigate } from 'react-router-dom';
import {
  CalendarClock, ScrollText, Users2, FileText, ChevronRight,
  CheckCircle2, Clock, Loader2, Activity, MessageSquare,
  CalendarDays, Bell, TrendingUp, UserPlus, AlertCircle,
} from 'lucide-react';
import { useVictoriaDashboard } from '../../../hooks/useVictoria';

// ─── Seeded Data ──────────────────────────────────────────────────────────────

const SEED_KPIS = [
  { label: 'Upcoming Meetings',       value: '3',   sub: 'next: Board Meeting Mar 28', icon: CalendarClock, bg: 'bg-purple-50',  iconColor: 'text-purple-600' },
  { label: 'Active Resolutions',      value: '5',   sub: '2 pending vote',            icon: ScrollText,    bg: 'bg-indigo-50',  iconColor: 'text-indigo-600' },
  { label: 'Committees',              value: '4',   sub: 'Finance, Legal, Membership, Programs', icon: Users2, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
  { label: 'Governance Docs',         value: '28',  sub: 'total on file',             icon: FileText,      bg: 'bg-blue-50',    iconColor: 'text-blue-600'   },
  { label: 'Active Members',          value: '145', sub: '+12 this quarter',          icon: Users2,        bg: 'bg-green-50',   iconColor: 'text-green-600'  },
  { label: 'Pending Communications',  value: '7',   sub: '3 high priority',           icon: Bell,          bg: 'bg-amber-50',   iconColor: 'text-amber-600'  },
  { label: 'Events This Month',       value: '3',   sub: 'next: Mar 24',              icon: CalendarDays,  bg: 'bg-pink-50',    iconColor: 'text-pink-600'   },
  { label: 'Content Items',           value: '15',  sub: '4 pending review',          icon: FileText,      bg: 'bg-teal-50',    iconColor: 'text-teal-600'   },
];

const SEED_MEETINGS = [
  {
    id: 1, title: 'Board Meeting — Q1 Review',
    type: 'Board', date: 'March 28, 2026', time: '10:00 AM',
    attendees: 12, agenda: 'Financial review, strategic planning, officer reports',
  },
  {
    id: 2, title: 'Finance Committee Meeting',
    type: 'Committee', date: 'March 24, 2026', time: '2:00 PM',
    attendees: 5, agenda: 'Budget reconciliation, Q2 projections, audit review',
  },
  {
    id: 3, title: 'Membership Drive Planning',
    type: 'Working Group', date: 'April 2, 2026', time: '11:00 AM',
    attendees: 7, agenda: 'Spring outreach strategy, new member onboarding, referral program',
  },
  {
    id: 4, title: 'Legal & Compliance Review',
    type: 'Committee', date: 'April 8, 2026', time: '9:30 AM',
    attendees: 4, agenda: 'PMA structure review, document updates, compliance checklist',
  },
  {
    id: 5, title: 'General Membership Assembly',
    type: 'General', date: 'April 15, 2026', time: '6:00 PM',
    attendees: 80, agenda: 'Annual report, resolution votes, community announcements',
  },
];

const SEED_RESOLUTIONS = [
  { id: 1, title: 'Resolution 2026-01: Q2 Budget Approval',     status: 'Passed',       votes: '11-1-1', date: 'Mar 10, 2026' },
  { id: 2, title: 'Resolution 2026-02: Bylaw Amendment Sec. 4', status: 'Pending Vote', votes: '—',      date: 'Mar 28, 2026' },
  { id: 3, title: 'Resolution 2026-03: New Member Fee Schedule', status: 'Under Review', votes: '—',     date: 'Apr 2, 2026'  },
  { id: 4, title: 'Resolution 2026-04: Events Committee Charter',status: 'Pending Vote', votes: '—',     date: 'Mar 28, 2026' },
  { id: 5, title: 'Resolution 2025-12: Annual Audit Acceptance', status: 'Passed',       votes: '13-0-0', date: 'Dec 5, 2025' },
];

const SEED_MEMBER_GROWTH = [
  { month: 'Oct', count: 118 },
  { month: 'Nov', count: 124 },
  { month: 'Dec', count: 127 },
  { month: 'Jan', count: 131 },
  { month: 'Feb', count: 138 },
  { month: 'Mar', count: 145 },
];

const SEED_RECENT_JOINS = [
  { name: 'Sandra K.', date: 'Mar 19, 2026', tier: 'General' },
  { name: 'Thomas W.', date: 'Mar 17, 2026', tier: 'Founding' },
  { name: 'Aisha P.',  date: 'Mar 15, 2026', tier: 'General' },
  { name: 'Carlos M.', date: 'Mar 12, 2026', tier: 'Associate' },
];

const SEED_COMMUNICATIONS = [
  { id: 1, subject: 'Board Meeting Agenda — March 28',          priority: 'High',   type: 'Email',         recipient: 'All Board Members',   due: 'Mar 25, 2026' },
  { id: 2, subject: 'Resolution 2026-02 Vote Reminder',         priority: 'High',   type: 'Email',         recipient: 'Voting Members',       due: 'Mar 26, 2026' },
  { id: 3, subject: 'Spring Events Newsletter',                  priority: 'Medium', type: 'Newsletter',    recipient: 'All Members',          due: 'Mar 28, 2026' },
  { id: 4, subject: 'Finance Committee Prep Notes',             priority: 'Medium', type: 'Internal Memo', recipient: 'Finance Committee',    due: 'Mar 23, 2026' },
  { id: 5, subject: 'Welcome Package — New Members (March)',    priority: 'Low',    type: 'Email',         recipient: '4 new members',        due: 'Mar 29, 2026' },
  { id: 6, subject: 'Membership Renewal Reminder — Q2',        priority: 'Medium', type: 'Email',         recipient: '18 members',           due: 'Apr 1, 2026'  },
  { id: 7, subject: 'Annual Report Draft for Review',           priority: 'High',   type: 'Document',      recipient: 'Board & Officers',     due: 'Mar 27, 2026' },
];

const PRIORITY_STYLES = {
  High:   'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low:    'bg-gray-100 text-gray-600 border border-gray-200',
};

const RESOLUTION_STATUS_STYLES = {
  Passed:       'bg-green-100 text-green-700',
  'Pending Vote':'bg-amber-100 text-amber-700',
  'Under Review':'bg-blue-100 text-blue-700',
  Failed:       'bg-red-100 text-red-600',
};

const MEETING_TYPE_COLOR = {
  Board:        'bg-purple-100 text-purple-700',
  Committee:    'bg-indigo-100 text-indigo-700',
  'Working Group':'bg-teal-100 text-teal-700',
  General:      'bg-blue-100 text-blue-700',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VictoriaDashboard() {
  const { data, isLoading } = useVictoriaDashboard?.() || {};
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const maxGrowth = Math.max(...SEED_MEMBER_GROWTH.map((m) => m.count));

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <span className="text-gray-500 font-medium">Victoria Portal</span>
            <ChevronRight size={12} />
            <span className="text-purple-700 font-semibold">Operations Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-purple-950">Operations Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <Activity size={14} className="text-purple-600" />
          <span className="text-xs font-semibold text-purple-700">145 Active Members</span>
        </div>
      </div>

      {/* ── KPI Row (8 cards) ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SEED_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-500 leading-tight">{kpi.label}</p>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={kpi.iconColor} />
                </div>
              </div>
              <p className="text-xl font-bold text-purple-950">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Upcoming Meetings + Resolution Status ───────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-purple-900">Upcoming Meetings</h2>
            <button
              onClick={() => navigate('/portal/victoria/meetings')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {SEED_MEETINGS.map((m) => (
              <div key={m.id} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <CalendarClock size={15} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{m.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${MEETING_TYPE_COLOR[m.type] || 'bg-gray-100 text-gray-600'}`}>
                      {m.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{m.date} · {m.time} · {m.attendees} attendees</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{m.agenda}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution Status */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-purple-900">Resolution Status</h2>
            <button
              onClick={() => navigate('/portal/victoria/resolutions')}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {SEED_RESOLUTIONS.map((r) => (
              <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <ScrollText size={13} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{r.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {r.votes !== '—' ? `Vote: ${r.votes} · ` : ''}{r.date}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${RESOLUTION_STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600'}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>

          {/* Quick summary */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
            <span><strong className="text-green-700">2</strong> Passed</span>
            <span><strong className="text-amber-700">2</strong> Pending Vote</span>
            <span><strong className="text-blue-700">1</strong> Under Review</span>
          </div>
        </div>
      </div>

      {/* ── Member Growth + Recent Joins ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Member Growth Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-purple-900">Community Engagement — Member Growth</h2>
            <span className="text-xs text-gray-400 bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              +12 this quarter
            </span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {SEED_MEMBER_GROWTH.map((m) => {
              const heightPct = Math.round((m.count / maxGrowth) * 100);
              return (
                <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[10px] text-gray-500 font-medium">{m.count}</span>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className="w-full rounded-t-sm bg-purple-400 hover:bg-purple-500 transition-colors"
                      style={{ height: `${heightPct}%` }}
                      title={`${m.month}: ${m.count} members`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
            <span>6-month trend</span>
            <span className="font-medium text-purple-800">145 total active members</span>
          </div>
        </div>

        {/* Recent Joins */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={14} className="text-purple-500" />
            <h2 className="text-sm font-semibold text-purple-900">Recent Joins</h2>
          </div>
          <div className="space-y-3">
            {SEED_RECENT_JOINS.map((member, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-700">{member.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">{member.name}</p>
                  <p className="text-[11px] text-gray-400">{member.tier} · {member.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate('/portal/victoria/members')}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium"
            >
              View all members →
            </button>
          </div>
        </div>
      </div>

      {/* ── Communication Queue ──────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-purple-500" />
            <h2 className="text-sm font-semibold text-purple-900">Communication Queue</h2>
          </div>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            7 pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-2 text-gray-500 font-medium">Subject</th>
                <th className="text-left py-2 px-2 text-gray-500 font-medium">Type</th>
                <th className="text-left py-2 px-2 text-gray-500 font-medium">Recipient</th>
                <th className="text-left py-2 px-2 text-gray-500 font-medium">Priority</th>
                <th className="text-left py-2 px-2 text-gray-500 font-medium">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {SEED_COMMUNICATIONS.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-2 font-medium text-gray-800">{c.subject}</td>
                  <td className="py-2.5 px-2 text-gray-500">{c.type}</td>
                  <td className="py-2.5 px-2 text-gray-500">{c.recipient}</td>
                  <td className="py-2.5 px-2">
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_STYLES[c.priority]}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-gray-500">{c.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick Nav ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Meetings',    path: '/portal/victoria/meetings',    icon: CalendarClock },
          { label: 'Resolutions', path: '/portal/victoria/resolutions', icon: ScrollText    },
          { label: 'Committees',  path: '/portal/victoria/committees',  icon: Users2        },
          { label: 'Documents',   path: '/portal/victoria/documents',   icon: FileText      },
        ].map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-purple-800"
          >
            <Icon size={16} className="text-purple-500" /> {label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-xs text-gray-500 z-50">
          <Loader2 size={12} className="animate-spin" />
          Syncing live data…
        </div>
      )}
    </div>
  );
}

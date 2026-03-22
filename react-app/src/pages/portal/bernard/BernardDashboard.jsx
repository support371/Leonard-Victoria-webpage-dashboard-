import { useNavigate } from 'react-router-dom';
import {
  BookOpen, FileText, Users, ShieldCheck, ClipboardList,
  AlertCircle, CheckCircle2, Clock, Activity, Loader2,
  ChevronRight, FolderOpen, Scale, Gavel, TrendingUp,
} from 'lucide-react';
import { useBernardDashboard } from '../../../hooks/useBernard';

// ─── Seeded Data ──────────────────────────────────────────────────────────────

const SEED_KPIS = [
  { label: 'Governance Documents', value: '34',  sub: 'total on file',            icon: BookOpen,      bg: 'bg-emerald-50',  iconColor: 'text-emerald-600' },
  { label: 'Legal Reviews Pending',value: '5',   sub: '2 urgent',                 icon: Scale,         bg: 'bg-amber-50',    iconColor: 'text-amber-600'   },
  { label: 'Active PMA Members',   value: '145', sub: '+12 this quarter',         icon: Users,         bg: 'bg-blue-50',     iconColor: 'text-blue-600'    },
  { label: 'Agreements on File',   value: '23',  sub: 'signed & executed',        icon: FileText,      bg: 'bg-violet-50',   iconColor: 'text-violet-600'  },
  { label: 'Approved This Month',  value: '8',   sub: 'documents approved',       icon: CheckCircle2,  bg: 'bg-green-50',    iconColor: 'text-green-600'   },
  { label: 'Review Queue',         value: '5',   sub: 'awaiting review',          icon: ClipboardList, bg: 'bg-orange-50',   iconColor: 'text-orange-600'  },
  { label: 'Compliance Items',     value: '3',   sub: 'action required',          icon: ShieldCheck,   bg: 'bg-red-50',      iconColor: 'text-red-500'     },
  { label: 'Document Updates',     value: '12',  sub: 'this month',               icon: TrendingUp,    bg: 'bg-teal-50',     iconColor: 'text-teal-600'    },
];

const SEED_KEY_DOCUMENTS = [
  { id: 1,  title: 'PMA Charter — Founding Document',            category: 'PMA',       status: 'Active',   lastReviewed: 'Feb 14, 2026', version: 'v3.1' },
  { id: 2,  title: 'PMA Bylaws — Amended 2025',                 category: 'PMA',       status: 'Active',   lastReviewed: 'Jan 8, 2026',  version: 'v5.0' },
  { id: 3,  title: 'FBO Articles of Incorporation',             category: 'FBO',       status: 'Active',   lastReviewed: 'Mar 1, 2026',  version: 'v1.2' },
  { id: 4,  title: 'FBO Operating Agreement',                   category: 'FBO',       status: 'Review',   lastReviewed: 'Feb 28, 2026', version: 'v2.0' },
  { id: 5,  title: 'Member Services Agreement — Standard',      category: 'Agreement', status: 'Active',   lastReviewed: 'Jan 20, 2026', version: 'v4.1' },
  { id: 6,  title: 'Confidentiality & NDA Template',            category: 'Agreement', status: 'Active',   lastReviewed: 'Mar 10, 2026', version: 'v2.3' },
  { id: 7,  title: 'Board Meeting Minutes — Q4 2025',           category: 'Minutes',   status: 'Filed',    lastReviewed: 'Jan 5, 2026',  version: 'final' },
  { id: 8,  title: 'Annual Compliance Report 2025',             category: 'Report',    status: 'Approved', lastReviewed: 'Mar 3, 2026',  version: 'v1.0' },
];

const SEED_REVIEW_QUEUE = [
  { id: 1, title: 'FBO Operating Agreement — Amendment 2026',   priority: 'Urgent', due: 'Mar 25, 2026', assignee: 'Bernard',    category: 'FBO'       },
  { id: 2, title: 'Member Services Agreement — Tier 2 Update',  priority: 'High',   due: 'Mar 28, 2026', assignee: 'Legal Team', category: 'Agreement' },
  { id: 3, title: 'Privacy Policy — HIPAA Compliance Review',   priority: 'High',   due: 'Apr 2, 2026',  assignee: 'Bernard',    category: 'Compliance'},
  { id: 4, title: 'Q1 2026 Board Meeting Minutes Draft',        priority: 'Medium', due: 'Apr 5, 2026',  assignee: 'Secretary',  category: 'Minutes'   },
  { id: 5, title: 'New Member Intake Forms — Version Update',   priority: 'Low',    due: 'Apr 15, 2026', assignee: 'Bernard',    category: 'PMA'       },
];

const RECORDS_HUB = [
  { label: 'PMA Documents',  count: 34, color: 'bg-emerald-500', icon: BookOpen,     path: '/portal/bernard/documents?cat=pma'       },
  { label: 'FBO Records',    count: 12, color: 'bg-blue-500',    icon: Scale,        path: '/portal/bernard/documents?cat=fbo'       },
  { label: 'Agreements',     count: 23, color: 'bg-violet-500',  icon: FileText,     path: '/portal/bernard/documents?cat=agreements'},
  { label: 'Meeting Minutes',count: 18, color: 'bg-amber-500',   icon: Gavel,        path: '/portal/bernard/documents?cat=minutes'   },
  { label: 'Reports',        count: 42, color: 'bg-teal-500',    icon: ClipboardList,path: '/portal/bernard/documents?cat=reports'   },
];

const ESCALATION_FLAGS = [
  {
    id: 1, title: 'FBO Operating Agreement — overdue for annual review',
    severity: 'Critical', detail: 'Last reviewed Dec 2024 — must be updated before Q2 filings',
    action: 'Assign to legal review immediately',
  },
  {
    id: 2, title: 'HIPAA Compliance Checklist — incomplete items',
    severity: 'High', detail: '3 of 12 checklist items not yet signed off by officer',
    action: 'Schedule compliance meeting by Mar 28',
  },
  {
    id: 3, title: 'New PMA Member Agreement — 6 unsigned forms',
    severity: 'Medium', detail: 'New members admitted in Feb/Mar have not returned signed forms',
    action: 'Send follow-up to 6 members by Mar 31',
  },
];

const SEED_ACTIVITY = [
  { action: 'Board Meeting Minutes Q4 2025 approved and filed',    actor: 'Bernard',     time: '1 hour ago',   type: 'minutes'    },
  { action: 'FBO Operating Agreement sent for legal review',       actor: 'Bernard',     time: '3 hours ago',  type: 'legal'      },
  { action: 'New member agreement signed — Sandra K.',            actor: 'Membership',  time: 'Yesterday',    type: 'agreement'  },
  { action: 'PMA Bylaws version 5.0 published to records hub',    actor: 'Bernard',     time: 'Yesterday',    type: 'pma'        },
  { action: 'Compliance report 2025 final version approved',      actor: 'Board',       time: '2 days ago',   type: 'compliance' },
  { action: 'Privacy Policy draft submitted for HIPAA review',    actor: 'Legal Team',  time: '2 days ago',   type: 'legal'      },
  { action: 'Annual governance audit checklist updated',          actor: 'Bernard',     time: '3 days ago',   type: 'compliance' },
  { action: 'New member intake forms template revised',           actor: 'Bernard',     time: '4 days ago',   type: 'pma'        },
  { action: 'Confidentiality NDA v2.3 activated for use',        actor: 'Bernard',     time: '5 days ago',   type: 'agreement'  },
  { action: 'Q1 2026 board meeting scheduled — agenda drafted',   actor: 'Secretary',   time: '6 days ago',   type: 'minutes'    },
];

const PRIORITY_STYLES = {
  Urgent: 'bg-red-100 text-red-700 border border-red-200',
  High:   'bg-orange-100 text-orange-700 border border-orange-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low:    'bg-gray-100 text-gray-600 border border-gray-200',
};

const SEVERITY_STYLES = {
  Critical: 'border-l-4 border-red-500 bg-red-50',
  High:     'border-l-4 border-orange-400 bg-orange-50',
  Medium:   'border-l-4 border-amber-400 bg-amber-50',
};

const SEVERITY_BADGE = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-amber-100 text-amber-700',
};

const DOC_STATUS_STYLES = {
  Active:   'bg-green-100 text-green-700',
  Review:   'bg-amber-100 text-amber-700',
  Filed:    'bg-blue-100 text-blue-700',
  Approved: 'bg-emerald-100 text-emerald-700',
};

const CATEGORY_STYLES = {
  PMA:       'bg-emerald-100 text-emerald-700',
  FBO:       'bg-blue-100 text-blue-700',
  Agreement: 'bg-violet-100 text-violet-700',
  Minutes:   'bg-amber-100 text-amber-700',
  Report:    'bg-teal-100 text-teal-700',
  Compliance:'bg-red-100 text-red-600',
};

const ACTIVITY_TYPE_COLOR = {
  minutes:    'bg-amber-100 text-amber-600',
  legal:      'bg-blue-100 text-blue-600',
  agreement:  'bg-violet-100 text-violet-600',
  pma:        'bg-emerald-100 text-emerald-600',
  compliance: 'bg-red-100 text-red-500',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BernardDashboard() {
  const { data, isLoading } = useBernardDashboard?.() || {};
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <span className="text-gray-500 font-medium">Bernard Portal</span>
            <ChevronRight size={12} />
            <span className="text-emerald-700 font-semibold">Governance Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-emerald-950">Governance Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={14} className="text-red-500" />
          <span className="text-xs font-semibold text-red-600">3 Compliance Items Need Attention</span>
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
              <p className="text-xl font-bold text-emerald-950">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Legal/Structural Documents + Review Queue ───────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Key Documents */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-emerald-900">Legal & Structural Documents</h2>
            <button
              onClick={() => navigate('/portal/bernard/documents')}
              className="text-xs text-emerald-600 hover:text-emerald-800"
            >
              View all →
            </button>
          </div>
          <div className="space-y-0 divide-y divide-gray-50">
            {SEED_KEY_DOCUMENTS.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={13} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{doc.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {doc.version} · Reviewed {doc.lastReviewed}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_STYLES[doc.category] || 'bg-gray-100 text-gray-600'}`}>
                    {doc.category}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${DOC_STATUS_STYLES[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Queue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-emerald-900">Review Queue</h2>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              5 items
            </span>
          </div>
          <div className="space-y-3">
            {SEED_REVIEW_QUEUE.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <ClipboardList size={13} className="text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-snug">{item.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {item.assignee} · Due {item.due}
                  </p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${PRIORITY_STYLES[item.priority]}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Records Hub ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FolderOpen size={14} className="text-emerald-600" />
          <h2 className="text-sm font-semibold text-emerald-900">Records Hub</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {RECORDS_HUB.map((rec) => {
            const Icon = rec.icon;
            return (
              <button
                key={rec.label}
                onClick={() => navigate(rec.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm hover:bg-emerald-50 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg ${rec.color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold text-emerald-950 group-hover:text-emerald-700">{rec.count}</span>
                <span className="text-[11px] text-gray-500 text-center leading-tight">{rec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Escalation / Approval Flags ──────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={14} className="text-red-500" />
          <h2 className="text-sm font-semibold text-emerald-900">Approval / Escalation Flags</h2>
          <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full ml-auto">
            Requires Immediate Attention
          </span>
        </div>
        <div className="space-y-3">
          {ESCALATION_FLAGS.map((flag) => (
            <div key={flag.id} className={`rounded-lg p-4 ${SEVERITY_STYLES[flag.severity]}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${SEVERITY_BADGE[flag.severity]}`}>
                      {flag.severity}
                    </span>
                    <p className="text-xs font-semibold text-gray-800">{flag.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-600 mb-1">{flag.detail}</p>
                  <p className="text-[11px] font-medium text-gray-700">Action: {flag.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Activity ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-emerald-500" />
          <h2 className="text-sm font-semibold text-emerald-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {SEED_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_TYPE_COLOR[item.type] || 'bg-gray-100 text-gray-500'}`}>
                <Activity size={12} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{item.action}</p>
                <p className="text-[11px] text-gray-400">{item.actor} · {item.time}</p>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 capitalize ${ACTIVITY_TYPE_COLOR[item.type] || 'bg-gray-100 text-gray-500'}`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Nav ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Documents',   path: '/portal/bernard/documents',  icon: BookOpen      },
          { label: 'Members',     path: '/portal/bernard/members',    icon: Users         },
          { label: 'Compliance',  path: '/portal/bernard/compliance', icon: ShieldCheck   },
          { label: 'Settings',    path: '/portal/bernard/settings',   icon: ClipboardList },
        ].map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-emerald-800"
          >
            <Icon size={16} className="text-emerald-500" /> {label}
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

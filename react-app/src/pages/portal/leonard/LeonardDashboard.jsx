import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, Building2, ShieldAlert, DollarSign,
  Activity, AlertTriangle, CheckCircle, ArrowRight, Loader2,
  Bitcoin, BarChart3, FileText, ChevronRight,
} from 'lucide-react';
import { useLeonardDashboard } from '../../../hooks/useLeonard';

// ─── Seeded Data ──────────────────────────────────────────────────────────────

const SEED_KPIS = [
  { label: 'Total Portfolio Value', value: '$2,847,350', change: '+12.3%', dir: 'up', sub: 'this quarter', icon: TrendingUp, color: 'text-navy-900', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Active Clients',        value: '14',         change: '+2',     dir: 'up', sub: 'this month',   icon: Users,     color: 'text-navy-900', bg: 'bg-green-50', iconColor: 'text-green-600' },
  { label: 'Monthly Revenue',       value: '$48,200',    change: '+8.1%',  dir: 'up', sub: 'vs last month',icon: DollarSign,color: 'text-navy-900', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { label: 'Properties',            value: '7',          change: 'stable', dir: 'flat', sub: 'under management', icon: Building2, color: 'text-navy-900', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { label: 'Digital Assets',        value: '$847,000',   change: '+22.1%', dir: 'up', sub: 'this quarter', icon: BarChart3, color: 'text-navy-900', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { label: 'Crypto Holdings',       value: '$312,500',   change: '-4.2%',  dir: 'down', sub: '7-day change', icon: Bitcoin, color: 'text-navy-900', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  { label: 'Open Incidents',        value: '2',          change: '-1',     dir: 'down', sub: 'resolved today', icon: ShieldAlert, color: 'text-navy-900', bg: 'bg-red-50', iconColor: 'text-red-500' },
];

const SEED_ALLOCATION = [
  { label: 'Real Estate',   pct: 40, color: 'bg-emerald-500', amount: '$1,138,940' },
  { label: 'Digital Assets',pct: 30, color: 'bg-blue-500',    amount: '$854,205'  },
  { label: 'Crypto',        pct: 11, color: 'bg-amber-400',   amount: '$313,209'  },
  { label: 'Cash & Other',  pct: 19, color: 'bg-gray-400',    amount: '$540,997'  },
];

const SEED_ACTIVITY = [
  { action: 'Portfolio rebalancing order executed — Q1 adjustment',    actor: 'System',         time: '2 hours ago',   type: 'portfolio' },
  { action: 'New client onboarded — Martinez Group (Tier 1)',          actor: 'Leonard',        time: '4 hours ago',   type: 'client' },
  { action: 'Property inspection completed — 4821 Oak View Dr',        actor: 'RE Team',        time: 'Yesterday',     type: 'property' },
  { action: 'Security scan completed — all systems nominal',           actor: 'Security Bot',   time: 'Yesterday',     type: 'security' },
  { action: 'Digital asset position updated — AAPL, MSFT adjusted',   actor: 'Portfolio Mgr',  time: '2 days ago',    type: 'portfolio' },
  { action: 'Client meeting notes saved — Hernandez Holdings',        actor: 'Leonard',        time: '2 days ago',    type: 'client' },
  { action: 'Crypto DCA executed — BTC purchase $5,000',              actor: 'Auto-DCA',       time: '3 days ago',    type: 'crypto' },
  { action: 'Compliance report filed — Q1 2026',                      actor: 'Leonard',        time: '3 days ago',    type: 'compliance' },
  { action: 'Threat alert resolved — phishing attempt blocked',       actor: 'Security Team',  time: '4 days ago',    type: 'security' },
  { action: 'New lease signed — 1204 Briar Lane, Unit 3B',            actor: 'Property Mgr',   time: '5 days ago',    type: 'property' },
  { action: 'Monthly revenue reconciliation completed',               actor: 'Accounting',     time: '6 days ago',    type: 'finance' },
  { action: 'Client Tier review — upgraded 3 accounts to Tier 2',    actor: 'Leonard',        time: '1 week ago',    type: 'client' },
];

const SEED_PRIORITIES = [
  { label: 'Q2 Portfolio Rebalancing',             pct: 65, color: 'bg-blue-500',    due: 'Apr 15, 2026' },
  { label: 'Client Onboarding — Martinez Group',   pct: 40, color: 'bg-green-500',   due: 'Mar 31, 2026' },
  { label: 'Real Estate Acquisition — Proposal',   pct: 25, color: 'bg-amber-500',   due: 'May 1, 2026'  },
  { label: 'Security Infrastructure Upgrade',      pct: 80, color: 'bg-purple-500',  due: 'Mar 28, 2026' },
  { label: 'Annual Compliance Filing',             pct: 90, color: 'bg-emerald-500', due: 'Mar 25, 2026' },
];

const QUICK_ACTIONS = [
  { label: 'Clients',    path: '/portal/leonard/clients',    icon: Users,      color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
  { label: 'Portfolio',  path: '/portal/leonard/portfolio',  icon: TrendingUp, color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50' },
  { label: 'Real Estate',path: '/portal/leonard/real-estate',icon: Building2,  color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' },
  { label: 'Security',   path: '/portal/leonard/security',   icon: ShieldAlert,color: 'border-orange-200 hover:border-orange-400 hover:bg-orange-50' },
  { label: 'Reports',    path: '/portal/leonard/reports',    icon: FileText,   color: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50' },
  { label: 'Repository', path: '/portal/developer',          icon: BarChart3,  color: 'border-navy-200 hover:border-navy-400 hover:bg-navy-50' },
];

const ACTIVITY_TYPE_COLOR = {
  portfolio: 'bg-blue-100 text-blue-600',
  client:    'bg-green-100 text-green-600',
  property:  'bg-amber-100 text-amber-600',
  security:  'bg-red-100 text-red-500',
  crypto:    'bg-orange-100 text-orange-500',
  compliance:'bg-purple-100 text-purple-600',
  finance:   'bg-emerald-100 text-emerald-600',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeonardDashboard() {
  const { data, isLoading } = useLeonardDashboard?.() || {};

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Leonard Portal</span>
            <ChevronRight size={12} />
            <span className="text-navy-600 font-medium">Executive Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">Executive Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={14} className="text-green-600" />
          <span className="text-xs font-semibold text-green-700">Threat Level: Low</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
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
              <p className="text-xl font-bold text-navy-900">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.dir === 'up' && <TrendingUp size={11} className="text-green-500" />}
                {kpi.dir === 'down' && <AlertTriangle size={11} className="text-red-400" />}
                <span className={`text-xs font-medium ${kpi.dir === 'up' ? 'text-green-600' : kpi.dir === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-400">{kpi.sub}</span>
              </div>
            </div>
          );
        })}

        {/* Threat Level full-width on final slot */}
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">Security Status</p>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            <div>
              <p className="text-sm font-bold text-green-700">All Clear</p>
              <p className="text-xs text-gray-400">2 minor incidents</p>
            </div>
          </div>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Low Risk</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">1 Medium</span>
          </div>
        </div>
      </div>

      {/* Asset Allocation + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Asset Allocation */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Asset Allocation</h2>
            <Link to="/portal/leonard/portfolio" className="text-xs text-navy-600 hover:text-navy-800 flex items-center gap-0.5">
              View <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {SEED_ALLOCATION.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.amount} <span className="text-gray-400">({item.pct}%)</span></span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Total Portfolio</span>
            <span className="font-bold text-navy-900">$2,847,350</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Recent Activity</h2>
            <Activity size={16} className="text-gray-400" />
          </div>
          <div className="space-y-0 divide-y divide-gray-50 max-h-72 overflow-y-auto">
            {SEED_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${ACTIVITY_TYPE_COLOR[item.type] || 'bg-gray-100 text-gray-500'}`}>
                  <Activity size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.action}</p>
                  <p className="text-[11px] text-gray-400">{item.actor} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Priorities */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy-900">Strategic Priorities</h2>
          <span className="text-xs text-gray-400">Q2 2026</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SEED_PRIORITIES.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs font-medium text-gray-700 leading-snug">{item.label}</p>
                <span className="text-xs font-bold text-navy-700 flex-shrink-0">{item.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
              </div>
              <p className="text-[11px] text-gray-400">Due: {item.due}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-navy-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ label, path, icon: Icon, color }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-2 px-3 py-4 bg-white rounded-xl border-2 ${color} transition-all text-sm font-medium text-gray-700 hover:text-navy-900 hover:shadow-sm`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-xs text-gray-500">
          <Loader2 size={12} className="animate-spin" />
          Syncing live data…
        </div>
      )}
    </div>
  );
}

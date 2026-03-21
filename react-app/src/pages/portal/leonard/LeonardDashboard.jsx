import { useNavigate } from 'react-router-dom';
import {
  Users, TrendingUp, Building2, ShieldAlert, DollarSign,
  Activity, AlertTriangle, CheckCircle, ArrowRight, Loader2,
} from 'lucide-react';
import { useLeonardDashboard } from '../../../hooks/useLeonard';
import StatsCard from '../../../components/ui/StatsCard';

const SEVERITY_COLOR = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high:     'bg-orange-100 text-orange-700 border-orange-200',
  medium:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:      'bg-green-100 text-green-700 border-green-200',
  info:     'bg-blue-100 text-blue-700 border-blue-200',
};

const THREAT_COLOR = {
  critical: 'text-red-600 bg-red-50 border-red-200',
  high:     'text-orange-600 bg-orange-50 border-orange-200',
  medium:   'text-yellow-600 bg-yellow-50 border-yellow-200',
  low:      'text-green-600 bg-green-50 border-green-200',
};

function fmt(n, opts = {}) {
  if (n == null) return '—';
  const { prefix = '', decimals = 0 } = opts;
  const formatted = Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${formatted}`;
}

function fmtUSD(n) {
  if (n == null || n === 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function AllocationBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-medium">{fmtUSD(value)} <span className="text-gray-400">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function LeonardDashboard() {
  const { data, isLoading, error } = useLeonardDashboard();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-96">
        <Loader2 className="animate-spin h-6 w-6 text-navy-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 text-sm">Failed to load dashboard: {error.message}</div>
    );
  }

  const { stats, recent_activity } = data || {};
  const total = stats?.total_portfolio_value || 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Executive Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Leonard Workspace · Live overview</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Clients"     value={fmt(stats?.total_clients)}     icon={Users}       color="blue"   />
        <StatsCard title="Active Clients"    value={fmt(stats?.active_clients)}    icon={Users}       color="green"  />
        <StatsCard title="Portfolio Value"   value={fmtUSD(total)}                 icon={TrendingUp}  color="purple" />
        <StatsCard title="Monthly Revenue"   value={fmtUSD(stats?.monthly_revenue)} icon={DollarSign}  color="navy"   />
        <StatsCard title="Properties"        value={fmt(stats?.property_count)}    icon={Building2}   color="amber"  />
        <StatsCard title="Open Incidents"    value={fmt(stats?.open_incidents)}    icon={ShieldAlert} color={stats?.open_incidents > 0 ? 'amber' : 'green'} />
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Threat Level</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold capitalize ${THREAT_COLOR[stats?.threat_level] || THREAT_COLOR.low}`}>
            {stats?.threat_level === 'low' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {stats?.threat_level || 'Low'}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.entries(stats?.alerts_by_severity || {}).map(([sev, count]) => (
              count > 0 && (
                <span key={sev} className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${SEVERITY_COLOR[sev] || ''}`}>
                  {count} {sev}
                </span>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio allocation + activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Allocation */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Asset Allocation</h2>
            <button
              onClick={() => navigate('/portal/leonard/portfolio')}
              className="text-xs text-navy-600 hover:text-navy-800 flex items-center gap-0.5"
            >
              View <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            <AllocationBar label="Digital Assets"  value={stats?.digital_asset_value}  total={total} color="bg-blue-500"   />
            <AllocationBar label="Crypto"           value={stats?.crypto_asset_value}   total={total} color="bg-amber-400"  />
            <AllocationBar label="Real Estate"      value={stats?.real_estate_value}    total={total} color="bg-emerald-500"/>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-sm">
            <span className="text-gray-500">Total: </span>
            <span className="font-bold text-navy-900">{fmtUSD(total)}</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Recent Activity</h2>
            <Activity size={16} className="text-gray-400" />
          </div>
          <div className="space-y-0 divide-y divide-gray-50">
            {recent_activity?.length ? (
              recent_activity.slice(0, 10).map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="h-7 w-7 rounded-full bg-navy-50 flex items-center justify-center flex-shrink-0">
                    <Activity size={12} className="text-navy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.action}</p>
                    <p className="text-[11px] text-gray-400">{item.actor} · {item.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Manage Clients',   path: '/portal/leonard/clients',   icon: Users,       color: 'border-blue-200 hover:border-blue-400' },
          { label: 'View Portfolio',   path: '/portal/leonard/portfolio', icon: TrendingUp,  color: 'border-purple-200 hover:border-purple-400' },
          { label: 'Properties',       path: '/portal/leonard/real-estate', icon: Building2, color: 'border-emerald-200 hover:border-emerald-400' },
          { label: 'Security Ops',     path: '/portal/leonard/security',  icon: ShieldAlert, color: 'border-orange-200 hover:border-orange-400' },
        ].map(({ label, path, icon: Icon, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border-2 ${color} transition-colors text-sm font-medium text-gray-700 hover:text-navy-900`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

import {
  FileText, TrendingUp, Building2, ShieldAlert,
  Users, Loader2, DollarSign, Activity,
} from 'lucide-react';
import { useReports } from '../../../hooks/useLeonard';

function StatCard({ label, value, sub, color = 'text-navy-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={18} className="text-navy-600" />
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
    </div>
  );
}

export default function Reports() {
  const { data, isLoading, error } = useReports();

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;

  const {
    clients = {},
    portfolio = {},
    real_estate = {},
    security = {},
    generated_at,
  } = data || {};

  const fmt = (n) => n != null ? `$${Number(n).toLocaleString()}` : '—';
  const pct = (n) => n != null ? `${Number(n).toFixed(1)}%` : '—';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <FileText size={20} /> Reports &amp; Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Aggregated snapshot
          {generated_at && ` · ${new Date(generated_at).toLocaleString()}`}
        </p>
      </div>

      {/* Client Summary */}
      <div>
        <SectionHeader icon={Users} title="Client Summary" />
        <div className="grid sm:grid-cols-4 gap-4">
          <StatCard label="Total Clients"  value={clients.total}  />
          <StatCard label="Active"         value={clients.active}  color="text-green-700" />
          <StatCard label="Prospect"       value={clients.prospect} color="text-blue-700" />
          <StatCard label="Inactive"       value={clients.inactive} color="text-gray-500" />
        </div>
        {clients.by_tier?.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">By Tier</p>
            <div className="flex flex-wrap gap-3">
              {clients.by_tier.map((row) => (
                <div key={row.tier} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium text-gray-700 capitalize">{row.tier}</span>
                  <span className="text-xs text-gray-400">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Summary */}
      <div>
        <SectionHeader icon={TrendingUp} title="Portfolio Summary" />
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Total Portfolio Value" value={fmt(portfolio.total_value)} color="text-navy-900" />
          <StatCard
            label="Digital Assets"
            value={fmt(portfolio.digital_asset?.total_value)}
            sub={`${portfolio.digital_asset?.count || 0} holdings`}
          />
          <StatCard
            label="Crypto Assets"
            value={fmt(portfolio.crypto_asset?.total_value)}
            sub={`${portfolio.crypto_asset?.count || 0} holdings`}
          />
        </div>
        {portfolio.by_status?.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Holdings by Status</p>
            <div className="space-y-2">
              {portfolio.by_status.map((row) => (
                <div key={row.status} className="flex items-center justify-between text-xs">
                  <span className="capitalize text-gray-700">{row.status}</span>
                  <div className="flex gap-4 text-gray-500">
                    <span>{row.count} holdings</span>
                    <span className="font-medium text-navy-900">{fmt(row.total_value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real Estate Summary */}
      <div>
        <SectionHeader icon={Building2} title="Real Estate Summary" />
        <div className="grid sm:grid-cols-4 gap-4">
          <StatCard label="Total Properties" value={real_estate.total_properties} />
          <StatCard label="Total Market Value" value={fmt(real_estate.total_market_value)} color="text-navy-900" />
          <StatCard label="Monthly Revenue"   value={fmt(real_estate.monthly_revenue)} color="text-green-700" />
          <StatCard label="Monthly Expenses"  value={fmt(real_estate.monthly_expenses)} color="text-red-600" />
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Net Monthly Cash Flow</p>
              <DollarSign size={14} className="text-gray-300" />
            </div>
            <p className={`text-xl font-bold mt-1 ${
              (real_estate.net_monthly != null ? real_estate.net_monthly : 0) >= 0
                ? 'text-green-700' : 'text-red-600'
            }`}>
              {fmt(real_estate.net_monthly)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs text-gray-500 mb-2">By Occupancy</p>
            {real_estate.by_occupancy?.length > 0 ? (
              <div className="space-y-1.5">
                {real_estate.by_occupancy.map((row) => (
                  <div key={row.occupancy_status} className="flex justify-between text-xs">
                    <span className="capitalize text-gray-600">{row.occupancy_status?.replace('_', ' ')}</span>
                    <span className="text-gray-500">{row.count} properties</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Summary */}
      <div>
        <SectionHeader icon={ShieldAlert} title="Security Summary" />
        <div className="grid sm:grid-cols-4 gap-4">
          <StatCard label="Total Assets"    value={security.total_assets} />
          <StatCard label="Protected"       value={security.protected_assets}  color="text-green-700" />
          <StatCard label="Open Incidents"  value={security.open_incidents}  color={(security.open_incidents || 0) > 0 ? 'text-red-600' : 'text-green-700'} />
          <StatCard label="Resolved (30d)"  value={security.resolved_30d}  color="text-blue-700" />
        </div>
        {security.incidents_by_severity?.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Activity size={12} /> Incidents by Severity
            </p>
            <div className="flex flex-wrap gap-3">
              {security.incidents_by_severity.map((row) => (
                <div key={row.severity} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs font-medium capitalize text-gray-700">{row.severity}</span>
                  <span className="text-xs font-bold text-navy-900">{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

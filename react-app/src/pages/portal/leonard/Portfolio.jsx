import { useNavigate } from 'react-router-dom';
import { TrendingUp, Landmark, Bitcoin, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { usePortfolio } from '../../../hooks/useLeonard';

function fmtUSD(n) {
  if (!n || n === 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n).toFixed(2)}`;
}

const CATEGORY_META = {
  digital_asset: { label: 'Digital Assets',  icon: Landmark, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', path: '/portal/leonard/portfolio/digital-assets' },
  crypto_asset:  { label: 'Crypto Assets',   icon: Bitcoin,  color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', path: '/portal/leonard/portfolio/crypto' },
  real_estate:   { label: 'Real Estate',     icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', path: '/portal/leonard/portfolio/real-estate' },
};

export default function Portfolio() {
  const { data, isLoading, error } = usePortfolio();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  }

  const { totals, accounts, recent_holdings } = data || {};

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <TrendingUp size={20} /> Portfolio Overview
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Total value: <strong>{fmtUSD(totals?.grand_total)}</strong></p>
      </div>

      {/* Category cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const value = totals?.[key] || 0;
          const pct = totals?.grand_total > 0 ? Math.round((value / totals.grand_total) * 100) : 0;
          return (
            <button
              key={key}
              onClick={() => navigate(meta.path)}
              className={`group text-left bg-white border-2 ${meta.border} rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                  <meta.icon size={20} className={meta.color} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-xs font-medium text-gray-500">{meta.label}</p>
              <p className="text-xl font-bold text-navy-900 mt-0.5">{fmtUSD(value)}</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${meta.color.replace('text', 'bg')}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct}% of portfolio</p>
            </button>
          );
        })}
      </div>

      {/* Accounts table */}
      {accounts?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-navy-900">Portfolio Accounts</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Account</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Provider</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Total Value</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Holdings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy-900">{acc.account_name}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{acc.account_type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-gray-500">{acc.client_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{acc.provider || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-900">{fmtUSD(acc.total_value)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{acc.holding_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent holdings */}
      {recent_holdings?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-navy-900">Recent Holdings</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Asset</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Value</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent_holdings.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy-900">{h.symbol_or_name}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize text-xs">{h.asset_category.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-gray-500">{h.client_name || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-900">{fmtUSD(h.total_value)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${h.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

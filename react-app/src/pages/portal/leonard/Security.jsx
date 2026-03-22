import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Activity,
  Monitor, ArrowRight, Loader2,
} from 'lucide-react';
import { useSecurityDashboard } from '../../../hooks/useLeonard';

const SEV_COLOR = {
  critical: { badge: 'bg-red-100 text-red-700',    bar: 'bg-red-500' },
  high:     { badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-400' },
  medium:   { badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-400' },
  low:      { badge: 'bg-green-100 text-green-700',  bar: 'bg-green-400' },
  info:     { badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-400' },
};

const THREAT_STYLE = {
  critical: 'bg-red-50 border-red-300 text-red-700',
  high:     'bg-orange-50 border-orange-300 text-orange-700',
  medium:   'bg-yellow-50 border-yellow-300 text-yellow-700',
  low:      'bg-green-50 border-green-300 text-green-700',
};

const STATUS_BADGE = {
  open:          'bg-red-100 text-red-700',
  investigating: 'bg-orange-100 text-orange-700',
  contained:     'bg-yellow-100 text-yellow-700',
  resolved:      'bg-green-100 text-green-700',
  closed:        'bg-gray-100 text-gray-500',
};

export default function Security() {
  const { data, isLoading, error } = useSecurityDashboard();
  const navigate = useNavigate();

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;

  const { assets, incidents, recent_incidents, coverage_by_criticality } = data || {};
  const threatLevel = incidents?.threat_level || 'low';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <ShieldAlert size={20} /> Security Operations
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Defensive monitoring and incident visibility</p>
      </div>

      {/* Threat level banner */}
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 ${THREAT_STYLE[threatLevel]}`}>
        {threatLevel === 'low' ? <ShieldCheck size={20} /> : <AlertTriangle size={20} />}
        <div>
          <p className="text-sm font-semibold capitalize">Threat Level: {threatLevel}</p>
          <p className="text-xs opacity-75">{incidents?.open || 0} open incident(s)</p>
        </div>
        <div className="ml-auto flex gap-2">
          {Object.entries(incidents?.by_severity || {}).map(([sev, count]) =>
            count > 0 && (
              <span key={sev} className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${SEV_COLOR[sev]?.badge || ''}`}>
                {count} {sev}
              </span>
            )
          )}
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-navy-900">{assets?.total || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Monitored</p>
          <p className="text-2xl font-bold text-blue-700">{assets?.monitored || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Protected</p>
          <p className="text-2xl font-bold text-green-700">{assets?.protected || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Open Incidents</p>
          <p className={`text-2xl font-bold ${(incidents?.open || 0) > 0 ? 'text-red-600' : 'text-green-700'}`}>
            {incidents?.open || 0}
          </p>
        </div>
      </div>

      {/* Coverage + Recent incidents */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Coverage by criticality */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Coverage by Criticality</h2>
            <button onClick={() => navigate('/portal/leonard/security/assets')} className="text-xs text-navy-600 hover:text-navy-800 flex items-center gap-0.5">
              View All <ArrowRight size={12} />
            </button>
          </div>
          {coverage_by_criticality?.length ? (
            <div className="space-y-3">
              {['critical','high','medium','low'].map((crit) => {
                const row = coverage_by_criticality.find((r) => r.criticality === crit);
                if (!row) return null;
                const total = parseInt(row.total, 10);
                const protected_ = parseInt(row.protected, 10);
                const pct = total > 0 ? Math.round((protected_ / total) * 100) : 0;
                return (
                  <div key={crit}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="capitalize font-medium">{crit}</span>
                      <span>{protected_}/{total} protected ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${SEV_COLOR[crit]?.bar || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No assets configured.</p>
          )}
        </div>

        {/* Recent incidents */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Recent Incidents</h2>
            <button onClick={() => navigate('/portal/leonard/security/incidents')} className="text-xs text-navy-600 hover:text-navy-800 flex items-center gap-0.5">
              View All <ArrowRight size={12} />
            </button>
          </div>
          {recent_incidents?.length ? (
            <div className="space-y-2">
              {recent_incidents.slice(0, 6).map((inc) => (
                <div key={inc.id} className="flex items-start gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${SEV_COLOR[inc.severity]?.badge || ''}`}>
                    {inc.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{inc.title}</p>
                    <p className="text-[11px] text-gray-400">{inc.asset_name || 'No asset'} · {new Date(inc.detected_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[inc.status] || ''}`}>
                    {inc.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <ShieldCheck size={32} className="text-green-400 mb-2" />
              <p className="text-sm text-gray-500">No recent incidents</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={() => navigate('/portal/leonard/security/incidents')} className="flex items-center gap-3 px-5 py-4 bg-white border-2 border-orange-200 hover:border-orange-400 rounded-xl text-left transition-colors group">
          <AlertTriangle size={20} className="text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-navy-900">Manage Incidents</p>
            <p className="text-xs text-gray-400">View and update threat incidents</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-orange-400" />
        </button>
        <button onClick={() => navigate('/portal/leonard/security/assets')} className="flex items-center gap-3 px-5 py-4 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl text-left transition-colors group">
          <Monitor size={20} className="text-blue-500" />
          <div>
            <p className="text-sm font-semibold text-navy-900">Asset Inventory</p>
            <p className="text-xs text-gray-400">Manage monitored assets</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-blue-400" />
        </button>
      </div>
    </div>
  );
}

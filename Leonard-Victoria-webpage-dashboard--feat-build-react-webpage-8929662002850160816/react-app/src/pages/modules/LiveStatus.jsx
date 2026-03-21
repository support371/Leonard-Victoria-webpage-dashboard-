import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Clock, Zap, Server } from 'lucide-react';
import { Card, Badge, SectionHeader, StatusDot } from '../../components/ui';
import { SYSTEM_MODULES, ACTIVITY_LOG } from '../../data/seed';

const LiveStatus = () => {
  const liveCount = SYSTEM_MODULES.filter(m => m.status === 'live').length;
  const scaffoldedCount = SYSTEM_MODULES.filter(m => m.status === 'scaffolded').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SectionHeader title="Live Status" subtitle="System health, module readiness, and platform-wide operational state." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'System Health', value: '94%', sub: 'Uptime monitored', icon: Activity, ok: true },
          { label: 'Modules Live', value: `${liveCount}`, sub: `${scaffoldedCount} scaffolded`, icon: CheckCircle, ok: true },
          { label: 'Active Alerts', value: '2', sub: 'Require attention', icon: AlertTriangle, ok: false },
          { label: 'Response Time', value: '142ms', sub: 'Avg API latency', icon: Zap, ok: true },
        ].map(stat => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.ok ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Module Readiness</h2>
          <Card className="divide-y divide-slate-100">
            {SYSTEM_MODULES.map(mod => (
              <div key={mod.name} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <StatusDot status={mod.status} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{mod.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{mod.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">{mod.version}</span>
                  <Badge variant={mod.status === 'live' ? 'teal' : 'yellow'} size="xs">{mod.status}</Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Active Alerts</h2>
            <div className="space-y-3">
              {[
                { level: 'high', title: 'FBO Annual Filing Overdue', desc: 'Bernard must complete the annual FBO review filing. Due date has passed.', time: 'Since Mar 14' },
                { level: 'medium', title: 'Auth Layer Not Wired', desc: 'Authentication scaffolding is in place but not connected to a live session store.', time: 'Active' },
              ].map(alert => (
                <div key={alert.title} className={`p-4 rounded-xl border ${alert.level === 'high' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.level === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
                    <div>
                      <p className={`text-sm font-bold ${alert.level === 'high' ? 'text-red-800' : 'text-amber-800'}`}>{alert.title}</p>
                      <p className={`text-xs mt-1 ${alert.level === 'high' ? 'text-red-600' : 'text-amber-600'}`}>{alert.desc}</p>
                      <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Infrastructure Status</h2>
            <Card className="p-5 space-y-3">
              {[
                { label: 'Frontend Server', status: 'Operational', ok: true },
                { label: 'Asset Delivery', status: 'Operational', ok: true },
                { label: 'HMR (Hot Reload)', status: 'Active', ok: true },
                { label: 'Auth Service', status: 'Scaffolded — Not Wired', ok: false },
                { label: 'Database Layer', status: 'Not Connected', ok: false },
                { label: 'Email Service', status: 'Not Configured', ok: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <StatusDot status={item.ok ? 'live' : 'scaffolded'} />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{item.status}</span>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</h2>
            <Card className="divide-y divide-slate-100">
              {ACTIVITY_LOG.slice(0, 5).map(log => (
                <div key={log.id} className="px-4 py-3 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{log.action}</p>
                    <p className="text-[10px] text-slate-400">{log.user} · {log.time}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;

import React, { useState } from 'react';
import {
  CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw,
  Activity, Server, Database, Shield, CreditCard, Mail,
  Globe, HardDrive, Zap, Circle, ChevronDown, ChevronRight,
} from 'lucide-react';

const SERVICES = [
  {
    name: 'Frontend App',
    icon: Globe,
    status: 'operational',
    uptime: '99.9%',
    responseTime: '12ms',
    lastChecked: '30s ago',
    category: 'Core',
  },
  {
    name: 'API Server',
    icon: Server,
    status: 'operational',
    uptime: '99.7%',
    responseTime: '45ms',
    lastChecked: '30s ago',
    category: 'Core',
  },
  {
    name: 'Database (PostgreSQL)',
    icon: Database,
    status: 'operational',
    uptime: '99.9%',
    responseTime: '8ms',
    lastChecked: '30s ago',
    category: 'Core',
  },
  {
    name: 'Supabase Auth',
    icon: Shield,
    status: 'operational',
    uptime: '99.8%',
    responseTime: '23ms',
    lastChecked: '45s ago',
    category: 'Infrastructure',
  },
  {
    name: 'File Storage',
    icon: HardDrive,
    status: 'operational',
    uptime: '99.9%',
    responseTime: '67ms',
    lastChecked: '45s ago',
    category: 'Infrastructure',
  },
  {
    name: 'Stripe Payments',
    icon: CreditCard,
    status: 'operational',
    uptime: '99.6%',
    responseTime: '120ms',
    lastChecked: '1m ago',
    category: 'Third Party',
  },
  {
    name: 'Email Service',
    icon: Mail,
    status: 'degraded',
    uptime: '97.2%',
    responseTime: '340ms',
    lastChecked: '30s ago',
    category: 'Third Party',
    note: 'Elevated response times — investigating',
  },
  {
    name: 'CDN',
    icon: Zap,
    status: 'operational',
    uptime: '100%',
    responseTime: '5ms',
    lastChecked: '30s ago',
    category: 'Infrastructure',
  },
];

const INCIDENTS = [
  {
    id: 1,
    status: 'active',
    service: 'Email Service',
    title: 'Elevated response times — investigating',
    started: 'Mar 21, 2025 — 09:30 AM',
    resolved: null,
    severity: 'warning',
    updates: [
      { time: '10:14 AM', text: 'Team notified. Root cause investigation in progress.' },
      { time: '09:45 AM', text: 'Monitoring elevated latency — avg 340ms vs normal 80ms.' },
      { time: '09:30 AM', text: 'Alert triggered. Response time threshold exceeded.' },
    ],
  },
  { id: 2,  status: 'resolved', service: 'API Server',        title: 'Brief elevated latency — resolved',             started: 'Mar 18, 2025 — 02:12 PM', resolved: 'Mar 18, 2025 — 02:47 PM', severity: 'info' },
  { id: 3,  status: 'resolved', service: 'Supabase Auth',     title: 'Auth token refresh loop — patched',             started: 'Mar 15, 2025 — 11:05 AM', resolved: 'Mar 15, 2025 — 11:38 AM', severity: 'warning' },
  { id: 4,  status: 'resolved', service: 'Stripe Payments',   title: 'Webhook delivery delays — Stripe incident',      started: 'Mar 12, 2025 — 06:20 PM', resolved: 'Mar 12, 2025 — 08:45 PM', severity: 'warning' },
  { id: 5,  status: 'resolved', service: 'CDN',               title: 'Cache invalidation delay — resolved',            started: 'Mar 10, 2025 — 03:00 PM', resolved: 'Mar 10, 2025 — 03:22 PM', severity: 'info' },
  { id: 6,  status: 'resolved', service: 'Database',          title: 'Slow query alert — query optimized',             started: 'Mar 07, 2025 — 08:55 AM', resolved: 'Mar 07, 2025 — 09:30 AM', severity: 'info' },
  { id: 7,  status: 'resolved', service: 'File Storage',      title: 'Upload timeout errors — fixed',                  started: 'Mar 04, 2025 — 01:14 PM', resolved: 'Mar 04, 2025 — 01:55 PM', severity: 'warning' },
  { id: 8,  status: 'resolved', service: 'Frontend App',      title: 'Build deploy rollback — restored v2.9.1',        started: 'Mar 01, 2025 — 10:40 AM', resolved: 'Mar 01, 2025 — 11:10 AM', severity: 'warning' },
  { id: 9,  status: 'resolved', service: 'Email Service',     title: 'Bulk email queue backlog — cleared',             started: 'Feb 26, 2025 — 04:30 PM', resolved: 'Feb 26, 2025 — 07:00 PM', severity: 'info' },
  { id: 10, status: 'resolved', service: 'API Server',        title: 'Rate limit misconfiguration — reverted',         started: 'Feb 22, 2025 — 09:05 AM', resolved: 'Feb 22, 2025 — 09:35 AM', severity: 'info' },
];

// 90-day timeline blocks (simulated: mostly green, a few amber)
const TIMELINE_DAYS = Array.from({ length: 90 }, (_, i) => {
  const degradedDays = [2, 11, 18, 21, 25, 37, 44, 62, 78, 89];
  const failedDays   = [44];
  if (failedDays.includes(i))   return 'failed';
  if (degradedDays.includes(i)) return 'degraded';
  return 'operational';
});

function ServiceStatusBadge({ status }) {
  if (status === 'operational') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" /> Operational
      </span>
    );
  }
  if (status === 'degraded') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" /> Degraded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <XCircle className="w-3 h-3" /> Down
    </span>
  );
}

function ServiceRow({ service }) {
  const Icon = service.icon;
  const isDegraded = service.status === 'degraded';
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors ${isDegraded ? 'bg-amber-50/40' : ''}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-2 rounded-lg flex-shrink-0 ${isDegraded ? 'bg-amber-100' : 'bg-slate-100'}`}>
          <Icon className={`w-4 h-4 ${isDegraded ? 'text-amber-600' : 'text-slate-600'}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900 truncate">{service.name}</p>
          <p className="text-xs text-slate-400">{service.category}</p>
          {service.note && (
            <p className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {service.note}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
        <div className="text-center min-w-0">
          <p className="text-xs text-slate-400 mb-0.5">Uptime</p>
          <p className={`text-sm font-semibold ${isDegraded ? 'text-amber-700' : 'text-navy-900'}`}>{service.uptime}</p>
        </div>
        <div className="text-center min-w-0">
          <p className="text-xs text-slate-400 mb-0.5">Response</p>
          <p className={`text-sm font-semibold ${isDegraded ? 'text-amber-700' : 'text-navy-900'}`}>{service.responseTime}</p>
        </div>
        <div className="text-center min-w-0 hidden md:block">
          <p className="text-xs text-slate-400 mb-0.5">Checked</p>
          <p className="text-sm text-slate-500">{service.lastChecked}</p>
        </div>
        <ServiceStatusBadge status={service.status} />
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const [expanded, setExpanded] = useState(incident.status === 'active');
  const isActive = incident.status === 'active';
  return (
    <div className={`border rounded-xl overflow-hidden mb-3 ${isActive ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start sm:items-center justify-between gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {isActive
            ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            : <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className="text-sm font-semibold text-navy-900">{incident.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{incident.service} — Started: {incident.started}</p>
            {incident.resolved && (
              <p className="text-xs text-green-600 mt-0.5">Resolved: {incident.resolved}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isActive
            ? <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">Active</span>
            : <span className="text-xs font-semibold text-green-700 bg-green-100 border border-green-200 px-2.5 py-1 rounded-full">Resolved</span>
          }
          {incident.updates && (
            expanded
              ? <ChevronDown className="w-4 h-4 text-slate-400" />
              : <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>
      {expanded && incident.updates && (
        <div className="px-4 pb-4 space-y-2 border-t border-amber-200/60">
          {incident.updates.map((upd, i) => (
            <div key={i} className="flex gap-3 pt-2">
              <span className="text-xs font-mono text-slate-400 flex-shrink-0 w-20">{upd.time}</span>
              <p className="text-xs text-slate-600">{upd.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LiveStatus() {
  const degradedCount = SERVICES.filter(s => s.status === 'degraded').length;
  const allOperational = degradedCount === 0;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Live Status</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time system health across all services</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Updated 30 seconds ago
          </span>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-200 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
        allOperational
          ? 'bg-green-50 border-green-200'
          : 'bg-amber-50 border-amber-300'
      }`}>
        {allOperational
          ? <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
          : <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
        }
        <div>
          <p className={`text-lg font-bold ${allOperational ? 'text-green-800' : 'text-amber-800'}`}>
            {allOperational ? 'All Systems Operational' : `${degradedCount} Service${degradedCount > 1 ? 's' : ''} Degraded`}
          </p>
          <p className={`text-sm ${allOperational ? 'text-green-600' : 'text-amber-600'}`}>
            {allOperational
              ? 'All 8 services are running normally.'
              : `${SERVICES.filter(s => s.status === 'operational').length} of ${SERVICES.length} services operational. Monitoring in progress.`
            }
          </p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-2xl font-bold text-navy-900">
            {Math.round(SERVICES.reduce((s, sv) => s + parseFloat(sv.uptime), 0) / SERVICES.length * 10) / 10}%
          </p>
          <p className="text-xs text-slate-500">Avg uptime</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Operational',  value: SERVICES.filter(s => s.status === 'operational').length, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
          { label: 'Degraded',     value: SERVICES.filter(s => s.status === 'degraded').length,    color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
          { label: 'Active Incidents', value: INCIDENTS.filter(i => i.status === 'active').length,  color: 'text-red-700',   bg: 'bg-red-50',   border: 'border-red-200',   icon: XCircle },
          { label: 'Avg Response', value: Math.round(SERVICES.reduce((s, sv) => s + parseInt(sv.responseTime), 0) / SERVICES.length) + 'ms', color: 'text-navy-700', bg: 'bg-navy-50', border: 'border-navy-200', icon: Activity },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-xl p-4 border ${stat.bg} ${stat.border} flex items-center gap-3`}>
              <Icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Status Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-navy-500" /> Service Status
          </h2>
          <span className="text-xs text-slate-400">{SERVICES.length} services monitored</span>
        </div>
        {SERVICES.map(service => (
          <ServiceRow key={service.name} service={service} />
        ))}
      </div>

      {/* 90-Day Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-navy-500" /> 90-Day Uptime History
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Operational</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Degraded</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Outage</span>
          </div>
        </div>
        <div className="flex gap-0.5 flex-wrap">
          {TIMELINE_DAYS.map((day, i) => (
            <div
              key={i}
              title={`Day ${90 - i}: ${day}`}
              className={`h-6 rounded-sm flex-1 min-w-[6px] max-w-[14px] transition-opacity hover:opacity-70 ${
                day === 'operational' ? 'bg-green-400' :
                day === 'degraded' ? 'bg-amber-400' :
                'bg-red-400'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>90 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Incident History */}
      <div>
        <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-navy-500" /> Incident History
          <span className="text-xs font-normal text-slate-400 ml-1">Last 30 days</span>
        </h2>
        {INCIDENTS.map(incident => (
          <IncidentRow key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}

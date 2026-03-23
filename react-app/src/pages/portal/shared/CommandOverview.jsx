import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Users, BarChart3, Code2, CheckCircle, AlertTriangle,
  Clock, FileText, BookOpen, Eye, Activity, TrendingUp,
  Building2, Bitcoin, Calendar, GitCommit, Star,
  ExternalLink, ArrowRight, Zap, Globe, Database,
  ClipboardList, Layers, Settings,
} from 'lucide-react';

const TODAY = 'March 21, 2025';

// ─── Portal Gateways ─────────────────────────────────────────────────────────
const PORTALS = [
  {
    id: 'leonard',
    label: 'Leonard',
    subtitle: 'Executive Command',
    path: '/portal/leonard',
    icon: Shield,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-200 hover:border-indigo-400',
    accent: 'bg-indigo-600',
    stats: [
      { label: 'Portfolio Value',  value: '$2.4M' },
      { label: 'Active Clients',   value: '14' },
      { label: 'Threat Level',     value: 'Low', valueColor: 'text-green-600' },
      { label: 'Open Incidents',   value: '2' },
    ],
  },
  {
    id: 'victoria',
    label: 'Victoria',
    subtitle: 'Governance',
    path: '/portal/victoria',
    icon: Users,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    border: 'border-purple-200 hover:border-purple-400',
    accent: 'bg-purple-600',
    stats: [
      { label: 'Upcoming Meetings',   value: '2' },
      { label: 'Pending Resolutions', value: '1' },
      { label: 'Committees',          value: '4' },
      { label: 'Active Documents',    value: '38' },
    ],
  },
  {
    id: 'bernard',
    label: 'Bernard',
    subtitle: 'Programs & Community',
    path: '/portal/bernard',
    icon: BarChart3,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    border: 'border-teal-200 hover:border-teal-400',
    accent: 'bg-teal-600',
    stats: [
      { label: 'Active Programs', value: '8' },
      { label: 'Members',         value: '145' },
      { label: 'Events This Month', value: '3' },
      { label: 'New Applications',  value: '6' },
    ],
  },
  {
    id: 'developer',
    label: 'Developer',
    subtitle: 'Technical Operations',
    path: '/portal/developer',
    icon: Code2,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    border: 'border-slate-200 hover:border-slate-400',
    accent: 'bg-slate-700',
    stats: [
      { label: 'System Status',  value: 'Operational', valueColor: 'text-green-600' },
      { label: 'Last Deploy',    value: '2h ago' },
      { label: 'Active Services', value: '7/8' },
      { label: 'Open PRs',       value: '3' },
    ],
  },
];

// ─── Quick Stats ──────────────────────────────────────────────────────────────
const QUICK_STATS = [
  { label: 'Total Portfolio Value', value: '$2.4M',    change: '+12.3%',  dir: 'up',   icon: TrendingUp,  iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
  { label: 'Central Repository Documents',  value: '22',       change: '+3 new',  dir: 'up',   icon: FileText,    iconBg: 'bg-navy-50',    iconColor: 'text-navy-600' },
  { label: 'Pending Reviews',        value: '8',        change: 'Urgent: 3', dir: 'warn', icon: ClipboardList, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  { label: 'Active Members',         value: '145',      change: '+6 this month', dir: 'up', icon: Users,  iconBg: 'bg-teal-50',    iconColor: 'text-teal-600' },
  { label: 'Community Programs',     value: '8',        change: '3 launching soon', dir: 'neutral', icon: BarChart3, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  { label: 'Security Incidents',     value: '2',        change: '-1 resolved', dir: 'down', icon: Shield, iconBg: 'bg-red-50',     iconColor: 'text-red-500' },
  { label: 'Upcoming Meetings',      value: '2',        change: 'Next: Mar 24', dir: 'neutral', icon: Calendar, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { label: 'System Uptime',          value: '99.8%',   change: 'Email degraded', dir: 'warn', icon: Activity, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
];

// ─── Recent Activity ──────────────────────────────────────────────────────────
const ACTIVITY = [
  { id: 1,  portal: 'Leonard',   icon: TrendingUp,  time: '5 min ago',   desc: 'Portfolio rebalancing order executed — Q1 adjustment complete' },
  { id: 2,  portal: 'Victoria',  icon: Calendar,    time: '22 min ago',  desc: 'Board meeting scheduled — March 24, 2025 @ 10:00 AM' },
  { id: 3,  portal: 'Bernard',   icon: Users,       time: '45 min ago',  desc: 'New member application received — J. Mitchell (Tier 2)' },
  { id: 4,  portal: 'Leonard',   icon: Shield,      time: '1h ago',      desc: 'Security scan completed — all critical assets nominal' },
  { id: 5,  portal: 'Developer', icon: GitCommit,   time: '2h ago',      desc: 'Deployment to production — feat: command center pages' },
  { id: 6,  portal: 'Victoria',  icon: FileText,    time: '3h ago',      desc: 'Committee Charter Amendment submitted for review' },
  { id: 7,  portal: 'Bernard',   icon: Calendar,    time: '4h ago',      desc: 'Spring Summit budget request submitted — $42,500' },
  { id: 8,  portal: 'Leonard',   icon: Bitcoin,     time: '5h ago',      desc: 'Crypto DCA executed — BTC purchase $5,000 via Auto-DCA' },
  { id: 9,  portal: 'Developer', icon: AlertTriangle, time: '6h ago',    desc: 'Email service degradation detected — response time 340ms' },
  { id: 10, portal: 'Victoria',  icon: CheckCircle, time: 'Yesterday',   desc: 'Q1 Board Resolution #2025-002 approved unanimously' },
  { id: 11, portal: 'Bernard',   icon: BarChart3,   time: 'Yesterday',   desc: 'Community Programs Catalog 2025 published to repository' },
  { id: 12, portal: 'Leonard',   icon: Building2,   time: '2 days ago',  desc: 'Property inspection completed — 4821 Oak View Dr' },
  { id: 13, portal: 'Developer', icon: Database,    time: '2 days ago',  desc: 'Database query optimization — 40% performance improvement' },
  { id: 14, portal: 'Victoria',  icon: Users,       time: '3 days ago',  desc: 'Annual Governance Review 2025 — in progress with 60% complete' },
  { id: 15, portal: 'Bernard',   icon: Star,        time: '3 days ago',  desc: 'Donor recognition program proposal submitted for approval' },
];

// ─── Quick Access Shortcuts ────────────────────────────────────────────────────
const SHORTCUTS = [
  { label: 'Central Repository', path: '/portal/shared/repository',       icon: FileText,    color: 'bg-navy-50 border-navy-200 hover:bg-navy-100' },
  { label: 'Live Preview',        path: '/portal/shared/live-preview',     icon: Globe,       color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { label: 'Review Center',       path: '/portal/shared/review-center',    icon: ClipboardList, color: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { label: 'Live Status',         path: '/portal/shared/live-status',      icon: Activity,    color: 'bg-green-50 border-green-200 hover:bg-green-100' },
  { label: 'Live Structure',      path: '/portal/shared/live-structure',   icon: Layers,      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
  { label: 'Settings',            path: '/portal/leonard/settings',        icon: Settings,    color: 'bg-slate-50 border-slate-200 hover:bg-slate-100' },
];

const PORTAL_BADGE = {
  Leonard:   'bg-indigo-100 text-indigo-700',
  Victoria:  'bg-purple-100 text-purple-700',
  Bernard:   'bg-teal-100 text-teal-700',
  Developer: 'bg-slate-100 text-slate-700',
};

function StatCard({ stat }) {
  const Icon = stat.icon;
  const dirColor = stat.dir === 'up' ? 'text-green-600' : stat.dir === 'down' ? 'text-red-500' : stat.dir === 'warn' ? 'text-amber-600' : 'text-slate-500';
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all flex items-center gap-3">
      <div className={`p-2.5 rounded-xl flex-shrink-0 ${stat.iconBg}`}>
        <Icon className={`w-5 h-5 ${stat.iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-navy-900 truncate">{stat.value}</p>
        <p className="text-xs text-slate-500 truncate">{stat.label}</p>
        <p className={`text-xs mt-0.5 truncate font-medium ${dirColor}`}>{stat.change}</p>
      </div>
    </div>
  );
}

function PortalCard({ portal }) {
  const Icon = portal.icon;
  return (
    <Link
      to={portal.path}
      className={`group bg-white border-2 rounded-xl p-5 transition-all hover:shadow-lg block ${portal.border}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${portal.iconBg}`}>
          <Icon className={`w-6 h-6 ${portal.iconColor}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy-500 transition-colors mt-1" />
      </div>
      <h3 className="text-base font-bold text-navy-900 mb-0.5">{portal.label}</h3>
      <p className="text-xs text-slate-500 mb-4">{portal.subtitle}</p>
      <div className="grid grid-cols-2 gap-2">
        {portal.stats.map(stat => (
          <div key={stat.label} className="bg-slate-50 rounded-lg p-2">
            <p className={`text-sm font-bold ${stat.valueColor || 'text-navy-900'}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className={`mt-4 h-0.5 rounded-full ${portal.accent} opacity-20 group-hover:opacity-60 transition-opacity`} />
    </Link>
  );
}

export default function CommandOverview() {
  const degradedServices = 1;
  const pendingReviews   = ACTIVITY.length;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-700 rounded-2xl p-7 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Command Center</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Infinite Wealth Command Center</h1>
          <p className="text-navy-200 text-sm mb-5">{TODAY} — All portals active</p>

          {/* Quick Status Strip */}
          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
              degradedServices > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-green-500/20 text-green-300 border border-green-400/40'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              {degradedServices > 0 ? `${degradedServices} Service Degraded` : 'All Systems Operational'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20">
              <Shield className="w-3.5 h-3.5" /> 4 Portals Active
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <ClipboardList className="w-3.5 h-3.5" /> 8 Pending Reviews
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20">
              <FileText className="w-3.5 h-3.5" /> 22 Central Repository Docs
            </span>
          </div>
        </div>
      </div>

      {/* Portal Gateway Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Portal Gateways</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {PORTALS.map(portal => <PortalCard key={portal.id} portal={portal} />)}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}
        </div>
      </div>

      {/* Activity Feed + Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-navy-500" /> Recent Activity
            </h2>
            <span className="text-xs text-slate-400">All portals</span>
          </div>
          <div className="divide-y divide-slate-100">
            {ACTIVITY.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                  <div className="p-1.5 bg-slate-100 rounded-lg flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${PORTAL_BADGE[item.portal]}`}>
                        {item.portal}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-navy-500" /> Quick Access
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {SHORTCUTS.map(shortcut => {
                const Icon = shortcut.icon;
                return (
                  <Link
                    key={shortcut.label}
                    to={shortcut.path}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-colors text-center ${shortcut.color}`}
                  >
                    <Icon className="w-5 h-5 text-navy-600" />
                    <span className="text-xs font-medium text-navy-800 leading-tight">{shortcut.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System snapshot */}
          <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">System Snapshot</h3>
            <div className="space-y-2">
              {[
                { label: 'Frontend',  status: 'Operational', color: 'text-green-600' },
                { label: 'Database',  status: 'Operational', color: 'text-green-600' },
                { label: 'Auth',      status: 'Operational', color: 'text-green-600' },
                { label: 'Storage',   status: 'Operational', color: 'text-green-600' },
                { label: 'Email',     status: 'Degraded',    color: 'text-amber-600' },
                { label: 'Payments',  status: 'Operational', color: 'text-green-600' },
              ].map(svc => (
                <div key={svc.label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{svc.label}</span>
                  <span className={`font-semibold ${svc.color}`}>{svc.status}</span>
                </div>
              ))}
            </div>
            <Link
              to="/portal/shared/live-status"
              className="flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-medium mt-3 transition-colors"
            >
              Full status page <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

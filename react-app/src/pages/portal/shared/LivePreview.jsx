import React, { useState } from 'react';
import {
  Globe, Server, Monitor, CheckCircle, Clock, AlertCircle,
  ExternalLink, RefreshCw, History, GitCommit, User, Zap,
  ChevronDown, ChevronRight, Activity, Circle,
} from 'lucide-react';

const ENVIRONMENTS = [
  {
    id: 'production',
    label: 'Production',
    url: 'https://leonardvictoria.org',
    status: 'Live',
    statusColor: 'bg-green-100 text-green-700 border-green-200',
    dotColor: 'bg-green-500',
    deployed: '2 hours ago',
    buildTime: '1m 23s',
    commit: 'a3f92bc',
    branch: 'main',
    icon: Globe,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'staging',
    label: 'Staging',
    url: 'https://staging.leonardvictoria.org',
    status: 'Ready',
    statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
    deployed: '5 hours ago',
    buildTime: '58s',
    commit: '7c841de',
    branch: 'develop',
    icon: Server,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'development',
    label: 'Development',
    url: 'http://localhost:5173',
    status: 'Local',
    statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-400',
    deployed: 'Running',
    buildTime: 'Hot reload',
    commit: 'working-tree',
    branch: 'feature/command-center',
    icon: Monitor,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const BUILD_HISTORY = [
  { id: 1,  status: 'success', timestamp: 'Mar 21, 2025 — 10:14 AM', message: 'feat: add command center module pages',           author: 'L. Chapman',   duration: '1m 23s', commit: 'a3f92bc', branch: 'main' },
  { id: 2,  status: 'success', timestamp: 'Mar 21, 2025 — 05:32 AM', message: 'fix: resolve sidebar collapse state on mobile',   author: 'L. Chapman',   duration: '1m 11s', commit: '7c841de', branch: 'main' },
  { id: 3,  status: 'failed',  timestamp: 'Mar 20, 2025 — 08:47 PM', message: 'chore: update tailwind config with navy palette',  author: 'Dev Bot',      duration: '0m 44s', commit: 'e19b3af', branch: 'develop' },
  { id: 4,  status: 'success', timestamp: 'Mar 20, 2025 — 04:20 PM', message: 'feat: victoria governance portal — committees',    author: 'V. Harmon',    duration: '1m 08s', commit: '2d7f1cc', branch: 'main' },
  { id: 5,  status: 'success', timestamp: 'Mar 19, 2025 — 11:55 AM', message: 'feat: leonard portal — crypto assets page',        author: 'L. Chapman',   duration: '1m 31s', commit: 'b84aec5', branch: 'main' },
  { id: 6,  status: 'success', timestamp: 'Mar 19, 2025 — 09:03 AM', message: 'fix: supabase auth callback redirect loop',        author: 'Dev Bot',      duration: '58s',    commit: 'f0d3b22', branch: 'hotfix/auth' },
  { id: 7,  status: 'pending', timestamp: 'Mar 18, 2025 — 03:15 PM', message: 'feat: bernard portal — member management',        author: 'B. Founders',  duration: '—',      commit: 'c2e91bb', branch: 'develop' },
  { id: 8,  status: 'success', timestamp: 'Mar 18, 2025 — 12:00 PM', message: 'style: unify card design across all portals',      author: 'Design Bot',   duration: '1m 17s', commit: '99de44f', branch: 'main' },
  { id: 9,  status: 'success', timestamp: 'Mar 17, 2025 — 02:45 PM', message: 'feat: live status and review center scaffolding',  author: 'L. Chapman',   duration: '1m 44s', commit: '31ab7e0', branch: 'main' },
  { id: 10, status: 'failed',  timestamp: 'Mar 17, 2025 — 10:20 AM', message: 'wip: real estate portfolio map integration',       author: 'L. Chapman',   duration: '0m 31s', commit: '5f2c10d', branch: 'feature/re-map' },
];

function StatusBadge({ status }) {
  const map = {
    success: { icon: CheckCircle, label: 'Success', cls: 'text-green-700 bg-green-50 border-green-200' },
    failed:  { icon: AlertCircle, label: 'Failed',  cls: 'text-red-700 bg-red-50 border-red-200' },
    pending: { icon: Clock,       label: 'Pending', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  };
  const cfg = map[status] || map.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function PreviewCard({ env, isActive, onClick }) {
  const Icon = env.icon;
  return (
    <button
      onClick={() => onClick(env.id)}
      className={`text-left w-full rounded-xl border-2 p-5 transition-all ${
        isActive
          ? 'border-navy-500 bg-navy-50/60 shadow-md'
          : 'border-slate-200 bg-white hover:border-navy-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${env.iconBg}`}>
            <Icon className={`w-4 h-4 ${env.iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-900">{env.label}</p>
            <p className="text-xs text-slate-500">{env.branch}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${env.statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${env.dotColor}`} />
          {env.status}
        </span>
      </div>

      {/* Preview pane placeholder */}
      <div className="bg-slate-100 rounded-lg h-28 flex flex-col items-center justify-center mb-3 border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-5 bg-slate-200 flex items-center px-2 gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="ml-2 flex-1 bg-white rounded text-xs text-slate-400 px-2 py-0.5 truncate">{env.url}</span>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="w-16 h-1.5 bg-slate-300 rounded" />
          <div className="w-12 h-1.5 bg-slate-300 rounded" />
          <div className="w-20 h-1.5 bg-slate-200 rounded mt-1" />
          <div className="w-14 h-1.5 bg-slate-200 rounded" />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {env.deployed}</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {env.buildTime}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <GitCommit className="w-3 h-3" />
          <code className="font-mono">{env.commit}</code>
        </div>
      </div>
    </button>
  );
}

export default function LivePreview() {
  const [activeEnv, setActiveEnv] = useState('production');
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const selectedEnv = ENVIRONMENTS.find(e => e.id === activeEnv);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-navy-900">Live Preview</h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Production
            </span>
          </div>
          <p className="text-slate-500 text-sm">Environment deployments and build status</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-200 rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          {selectedEnv && (
            <a
              href={selectedEnv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-navy-700 hover:bg-navy-800 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Open {selectedEnv.label}
            </a>
          )}
        </div>
      </div>

      {/* Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ENVIRONMENTS.map(env => (
          <PreviewCard
            key={env.id}
            env={env}
            isActive={activeEnv === env.id}
            onClick={setActiveEnv}
          />
        ))}
      </div>

      {/* Quick Actions for selected env */}
      {selectedEnv && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-navy-500" />
              {selectedEnv.label} — Environment Details
            </h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 rounded-lg border border-navy-200 transition-colors">
                <ExternalLink className="w-3 h-3" /> Open
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                <History className="w-3 h-3" /> History
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'URL',         value: selectedEnv.url,    mono: true },
              { label: 'Branch',      value: selectedEnv.branch, mono: true },
              { label: 'Last Deploy', value: selectedEnv.deployed },
              { label: 'Build Time',  value: selectedEnv.buildTime },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-medium">{item.label}</p>
                <p className={`text-sm font-semibold text-navy-900 truncate ${item.mono ? 'font-mono text-xs' : ''}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Build History */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setHistoryExpanded(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
        >
          <h2 className="text-sm font-semibold text-navy-900 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-navy-500" />
            Build History
            <span className="text-xs font-normal text-slate-400 ml-1">Last {BUILD_HISTORY.length} deployments</span>
          </h2>
          {historyExpanded
            ? <ChevronDown className="w-4 h-4 text-slate-400" />
            : <ChevronRight className="w-4 h-4 text-slate-400" />
          }
        </button>

        {historyExpanded && (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Commit Message</div>
              <div className="col-span-2 hidden sm:block">Author</div>
              <div className="col-span-2 hidden md:block">Timestamp</div>
              <div className="col-span-2">Duration</div>
            </div>
            {BUILD_HISTORY.map((build, idx) => (
              <div
                key={build.id}
                className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center border-b border-slate-100 hover:bg-slate-50/60 transition-colors ${
                  idx === 0 ? 'bg-navy-50/30' : ''
                }`}
              >
                <div className="col-span-1">
                  <StatusBadge status={build.status} />
                </div>
                <div className="col-span-5">
                  <p className="text-sm text-navy-900 font-medium truncate">{build.message}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <code className="text-xs text-slate-400 font-mono">{build.commit}</code>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{build.branch}</span>
                  </div>
                </div>
                <div className="col-span-2 hidden sm:flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-navy-600" />
                  </div>
                  <span className="text-xs text-slate-600 truncate">{build.author}</span>
                </div>
                <div className="col-span-2 hidden md:block text-xs text-slate-500">{build.timestamp}</div>
                <div className="col-span-2 text-xs font-mono text-slate-600">{build.duration}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span className="flex items-center gap-1.5">
          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
          All environments nominal
        </span>
        <span>Auto-refreshes every 60 seconds</span>
      </div>
    </div>
  );
}

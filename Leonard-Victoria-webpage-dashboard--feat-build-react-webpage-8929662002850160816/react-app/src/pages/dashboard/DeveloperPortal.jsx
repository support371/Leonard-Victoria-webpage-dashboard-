import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu, GitBranch, Activity, Package, CheckCircle,
  AlertTriangle, ArrowRight, Clock, Terminal, Code2
} from 'lucide-react';
import { StatCard, Card, Badge, ModuleSection, StatusDot, statusVariant } from '../../components/ui';
import { SYSTEM_MODULES } from '../../data/seed';

const DeveloperPortal = () => {
  const navigate = useNavigate();
  const liveModules = SYSTEM_MODULES.filter(m => m.status === 'live').length;
  const scaffolded = SYSTEM_MODULES.filter(m => m.status === 'scaffolded').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(100,116,139,0.1),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-slate-300" />
            </div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest font-mono">Developer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 font-mono">Build Status — Active</h1>
          <p className="text-slate-400 max-w-xl font-mono text-sm">IW Command Center · v2.1 · React 18 + Vite 7 + Tailwind CSS 3</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate('/dashboard/preview')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 hover:bg-slate-500 text-white text-sm font-bold rounded-lg transition-all font-mono">
              Live Preview <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/dashboard/structure')} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg border border-slate-700 transition-all font-mono">
              Live Structure
            </button>
            <button onClick={() => navigate('/dashboard/status')} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg border border-slate-700 transition-all font-mono">
              System Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Modules Live" value={`${liveModules}/${SYSTEM_MODULES.length}`} sub="Production ready" icon={CheckCircle} accent="emerald" />
        <StatCard label="Scaffolded" value={scaffolded} sub="In development" icon={Package} accent="amber" />
        <StatCard label="Platform Health" value="94%" sub="Uptime monitored" icon={Activity} accent="blue" />
        <StatCard label="Open Tasks" value="8" sub="Build queue" icon={Code2} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModuleSection title="Module Registry">
            <Card className="overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Version</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SYSTEM_MODULES.map(mod => (
                    <tr key={mod.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{mod.name}</td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">{mod.path}</td>
                      <td className="px-5 py-3 text-xs text-slate-500 font-mono">{mod.version}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <StatusDot status={mod.status} />
                          <span className="text-xs font-medium text-slate-700 capitalize">{mod.status}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">{mod.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </ModuleSection>

          <ModuleSection title="Task Queue">
            <Card className="p-5 space-y-3">
              {[
                { task: 'Auth layer — JWT session integration', priority: 'high', status: 'In Progress' },
                { task: 'Mobile sidebar overlay for small screens', priority: 'high', status: 'Pending' },
                { task: 'Repository search — full-text implementation', priority: 'medium', status: 'Pending' },
                { task: 'Real-time notification system', priority: 'medium', status: 'Backlog' },
                { task: 'Export feature — CSV / PDF for repository', priority: 'low', status: 'Backlog' },
                { task: 'Dark mode toggle', priority: 'low', status: 'Backlog' },
                { task: 'Performance audit — Lighthouse score', priority: 'medium', status: 'Pending' },
                { task: 'API scaffolding — REST endpoints', priority: 'high', status: 'In Progress' },
              ].map(task => (
                <div key={task.task} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    <p className="text-xs text-slate-700 truncate">{task.task}</p>
                  </div>
                  <Badge variant={statusVariant(task.status)} size="xs">{task.status}</Badge>
                </div>
              ))}
            </Card>
          </ModuleSection>
        </div>

        <div className="space-y-6">
          <ModuleSection title="Tech Stack">
            <Card className="p-5">
              <div className="space-y-3 font-mono">
                {[
                  ['Framework', 'React 18.2.0'],
                  ['Build Tool', 'Vite 7.3.0'],
                  ['Styling', 'Tailwind CSS 3.4'],
                  ['Routing', 'React Router v6'],
                  ['Icons', 'Lucide React'],
                  ['Runtime', 'Node.js 20'],
                  ['Package Mgr', 'npm'],
                  ['Deploy', 'Replit / Vercel-ready'],
                ].map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-slate-700 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </Card>
          </ModuleSection>

          <ModuleSection title="Diagnostics">
            <Card className="p-5 space-y-3">
              {[
                { label: 'Build Status', value: 'Passing', ok: true },
                { label: 'HMR Active', value: 'Yes', ok: true },
                { label: 'Port', value: '5000', ok: true },
                { label: 'Env Mode', value: 'Development', ok: true },
                { label: 'Auth Layer', value: 'Scaffolded', ok: false },
                { label: 'DB Connection', value: 'Not Wired', ok: false },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`font-bold ${item.ok ? 'text-emerald-600' : 'text-amber-600'}`}>{item.value}</span>
                </div>
              ))}
            </Card>
          </ModuleSection>

          <ModuleSection title="Release Notes">
            <Card className="p-5 space-y-3">
              {[
                { v: 'v2.1', note: 'Full portal system + public website', date: 'Mar 14' },
                { v: 'v2.0', note: 'Dashboard shell + routing layer', date: 'Mar 10' },
                { v: 'v1.5', note: 'Compliance module + activity log', date: 'Mar 5' },
                { v: 'v1.0', note: 'Initial scaffold — NexusDash base', date: 'Feb 28' },
              ].map(item => (
                <div key={item.v} className="flex items-start gap-3 font-mono text-xs">
                  <Badge variant="default" size="xs">{item.v}</Badge>
                  <div>
                    <p className="text-slate-700">{item.note}</p>
                    <p className="text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </Card>
          </ModuleSection>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown, TrendingUp, Users, Shield, AlertTriangle, CheckCircle,
  ArrowRight, Clock, Briefcase, BarChart3, Target, Star
} from 'lucide-react';
import { StatCard, Card, Badge, SectionHeader, ModuleSection, statusVariant } from '../../components/ui';
import { ACTIVITY_LOG, REVIEW_QUEUE, COMPLIANCE_ITEMS, REPOSITORY_ITEMS } from '../../data/seed';

const StrategicPriority = ({ title, status, due, impact }) => (
  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-all">
    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${status === 'On Track' ? 'bg-emerald-500' : status === 'At Risk' ? 'bg-red-500' : 'bg-amber-500'}`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-slate-400">Due: {due}</span>
        <span className={`text-xs font-medium ${impact === 'High' ? 'text-red-600' : impact === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
          {impact} Impact
        </span>
      </div>
    </div>
    <Badge variant={status === 'On Track' ? 'green' : status === 'At Risk' ? 'red' : 'yellow'}>{status}</Badge>
  </div>
);

const LeonardPortal = () => {
  const navigate = useNavigate();
  const urgentReviews = REVIEW_QUEUE.filter(r => r.priority === 'high' || r.flagged);
  const recentActivity = ACTIVITY_LOG.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-amber-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Owner Command</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Good morning, Leonard.</h1>
          <p className="text-slate-400 max-w-2xl">
            Executive overview is active. 3 items require your decision. Compliance is at A+ and platform health is nominal.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate('/dashboard/reviews')} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-amber-500/25">
              Review Decision Queue <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/dashboard/repository')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-all border border-white/10">
              Central Repository
            </button>
            <button onClick={() => navigate('/dashboard/status')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-all border border-white/10">
              System Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Membership Active" value="1,240" sub="Total enrolled members" icon={Users} accent="amber" trend={{ positive: true, label: '+12% this month' }} />
        <StatCard label="Compliance Score" value="A+" sub="Audited by Bernard" icon={Shield} accent="emerald" />
        <StatCard label="Decision Queue" value={urgentReviews.length} sub="Items need your input" icon={AlertTriangle} accent="red" />
        <StatCard label="Platform Health" value="94%" sub="Uptime & performance" icon={BarChart3} accent="blue" trend={{ positive: true, label: 'All systems nominal' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModuleSection title="Strategic Priorities">
            <Card className="p-6 space-y-3">
              {[
                { title: 'Platform Launch — Phase 2', status: 'On Track', due: 'Apr 1, 2024', impact: 'High' },
                { title: 'Q2 Membership Growth Campaign', status: 'In Progress', due: 'Apr 15, 2024', impact: 'High' },
                { title: 'FBO Annual Compliance Filing', status: 'At Risk', due: 'Mar 16, 2024', impact: 'High' },
                { title: 'Sovereign Member Onboarding — Batch 2', status: 'On Track', due: 'Mar 28, 2024', impact: 'Medium' },
                { title: 'Wealth Alignment Curriculum Launch', status: 'In Progress', due: 'May 1, 2024', impact: 'Medium' },
              ].map(p => <StrategicPriority key={p.title} {...p} />)}
            </Card>
          </ModuleSection>

          <ModuleSection title="Decision Queue — Urgent">
            <Card className="divide-y divide-slate-100">
              {urgentReviews.map(item => (
                <div key={item.id} className="px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  {item.flagged && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">{item.type} · Due {item.due}</span>
                    </div>
                  </div>
                  <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                </div>
              ))}
              <div className="px-5 py-3">
                <button onClick={() => navigate('/dashboard/reviews')} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  View Full Review Center <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </ModuleSection>
        </div>

        <div className="space-y-6">
          <ModuleSection title="Organization Snapshot">
            <Card className="p-5 space-y-4">
              {[
                { label: 'Foundation Members', value: '894' },
                { label: 'Elevated Members', value: '298' },
                { label: 'Sovereign Members', value: '48' },
                { label: 'Active Practitioners', value: '120' },
                { label: 'Events This Month', value: '3' },
                { label: 'Open Partnerships', value: '7' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </Card>
          </ModuleSection>

          <ModuleSection title="Compliance Status">
            <Card className="p-5 space-y-3">
              {COMPLIANCE_ITEMS.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <p className="text-sm text-slate-600 truncate">{item.area}</p>
                  <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                </div>
              ))}
              <button onClick={() => navigate('/dashboard/bernard')} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-2">
                Full Legal Status <ArrowRight className="w-3 h-3" />
              </button>
            </Card>
          </ModuleSection>

          <ModuleSection title="Recent Activity">
            <Card className="divide-y divide-slate-100">
              {recentActivity.slice(0, 4).map(log => (
                <div key={log.id} className="px-4 py-3">
                  <p className="text-xs text-slate-700 font-medium">{log.user}</p>
                  <p className="text-xs text-slate-400 truncate">{log.action}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">{log.time}</p>
                </div>
              ))}
              <div className="px-4 py-2">
                <button onClick={() => navigate('/dashboard/activity')} className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  All Activity <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </ModuleSection>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Repository Highlights</h2>
          <button onClick={() => navigate('/dashboard/repository')} className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REPOSITORY_ITEMS.filter(r => ['Manifestos', 'Internal Notes', 'Legal Records'].includes(r.category)).slice(0, 4).map(item => (
            <Card key={item.id} hover className="p-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{item.category}</p>
              <p className="text-sm font-semibold text-slate-900 mb-2 leading-tight">{item.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{item.updated}</span>
                <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeonardPortal;

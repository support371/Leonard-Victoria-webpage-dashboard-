import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, MessageSquare, BookOpen, TrendingUp,
  ArrowRight, CheckCircle, Clock, Plus
} from 'lucide-react';
import { StatCard, Card, Badge, ModuleSection, statusVariant } from '../../components/ui';
import { EVENTS, ACTIVITY_LOG, REPOSITORY_ITEMS } from '../../data/seed';

const VictoriaPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-teal-900/60 via-slate-900 to-slate-900 rounded-2xl p-8 border border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-teal-400 text-xs font-semibold uppercase tracking-widest">Operations Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Victoria's Command</h1>
          <p className="text-slate-400 max-w-xl">Operations, community engagement, and content delivery — your complete operational view.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-lg transition-all">
              Community Hub <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/dashboard/repository')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg border border-white/10 transition-all">
              Content Repository
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Members" value="1,240" sub="Active memberships" icon={Users} accent="teal" trend={{ positive: true, label: '+47 this month' }} />
        <StatCard label="Events Scheduled" value={EVENTS.length} sub="Next 30 days" icon={Calendar} accent="blue" />
        <StatCard label="Pending Support" value="12" sub="Member inquiries" icon={MessageSquare} accent="amber" />
        <StatCard label="Content Items" value="34" sub="Published resources" icon={BookOpen} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ModuleSection title="Upcoming Events">
            <Card className="divide-y divide-slate-100">
              {EVENTS.map(event => (
                <div key={event.id} className="px-5 py-4 flex items-start gap-5 hover:bg-slate-50 transition-colors">
                  <div className="text-center min-w-[2.5rem]">
                    <p className="text-teal-500 text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</p>
                    <p className="text-slate-900 text-xl font-black leading-tight">{event.date.split(' ')[1]?.replace(',', '')}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.time} · {event.attendees} registered</p>
                  </div>
                  <Badge variant={statusVariant(event.status)} size="xs">{event.status}</Badge>
                </div>
              ))}
              <div className="px-5 py-3 flex items-center justify-between">
                <button className="text-xs font-semibold text-teal-600 flex items-center gap-1">
                  View Full Calendar <ArrowRight className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold rounded-lg hover:bg-teal-100 transition-colors">
                  <Plus className="w-3 h-3" /> Add Event
                </button>
              </div>
            </Card>
          </ModuleSection>

          <ModuleSection title="Workflow Tracking">
            <Card className="p-5 space-y-3">
              {[
                { task: 'March Healing Circle — Post-Event Wrap', status: 'In Progress', due: 'Mar 23' },
                { task: 'Q2 Newsletter Draft', status: 'Draft', due: 'Mar 27' },
                { task: 'New Member Welcome Sequence Update', status: 'In Progress', due: 'Mar 25' },
                { task: 'April Event Page Publishing', status: 'Pending', due: 'Mar 28' },
                { task: 'Membership Onboarding Flow Audit', status: 'Pending', due: 'Apr 1' },
              ].map(task => (
                <div key={task.task} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    {task.status === 'In Progress' ? <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
                    <p className="text-sm text-slate-700 truncate">{task.task}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400">{task.due}</span>
                    <Badge variant={statusVariant(task.status)} size="xs">{task.status}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          </ModuleSection>

          <ModuleSection title="Membership Support Queue">
            <Card className="p-5">
              <div className="grid grid-cols-3 gap-4 text-center mb-5 pb-5 border-b border-slate-100">
                {[['12', 'Open Inquiries'], ['4', 'Escalated'], ['28', 'Resolved This Week']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <p className="text-2xl font-black text-slate-900">{val}</p>
                    <p className="text-xs text-slate-400">{lbl}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Member #1089', issue: 'Billing question — Elevated tier', time: '2h ago', urgent: false },
                  { name: 'Member #0934', issue: 'Cannot access community forum', time: '4h ago', urgent: false },
                  { name: 'Member #1204', issue: 'Requesting tier upgrade to Sovereign', time: 'Yesterday', urgent: true },
                ].map(item => (
                  <div key={item.name} className={`flex items-center justify-between p-3 rounded-lg border ${item.urgent ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.issue}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </ModuleSection>
        </div>

        <div className="space-y-6">
          <ModuleSection title="Internal Coordination">
            <Card className="p-5 space-y-3">
              {[
                { item: 'Review Q2 Curriculum with Leonard', status: 'Pending' },
                { item: 'Coordinate Event Contracts with Bernard', status: 'In Progress' },
                { item: 'Submit Marketing Brief to Dev Team', status: 'Done' },
                { item: 'Confirm April Retreat Venue', status: 'Pending' },
              ].map(t => (
                <div key={t.item} className="flex items-start gap-3">
                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.status === 'Done' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === 'Done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t.item}</p>
                    <Badge variant={statusVariant(t.status)} size="xs" className="mt-0.5">{t.status}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          </ModuleSection>

          <ModuleSection title="Content & Resources">
            <Card className="divide-y divide-slate-100">
              {REPOSITORY_ITEMS.filter(r => ['Service Documents', 'Brand Assets', 'Membership Documents'].includes(r.category)).slice(0, 4).map(item => (
                <div key={item.id} className="px-4 py-3">
                  <p className="text-xs font-semibold text-slate-700 truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                    <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <button onClick={() => navigate('/dashboard/repository')} className="text-xs font-semibold text-teal-600 flex items-center gap-1">
                  Full Repository <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </ModuleSection>

          <ModuleSection title="Activity Feed">
            <Card className="divide-y divide-slate-100">
              {ACTIVITY_LOG.filter(l => l.user === 'Victoria Eleanor').concat(ACTIVITY_LOG.slice(0, 2)).slice(0, 4).map(log => (
                <div key={log.id} className="px-4 py-3">
                  <p className="text-xs font-medium text-slate-700 truncate">{log.action}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                </div>
              ))}
            </Card>
          </ModuleSection>
        </div>
      </div>
    </div>
  );
};

export default VictoriaPortal;

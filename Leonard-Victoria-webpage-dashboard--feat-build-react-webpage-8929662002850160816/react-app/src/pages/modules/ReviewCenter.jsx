import React, { useState } from 'react';
import { Flag, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { Card, Badge, SectionHeader, statusVariant } from '../../components/ui';
import { REVIEW_QUEUE, ACTIVITY_LOG } from '../../data/seed';

const priorityOrder = { high: 0, medium: 1, low: 2 };

const ReviewCenter = () => {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', ...new Set(REVIEW_QUEUE.map(r => r.type))];
  const statuses = ['All', 'Pending Review', 'Action Required', 'Pending Approval', 'In Review', 'Draft'];

  const filtered = REVIEW_QUEUE.filter(r => {
    const statusOk = filter === 'All' || r.status === filter;
    const typeOk = typeFilter === 'All' || r.type === typeFilter;
    return statusOk && typeOk;
  }).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const flagged = REVIEW_QUEUE.filter(r => r.flagged);
  const pending = REVIEW_QUEUE.filter(r => r.status.includes('Pending') || r.status === 'Action Required');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SectionHeader
        title="Review Center"
        subtitle="Manage pending reviews, flagged items, approvals, and drafts across all portals."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: REVIEW_QUEUE.length, icon: Clock, color: 'text-blue-600 bg-blue-50' },
          { label: 'Flagged', value: flagged.length, icon: Flag, color: 'text-red-600 bg-red-50' },
          { label: 'Pending Action', value: pending.length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
          { label: 'High Priority', value: REVIEW_QUEUE.filter(r => r.priority === 'high').length, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        ].map(stat => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {statuses.map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === s ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {types.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${typeFilter === t ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Card>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">No items match the current filters.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filtered.map(item => (
                  <div key={item.id} className={`px-6 py-5 hover:bg-slate-50 transition-colors ${item.priority === 'high' ? 'border-l-4 border-l-red-400' : item.priority === 'medium' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-transparent'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.flagged && <Flag className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                          <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                          <Badge variant={item.type === 'Legal' ? 'indigo' : item.type === 'Technical' ? 'blue' : 'default'}>{item.type}</Badge>
                          <Badge variant={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'yellow' : 'default'}>{item.priority} priority</Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {item.due}</span>
                          <span className="text-xs text-slate-400">Owner: {item.owner}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                            Approve
                          </button>
                          <button className="px-3 py-1 text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                            Defer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Flagged — Immediate</h2>
            <Card className="divide-y divide-slate-100">
              {flagged.map(item => (
                <div key={item.id} className="px-4 py-4 bg-red-50/40 hover:bg-red-50 transition-colors">
                  <div className="flex items-start gap-2">
                    <Flag className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-red-600 font-medium mt-0.5">Due: {item.due}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Actions</h2>
            <Card className="divide-y divide-slate-100">
              {ACTIVITY_LOG.filter(l => l.type === 'approve' || l.type === 'flag').slice(0, 5).map(log => (
                <div key={log.id} className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {log.type === 'approve' ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Flag className="w-3 h-3 text-red-500" />}
                    <p className="text-xs font-medium text-slate-700">{log.user}</p>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{log.action}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">{log.time}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCenter;

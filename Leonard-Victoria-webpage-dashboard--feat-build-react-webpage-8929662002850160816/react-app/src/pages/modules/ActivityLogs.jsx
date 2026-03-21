import React, { useState } from 'react';
import { CheckCircle, Upload, Eye, Flag, Cpu, Plus } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../components/ui';
import { ACTIVITY_LOG } from '../../data/seed';

const typeConfig = {
  approve: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', label: 'Approval' },
  upload: { icon: Upload, color: 'text-blue-600 bg-blue-50', label: 'Upload' },
  review: { icon: Eye, color: 'text-amber-600 bg-amber-50', label: 'Review' },
  flag: { icon: Flag, color: 'text-red-600 bg-red-50', label: 'Flag' },
  deploy: { icon: Cpu, color: 'text-purple-600 bg-purple-50', label: 'Deploy' },
  create: { icon: Plus, color: 'text-teal-600 bg-teal-50', label: 'Create' },
};

const USERS = ['All Users', 'Leonard M. Diana', 'Victoria Eleanor', 'Agent Bernard', 'Dev Team'];

const ActivityLogs = () => {
  const [userFilter, setUserFilter] = useState('All Users');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = ACTIVITY_LOG.filter(log => {
    const userOk = userFilter === 'All Users' || log.user === userFilter;
    const typeOk = typeFilter === 'All' || log.type === typeFilter;
    return userOk && typeOk;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SectionHeader title="Activity Logs" subtitle="Platform-wide action log across all portals and modules." />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(typeConfig).map(([type, conf]) => {
          const count = ACTIVITY_LOG.filter(l => l.type === type).length;
          const Icon = conf.icon;
          return (
            <Card key={type} className={`p-4 cursor-pointer transition-all ${typeFilter === type ? 'ring-2 ring-amber-400' : ''}`} hover onClick={() => setTypeFilter(typeFilter === type ? 'All' : type)}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${conf.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-black text-slate-900">{count}</p>
              <p className="text-xs text-slate-400">{conf.label}s</p>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400 font-medium">Filter by user:</span>
        {USERS.map(u => (
          <button key={u} onClick={() => setUserFilter(u)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${userFilter === u ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {u}
          </button>
        ))}
      </div>

      <Card className="divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No activity entries match the current filters.</div>
        ) : (
          filtered.map(log => {
            const conf = typeConfig[log.type] || typeConfig.review;
            const Icon = conf.icon;
            return (
              <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${conf.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{log.user}</span>
                    <Badge variant="default" size="xs">{conf.label}</Badge>
                    <span className="text-xs text-slate-400">in {log.module}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{log.action}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{log.time}</span>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};

export default ActivityLogs;

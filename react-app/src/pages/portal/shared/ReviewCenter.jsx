import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList, Search, Eye, CheckCircle, Flag, Clock,
  AlertTriangle, User, Calendar, ArrowRight, FileText,
  ShieldAlert, BarChart3, Users, ChevronDown, Filter,
  TrendingUp, Circle, CheckCircle2, XCircle, Briefcase, Zap
} from 'lucide-react';
import { apiClient } from '../../../lib/api';

const FILTER_TABS = [
  { id: 'all',        label: 'All Queue' },
  { id: 'profile',    label: 'Profiles' },
  { id: 'service',    label: 'Services' },
  { id: 'content',    label: 'Stories' },
  { id: 'document',   label: 'Documents' },
];

export default function ReviewCenter() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ['admin', 'review', 'pending'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/community/review/pending');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ type, id }) => {
      return apiClient.post(`/admin/community/review/${type}/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'review', 'pending']);
    }
  });

  const queue = useMemo(() => {
    const items = [];
    if (pendingData?.pending_profiles) {
      pendingData.pending_profiles.forEach(p => items.push({ ...p, qType: 'profile', title: p.full_name, desc: p.bio }));
    }
    if (pendingData?.pending_services) {
      pendingData.pending_services.forEach(s => items.push({ ...s, qType: 'service', title: s.title, desc: s.expected_outcome }));
    }
    if (pendingData?.pending_stories) {
      pendingData.pending_stories.forEach(st => items.push({ ...st, qType: 'content', title: st.author_name, desc: st.content }));
    }
    return items.filter(item =>
      (activeTab === 'all' || item.qType === activeTab) &&
      (item.title?.toLowerCase().includes(search.toLowerCase()) ||
       item.desc?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [pendingData, activeTab, search]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-4">
            <ClipboardList className="text-blue-600" size={32} /> Approval Queue
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Review and approve community profiles, services, and content.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold text-sm flex items-center gap-2">
            <Zap size={16} /> {queue.length} Tasks Pending
          </div>
          <button className="px-4 py-2 bg-navy-900 text-white rounded-xl font-bold text-sm hover:bg-navy-800 transition-all">
            Export Queue
          </button>
        </div>
      </div>

      {/* High Density Workflow UI */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search approval items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-50 rounded w-full" /></td>
                  </tr>
                ))
              ) : queue.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      item.qType === 'profile' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      item.qType === 'service' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {item.qType === 'profile' ? <User size={10} /> : item.qType === 'service' ? <Briefcase size={10} /> : <FileText size={10} />}
                      {item.qType}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-navy-900">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.email || item.author_role || 'Community'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.desc}</p>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-navy-900 transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => approveMutation.mutate({ type: item.qType, id: item.id })}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Flag/Reject">
                        <Flag size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {queue.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <CheckCircle2 size={48} className="mx-auto text-emerald-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">All clear! Queue is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

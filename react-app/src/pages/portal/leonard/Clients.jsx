import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Plus, Search, Loader2, X, ChevronRight } from 'lucide-react';
import { useClients, useCreateClient } from '../../../hooks/useLeonard';
import clsx from 'clsx';

const STATUS_BADGE = {
  prospect: 'bg-gray-100 text-gray-600',
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-red-100 text-red-600',
};

const STAGE_BADGE = {
  inquiry:     'bg-slate-100 text-slate-600',
  application: 'bg-blue-100 text-blue-700',
  review:      'bg-purple-100 text-purple-700',
  onboarded:   'bg-teal-100 text-teal-700',
  active:      'bg-green-100 text-green-700',
  offboarded:  'bg-red-100 text-red-600',
};

const clientSchema = z.object({
  full_name:        z.string().min(2, 'Name required'),
  email:            z.string().email('Invalid email').or(z.literal('')).optional(),
  phone:            z.string().optional(),
  company:          z.string().optional(),
  status:           z.enum(['prospect', 'active', 'inactive', 'archived']),
  onboarding_stage: z.enum(['inquiry', 'application', 'review', 'onboarded', 'active', 'offboarded']),
  membership_tier:  z.enum(['community', 'stewardship', 'legacy']).optional().nullable(),
  notes:            z.string().optional(),
});

function AddClientModal({ onClose }) {
  const { mutate: create, isPending, error } = useCreateClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: { status: 'prospect', onboarding_stage: 'inquiry' },
  });

  const onSubmit = (data) => create(data, { onSuccess: onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Add Client</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input {...register('full_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input {...register('phone')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input {...register('company')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['prospect','active','inactive','archived'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Onboarding Stage</label>
              <select {...register('onboarding_stage')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['inquiry','application','review','onboarded','active','offboarded'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Membership Tier</label>
              <select {...register('membership_tier')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                <option value="">— none —</option>
                {['community','stewardship','legacy'].map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea rows={3} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Clients() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const { data: clients, isLoading, error } = useClients(statusFilter ? { status: statusFilter } : {});

  const filtered = clients?.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.full_name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Users size={20} /> Clients
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Client relationship and membership management</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 w-52"
          />
        </div>
        {['', 'prospect', 'active', 'inactive', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors',
              statusFilter === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : filtered?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No clients found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Stage</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Tier</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Holdings</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Next Follow-up</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered?.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/portal/leonard/clients/${c.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{c.full_name}</p>
                    {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                    {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[c.status] || ''}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STAGE_BADGE[c.onboarding_stage] || ''}`}>{c.onboarding_stage}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{c.membership_tier || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.holding_count || 0}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {c.next_followup ? new Date(c.next_followup).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

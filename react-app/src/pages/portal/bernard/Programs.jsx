import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookOpen, Plus, X, Loader2 } from 'lucide-react';
import { usePrograms, useCreateProgram, useUpdateProgram } from '../../../hooks/useBernard';

const STATUS_BADGE = {
  active:    'bg-green-100 text-green-700',
  planned:   'bg-blue-100 text-blue-700',
  inactive:  'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-500',
};

const CATEGORY_BADGE = {
  education:  'bg-blue-100 text-blue-700',
  community:  'bg-emerald-100 text-emerald-700',
  leadership: 'bg-purple-100 text-purple-700',
  wellness:   'bg-green-100 text-green-700',
  advocacy:   'bg-orange-100 text-orange-700',
  social:     'bg-pink-100 text-pink-700',
  other:      'bg-gray-100 text-gray-600',
};

const schema = z.object({
  name:         z.string().min(2),
  description:  z.string().optional().nullable(),
  category:     z.enum(['education','community','leadership','wellness','advocacy','social','other']),
  status:       z.enum(['active','inactive','completed','planned']),
  start_date:   z.string().optional().nullable(),
  end_date:     z.string().optional().nullable(),
  capacity:     z.coerce.number().int().optional().nullable(),
  lead_name:    z.string().optional().nullable(),
  budget_cents: z.coerce.number().int().optional().nullable(),
  location:     z.string().optional().nullable(),
  is_recurring: z.boolean().default(false),
  notes:        z.string().optional().nullable(),
});

function ProgramModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: ce } = useCreateProgram();
  const { mutate: update, isPending: updating, error: ue } = useUpdateProgram();
  const isPending = creating || updating;
  const error = ce || ue;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing ? { ...existing, budget_cents: existing.budget_cents ? existing.budget_cents / 100 : '' } : { category: 'community', status: 'active', is_recurring: false },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      budget_cents: data.budget_cents ? Math.round(Number(data.budget_cents) * 100) : null,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      capacity: data.capacity || null,
      lead_name: data.lead_name || null,
      location: data.location || null,
    };
    if (isEdit) { update({ id: existing.id, ...payload }, { onSuccess: onClose }); }
    else        { create(payload, { onSuccess: onClose }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold text-emerald-900">{isEdit ? 'Edit Program' : 'New Program'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Program Name *</label>
            <input {...register('name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select {...register('category')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                {['education','community','leadership','wellness','advocacy','social','other'].map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                {['active','planned','inactive','completed'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input type="date" {...register('start_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
              <input type="date" {...register('end_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
              <input type="number" min={0} {...register('capacity')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Budget ($)</label>
              <input type="number" step="0.01" min={0} {...register('budget_cents')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Program Lead</label>
              <input {...register('lead_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input {...register('location')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={2} {...register('description')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register('is_recurring')} className="rounded border-gray-300" />
            Recurring program
          </label>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Programs() {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: programs, isLoading, error } = usePrograms({ status: statusFilter || undefined, category: categoryFilter || undefined });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-950 flex items-center gap-2"><BookOpen size={20} /> Programs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{programs?.length || 0} programs</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
          <Plus size={16} /> New Program
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'active', 'planned', 'inactive', 'completed'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s || 'All Status'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-emerald-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !programs?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No programs found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => {
            const pct = p.capacity ? Math.min(100, Math.round((p.enrolled_count / p.capacity) * 100)) : null;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_BADGE[p.category]}`}>{p.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                </div>
                <h3 className="font-semibold text-emerald-900 mb-1">{p.name}</h3>
                {p.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>}
                {pct !== null && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{p.enrolled_count} enrolled</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                  {p.lead_name ? <span>Lead: {p.lead_name}</span> : <span>{p.enrolled_count} enrolled</span>}
                  {p.budget_cents && <span>${(p.budget_cents / 100).toLocaleString()} budget</span>}
                </div>
                <button onClick={() => setEditing(p)} className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 font-medium">Edit →</button>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <ProgramModal onClose={() => setShowAdd(false)} />}
      {editing && <ProgramModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

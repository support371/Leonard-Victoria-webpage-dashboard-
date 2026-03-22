import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrollText, Plus, X, Loader2, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { useResolutions, useCreateResolution, useUpdateResolution } from '../../../hooks/useVictoria';

const STATUS_BADGE = {
  proposed:     'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  passed:       'bg-green-100 text-green-700',
  failed:       'bg-red-100 text-red-700',
  withdrawn:    'bg-gray-100 text-gray-500',
  superseded:   'bg-gray-100 text-gray-400',
};

const CATEGORY_BADGE = {
  governance: 'bg-purple-100 text-purple-700',
  finance:    'bg-emerald-100 text-emerald-700',
  policy:     'bg-blue-100 text-blue-700',
  membership: 'bg-orange-100 text-orange-700',
  legal:      'bg-red-100 text-red-700',
  operations: 'bg-gray-100 text-gray-700',
  other:      'bg-gray-100 text-gray-500',
};

const schema = z.object({
  title:             z.string().min(2),
  resolution_number: z.string().optional().nullable(),
  description:       z.string().optional().nullable(),
  category:          z.enum(['governance','finance','policy','membership','legal','operations','other']),
  status:            z.enum(['proposed','under_review','passed','failed','withdrawn','superseded']),
  votes_for:         z.coerce.number().int().default(0),
  votes_against:     z.coerce.number().int().default(0),
  votes_abstain:     z.coerce.number().int().default(0),
  proposed_by:       z.string().optional().nullable(),
  effective_date:    z.string().optional().nullable(),
  notes:             z.string().optional().nullable(),
});

function ResolutionModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: ce } = useCreateResolution();
  const { mutate: update, isPending: updating, error: ue } = useUpdateResolution();
  const isPending = creating || updating;
  const error = ce || ue;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing || { category: 'governance', status: 'proposed', votes_for: 0, votes_against: 0, votes_abstain: 0 },
  });

  const onSubmit = (data) => {
    const payload = { ...data, resolution_number: data.resolution_number || null, proposed_by: data.proposed_by || null, effective_date: data.effective_date || null };
    if (isEdit) { update({ id: existing.id, ...payload }, { onSuccess: onClose }); }
    else        { create(payload, { onSuccess: onClose }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold text-purple-900">{isEdit ? 'Edit Resolution' : 'New Resolution'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Resolution #</label>
              <input {...register('resolution_number')} placeholder="e.g. R-2024-01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select {...register('category')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {['governance','finance','policy','membership','legal','operations','other'].map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {['proposed','under_review','passed','failed','withdrawn','superseded'].map((s) => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Votes For</label>
              <input type="number" min={0} {...register('votes_for')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Against</label>
              <input type="number" min={0} {...register('votes_against')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Abstain</label>
              <input type="number" min={0} {...register('votes_abstain')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Proposed By</label>
              <input {...register('proposed_by')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Effective Date</label>
              <input type="date" {...register('effective_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={2} {...register('description')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Resolutions() {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: resolutions, isLoading, error } = useResolutions({
    status:   statusFilter   || undefined,
    category: categoryFilter || undefined,
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-950 flex items-center gap-2">
            <ScrollText size={20} /> Resolutions
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{resolutions?.length || 0} records</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          <Plus size={16} /> New Resolution
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'proposed', 'under_review', 'passed', 'failed', 'withdrawn'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              statusFilter === s ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s ? s.replace('_', ' ') : 'All Status'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !resolutions?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <ScrollText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No resolutions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resolutions.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {r.resolution_number && (
                      <span className="text-xs font-mono text-gray-400">{r.resolution_number}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_BADGE[r.category]}`}>{r.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[r.status]}`}>{r.status.replace('_', ' ')}</span>
                  </div>
                  <p className="font-semibold text-purple-900">{r.title}</p>
                  {r.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>}
                  {r.proposed_by && <p className="text-xs text-gray-400 mt-1">Proposed by {r.proposed_by}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-3 text-xs mb-2">
                    <span className="flex items-center gap-1 text-green-600"><ThumbsUp size={11} /> {r.votes_for}</span>
                    <span className="flex items-center gap-1 text-red-600"><ThumbsDown size={11} /> {r.votes_against}</span>
                    <span className="flex items-center gap-1 text-gray-400"><Minus size={11} /> {r.votes_abstain}</span>
                  </div>
                  {r.effective_date && <p className="text-xs text-gray-400">Effective {new Date(r.effective_date).toLocaleDateString()}</p>}
                  <button onClick={() => setEditing(r)} className="text-xs text-purple-600 hover:text-purple-800 font-medium mt-1">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <ResolutionModal onClose={() => setShowAdd(false)} />}
      {editing && <ResolutionModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

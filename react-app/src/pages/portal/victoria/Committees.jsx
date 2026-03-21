import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users2, Plus, X, Loader2 } from 'lucide-react';
import { useCommittees, useCreateCommittee, useUpdateCommittee } from '../../../hooks/useVictoria';

const STATUS_BADGE = {
  active:    'bg-green-100 text-green-700',
  inactive:  'bg-yellow-100 text-yellow-700',
  dissolved: 'bg-gray-100 text-gray-400',
};

const schema = z.object({
  name:             z.string().min(2),
  purpose:          z.string().optional().nullable(),
  chair:            z.string().optional().nullable(),
  status:           z.enum(['active','inactive','dissolved']),
  meeting_cadence:  z.string().optional().nullable(),
  member_count:     z.coerce.number().int().default(0),
});

function CommitteeModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: ce } = useCreateCommittee();
  const { mutate: update, isPending: updating, error: ue } = useUpdateCommittee();
  const isPending = creating || updating;
  const error = ce || ue;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing || { status: 'active', member_count: 0 },
  });

  const onSubmit = (data) => {
    const payload = { ...data, purpose: data.purpose || null, chair: data.chair || null, meeting_cadence: data.meeting_cadence || null };
    if (isEdit) { update({ id: existing.id, ...payload }, { onSuccess: onClose }); }
    else        { create(payload, { onSuccess: onClose }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold text-purple-900">{isEdit ? 'Edit Committee' : 'Add Committee'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input {...register('name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Purpose</label>
            <textarea rows={2} {...register('purpose')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Chair</label>
              <input {...register('chair')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {['active','inactive','dissolved'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Cadence</label>
              <input {...register('meeting_cadence')} placeholder="e.g. Monthly" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Members</label>
              <input type="number" min={0} {...register('member_count')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Committee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Committees() {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const { data: committees, isLoading, error } = useCommittees();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-950 flex items-center gap-2"><Users2 size={20} /> Committees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{committees?.length || 0} committees</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Add Committee
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !committees?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Users2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No committees yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users2 size={18} className="text-purple-700" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[c.status]}`}>{c.status}</span>
              </div>
              <h3 className="font-semibold text-purple-900 mb-1">{c.name}</h3>
              {c.purpose && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.purpose}</p>}
              <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
                <span>{c.chair ? `Chair: ${c.chair}` : 'No chair'}</span>
                <span>{c.member_count} members</span>
              </div>
              {c.meeting_cadence && <p className="text-xs text-gray-400 mt-1">{c.meeting_cadence}</p>}
              <button onClick={() => setEditing(c)} className="mt-3 text-xs text-purple-600 hover:text-purple-800 font-medium">Edit →</button>
            </div>
          ))}
        </div>
      )}

      {showAdd && <CommitteeModal onClose={() => setShowAdd(false)} />}
      {editing && <CommitteeModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

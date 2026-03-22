import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarClock, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useMeetings, useCreateMeeting, useUpdateMeeting } from '../../../hooks/useVictoria';

const STATUS_BADGE = {
  scheduled:   'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed:   'bg-green-100 text-green-700',
  cancelled:   'bg-gray-100 text-gray-500',
};

const TYPE_LABEL = {
  board: 'Board', committee: 'Committee', general_membership: 'General',
  working_group: 'Working Group', other: 'Other',
};

const schema = z.object({
  title:          z.string().min(2),
  meeting_type:   z.enum(['board','committee','general_membership','working_group','other']),
  status:         z.enum(['scheduled','in_progress','completed','cancelled']),
  meeting_date:   z.string(),
  location:       z.string().optional().nullable(),
  virtual_link:   z.string().optional().nullable(),
  chaired_by:     z.string().optional().nullable(),
  agenda:         z.string().optional().nullable(),
  minutes:        z.string().optional().nullable(),
  attendee_count: z.coerce.number().int().optional().nullable(),
  quorum_reached: z.boolean().optional().nullable(),
  notes:          z.string().optional().nullable(),
});

function MeetingModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: ce } = useCreateMeeting();
  const updateMutation = useUpdateMeeting(existing?.id);
  const isPending = creating || updateMutation.isPending;
  const error = ce || updateMutation.error;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing ? {
      ...existing,
      meeting_date: existing.meeting_date?.slice(0, 16) || '',
    } : {
      meeting_type: 'board',
      status: 'scheduled',
      meeting_date: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data) => {
    const payload = { ...data, attendee_count: data.attendee_count || null, location: data.location || null, virtual_link: data.virtual_link || null };
    if (isEdit) { updateMutation.mutate(payload, { onSuccess: onClose }); }
    else        { create(payload, { onSuccess: onClose }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold text-purple-900">{isEdit ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select {...register('meeting_type')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {Object.entries(TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                {['scheduled','in_progress','completed','cancelled'].map((s) => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time *</label>
              <input type="datetime-local" {...register('meeting_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Chaired By</label>
              <input {...register('chaired_by')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input {...register('location')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Attendees</label>
              <input type="number" {...register('attendee_count')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Agenda</label>
            <textarea rows={3} {...register('agenda')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Minutes</label>
            <textarea rows={3} {...register('minutes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Meetings() {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: meetings, isLoading, error } = useMeetings({
    status: statusFilter || undefined,
    type:   typeFilter   || undefined,
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-purple-950 flex items-center gap-2">
            <CalendarClock size={20} /> Meetings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{meetings?.length || 0} records</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Schedule Meeting
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', 'scheduled', 'in_progress', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              statusFilter === s ? 'bg-purple-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s ? s.replace('_', ' ') : 'All'}
          </button>
        ))}
        <span className="text-gray-200">|</span>
        {['', 'board', 'committee', 'general_membership', 'working_group'].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
              typeFilter === t ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t ? TYPE_LABEL[t] : 'All Types'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-purple-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !meetings?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <CalendarClock className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No meetings found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Meeting</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Chair</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Attendees</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {meetings.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-purple-900">{m.title}</p>
                    {m.location && <p className="text-xs text-gray-400">{m.location}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{TYPE_LABEL[m.meeting_type]}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(m.meeting_date).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.chaired_by || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.attendee_count ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[m.status]}`}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditing(m)} className="text-xs text-purple-600 hover:text-purple-800 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <MeetingModal onClose={() => setShowAdd(false)} />}
      {editing && <MeetingModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

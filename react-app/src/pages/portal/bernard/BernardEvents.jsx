import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Plus, X, Loader2, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useBernardEvents, useCreateBernardEvent, useUpdateBernardEvent } from '../../../hooks/useBernard';

const schema = z.object({
  title:       z.string().min(2),
  description: z.string().optional().nullable(),
  event_date:  z.string(),
  location:    z.string().optional().nullable(),
  capacity:    z.coerce.number().int().optional().nullable(),
  category:    z.string().optional().nullable(),
  member_only: z.boolean().default(false),
});

function EventModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: ce } = useCreateBernardEvent();
  const { mutate: update, isPending: updating, error: ue } = useUpdateBernardEvent();
  const isPending = creating || updating;
  const error = ce || ue;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing ? { ...existing, event_date: existing.event_date?.slice(0, 16) || '' }
      : { member_only: false, event_date: new Date().toISOString().slice(0, 16) },
  });

  const onSubmit = (data) => {
    const payload = { ...data, location: data.location || null, capacity: data.capacity || null, category: data.category || null };
    if (isEdit) { update({ id: existing.id, ...payload }, { onSuccess: onClose }); }
    else        { create(payload, { onSuccess: onClose }); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-base font-semibold text-emerald-900">{isEdit ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date & Time *</label>
              <input type="datetime-local" {...register('event_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <input {...register('category')} placeholder="e.g. Workshop, Social" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input {...register('location')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
              <input type="number" min={0} {...register('capacity')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={2} {...register('description')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register('member_only')} className="rounded border-gray-300" />
            Members only event
          </label>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BernardEvents() {
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: events, isLoading, error } = useBernardEvents({ upcoming: upcomingOnly ? 'true' : undefined });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-950 flex items-center gap-2"><CalendarDays size={20} /> Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">{events?.length || 0} events</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setUpcomingOnly(false)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${!upcomingOnly ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All Events
        </button>
        <button onClick={() => setUpcomingOnly(true)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${upcomingOnly ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Upcoming
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-emerald-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !events?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No events found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {e.category || 'General'}
                </span>
                {e.member_only && <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Members Only</span>}
              </div>
              <h3 className="font-semibold text-emerald-900 text-base mb-2">{e.title}</h3>
              {e.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{e.description}</p>}
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={12} />
                  <span>{format(new Date(e.event_date), 'MMMM d, yyyy — h:mm a')}</span>
                </div>
                {e.location && <div className="flex items-center gap-1.5"><MapPin size={12} /><span>{e.location}</span></div>}
                {e.capacity && <div className="flex items-center gap-1.5"><Users size={12} /><span>Capacity: {e.capacity} · {e.registration_count || 0} registered</span></div>}
              </div>
              <button onClick={() => setEditing(e)} className="mt-3 text-xs text-emerald-600 hover:text-emerald-800 font-medium">Edit →</button>
            </div>
          ))}
        </div>
      )}

      {showAdd && <EventModal onClose={() => setShowAdd(false)} />}
      {editing && <EventModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

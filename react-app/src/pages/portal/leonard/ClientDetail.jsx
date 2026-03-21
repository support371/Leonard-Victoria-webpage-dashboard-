import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Edit2, Save, X, Loader2, Briefcase } from 'lucide-react';
import { useClient, useUpdateClient } from '../../../hooks/useLeonard';

const STATUS_BADGE = {
  prospect: 'bg-gray-100 text-gray-600',
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-red-100 text-red-600',
};

const clientSchema = z.object({
  full_name:        z.string().min(2),
  email:            z.string().email().or(z.literal('')).optional(),
  phone:            z.string().optional(),
  company:          z.string().optional(),
  status:           z.enum(['prospect', 'active', 'inactive', 'archived']),
  onboarding_stage: z.enum(['inquiry', 'application', 'review', 'onboarded', 'active', 'offboarded']),
  membership_tier:  z.enum(['community', 'stewardship', 'legacy']).optional().nullable(),
  notes:            z.string().optional(),
});

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  );
}

export default function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const { data, isLoading, error } = useClient(clientId);
  const { mutate: update, isPending: saving, error: saveError } = useUpdateClient(clientId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(clientSchema),
    values: data?.client,
  });

  const onSubmit = (formData) => update(formData, {
    onSuccess: () => setEditing(false),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin h-6 w-6 text-navy-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  }

  const { client, accounts, holdings_summary } = data || {};

  const totalValue = holdings_summary?.reduce((sum, h) => sum + parseFloat(h.total_value || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/portal/leonard/clients')} className="text-gray-400 hover:text-navy-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-navy-900 truncate">{client?.full_name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[client?.status] || ''}`}>
              {client?.status}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 capitalize">{client?.onboarding_stage}</span>
          </div>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-navy-500 hover:text-navy-700 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setEditing(false); reset(); }} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <X size={14} /> Cancel
            </button>
            <button form="client-form" type="submit" disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Client info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-navy-900 mb-4">Client Information</h2>
            {!editing ? (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name"       value={client?.full_name} />
                <Field label="Email"           value={client?.email} />
                <Field label="Phone"           value={client?.phone} />
                <Field label="Company"         value={client?.company} />
                <Field label="Status"          value={client?.status} />
                <Field label="Membership Tier" value={client?.membership_tier} />
                <Field label="Onboarding Stage" value={client?.onboarding_stage} />
                <Field label="Next Follow-up"  value={client?.next_followup ? new Date(client.next_followup).toLocaleDateString() : null} />
                {client?.notes && (
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{client.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
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
                      {['prospect','active','inactive','archived'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
                    <select {...register('onboarding_stage')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                      {['inquiry','application','review','onboarded','active','offboarded'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Membership Tier</label>
                    <select {...register('membership_tier')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                      <option value="">— none —</option>
                      {['community','stewardship','legacy'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                    <textarea rows={4} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                  </div>
                </div>
                {saveError && <p className="text-red-500 text-sm mt-2">{saveError.message}</p>}
              </form>
            )}
          </div>
        </div>

        {/* Sidebar: accounts + holdings summary */}
        <div className="space-y-4">
          {/* Holdings summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-navy-900 mb-3 flex items-center gap-2">
              <Briefcase size={15} /> Portfolio
            </h2>
            {holdings_summary?.length ? (
              <div className="space-y-2">
                {holdings_summary.map((h) => (
                  <div key={h.asset_category} className="flex justify-between text-xs">
                    <span className="text-gray-500 capitalize">{h.asset_category.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-navy-900">
                      ${parseFloat(h.total_value).toLocaleString()} ({h.count})
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-semibold">
                  <span className="text-gray-600">Total</span>
                  <span className="text-navy-900">${totalValue.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No holdings linked to this client.</p>
            )}
          </div>

          {/* Accounts */}
          {accounts?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-navy-900 mb-3">Accounts</h2>
              <div className="space-y-2">
                {accounts.map((acc) => (
                  <div key={acc.id} className="text-xs text-gray-600 py-1.5 border-b border-gray-100 last:border-0">
                    <p className="font-medium text-navy-800">{acc.account_name}</p>
                    <p className="text-gray-400 capitalize">{acc.account_type} · {acc.provider || 'No provider'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Created</span>
              <span>{client?.created_at ? new Date(client.created_at).toLocaleDateString() : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Updated</span>
              <span>{client?.updated_at ? new Date(client.updated_at).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

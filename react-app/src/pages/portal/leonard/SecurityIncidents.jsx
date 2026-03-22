import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle, Plus, X, Loader2, ArrowLeft, ChevronDown,
} from 'lucide-react';
import { useIncidents, useCreateIncident, useUpdateIncident } from '../../../hooks/useLeonard';

const SEV_BADGE = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
  info:     'bg-blue-100 text-blue-700',
};

const STATUS_BADGE = {
  open:          'bg-red-100 text-red-700',
  investigating: 'bg-orange-100 text-orange-700',
  contained:     'bg-yellow-100 text-yellow-700',
  resolved:      'bg-green-100 text-green-700',
  closed:        'bg-gray-100 text-gray-500',
};

const incidentSchema = z.object({
  title:           z.string().min(2),
  description:     z.string().optional(),
  severity:        z.enum(['critical','high','medium','low','info']),
  status:          z.enum(['open','investigating','contained','resolved','closed']),
  incident_type:   z.string().optional(),
  asset_id:        z.string().optional().nullable(),
  detected_at:     z.string().optional(),
  resolved_at:     z.string().optional().nullable(),
});

function IncidentModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: createErr } = useCreateIncident();
  const { mutate: update, isPending: updating, error: updateErr } = useUpdateIncident();
  const isPending = creating || updating;
  const error = createErr || updateErr;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(incidentSchema),
    defaultValues: existing ? {
      ...existing,
      detected_at: existing.detected_at?.slice(0, 16) || '',
      resolved_at: existing.resolved_at?.slice(0, 16) || '',
    } : {
      severity: 'medium',
      status: 'open',
      detected_at: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      asset_id: data.asset_id || null,
      resolved_at: data.resolved_at || null,
    };
    if (isEdit) {
      update({ id: existing.id, ...payload }, { onSuccess: onClose });
    } else {
      create(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">{isEdit ? 'Edit Incident' : 'Log Incident'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Severity</label>
              <select {...register('severity')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['critical','high','medium','low','info'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['open','investigating','contained','resolved','closed'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Incident Type</label>
            <input {...register('incident_type')} placeholder="e.g. phishing, malware, data_breach…" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Detected At</label>
              <input type="datetime-local" {...register('detected_at')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Resolved At</label>
              <input type="datetime-local" {...register('resolved_at')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea rows={3} {...register('description')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Log Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusDropdown({ incident }) {
  const [open, setOpen] = useState(false);
  const { mutate: update } = useUpdateIncident();

  const choose = (status) => {
    update({ id: incident.id, status });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[incident.status] || ''}`}
      >
        {incident.status} <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-6 z-10 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] py-1">
          {['open','investigating','contained','resolved','closed'].map((s) => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); choose(s); }}
              className="w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-gray-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SecurityIncidents() {
  const navigate = useNavigate();
  const [sevFilter, setSevFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: incidents, isLoading, error } = useIncidents({
    severity: sevFilter || undefined,
    status: statusFilter || undefined,
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/portal/leonard/security')} className="text-gray-400 hover:text-navy-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <AlertTriangle size={20} /> Security Incidents
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{incidents?.length || 0} incidents</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          <Plus size={16} /> Log Incident
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1.5">
          {['', 'critical', 'high', 'medium', 'low', 'info'].map((s) => (
            <button
              key={s}
              onClick={() => setSevFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                sevFilter === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All Severity'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['', 'open', 'investigating', 'contained', 'resolved', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                statusFilter === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All Status'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !incidents?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No incidents found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Incident</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Severity</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Asset</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Detected</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{inc.title}</p>
                    {inc.description && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">{inc.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{inc.incident_type?.replace('_', ' ') || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${SEV_BADGE[inc.severity] || ''}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{inc.asset_name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {inc.detected_at ? new Date(inc.detected_at).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown incident={inc} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditing(inc)}
                      className="text-xs text-navy-600 hover:text-navy-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <IncidentModal onClose={() => setShowAdd(false)} />}
      {editing && <IncidentModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

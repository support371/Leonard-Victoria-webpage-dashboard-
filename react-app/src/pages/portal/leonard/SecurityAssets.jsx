import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Monitor, Plus, X, Loader2, ArrowLeft,
} from 'lucide-react';
import { useSecurityAssets, useCreateSecurityAsset, useUpdateSecurityAsset } from '../../../hooks/useLeonard';

const CRIT_BADGE = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100 text-green-700',
};

const PROT_BADGE = {
  monitored:    'bg-blue-100 text-blue-700',
  protected:    'bg-green-100 text-green-700',
  unmonitored:  'bg-gray-100 text-gray-500',
  compromised:  'bg-red-100 text-red-700',
  decommissioned: 'bg-gray-100 text-gray-400',
};

const assetSchema = z.object({
  asset_name:       z.string().min(2),
  asset_type:       z.enum(['server','workstation','network_device','cloud_service','application','database','endpoint','iot','other']),
  ip_address:       z.string().optional().nullable(),
  hostname:         z.string().optional().nullable(),
  os_platform:      z.string().optional().nullable(),
  owner_name:       z.string().optional().nullable(),
  criticality:      z.enum(['critical','high','medium','low']),
  protection_status: z.enum(['monitored','protected','unmonitored','compromised','decommissioned']),
  last_scan_at:     z.string().optional().nullable(),
  notes:            z.string().optional(),
});

function AssetModal({ existing, onClose }) {
  const isEdit = !!existing;
  const { mutate: create, isPending: creating, error: createErr } = useCreateSecurityAsset();
  const { mutate: update, isPending: updating, error: updateErr } = useUpdateSecurityAsset();
  const isPending = creating || updating;
  const error = createErr || updateErr;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: existing ? {
      ...existing,
      last_scan_at: existing.last_scan_at?.slice(0, 16) || '',
    } : {
      asset_type: 'server',
      criticality: 'medium',
      protection_status: 'unmonitored',
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      ip_address:  data.ip_address  || null,
      hostname:    data.hostname    || null,
      os_platform: data.os_platform || null,
      owner_name:  data.owner_name  || null,
      last_scan_at: data.last_scan_at || null,
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
          <h2 className="text-base font-semibold text-navy-900">{isEdit ? 'Edit Asset' : 'Add Asset'}</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Asset Name *</label>
            <input {...register('asset_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            {errors.asset_name && <p className="text-red-500 text-xs mt-1">{errors.asset_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Asset Type</label>
              <select {...register('asset_type')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['server','workstation','network_device','cloud_service','application','database','endpoint','iot','other'].map((t) => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Criticality</label>
              <select {...register('criticality')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['critical','high','medium','low'].map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">IP Address</label>
              <input {...register('ip_address')} placeholder="192.168.1.1" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hostname</label>
              <input {...register('hostname')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">OS / Platform</label>
              <input {...register('os_platform')} placeholder="Ubuntu 22.04" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Owner</label>
              <input {...register('owner_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Protection Status</label>
              <select {...register('protection_status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['monitored','protected','unmonitored','compromised','decommissioned'].map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Last Scan</label>
              <input type="datetime-local" {...register('last_scan_at')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={2} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SecurityAssets() {
  const navigate = useNavigate();
  const [critFilter, setCritFilter] = useState('');
  const [protFilter, setProtFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: assets, isLoading, error } = useSecurityAssets({
    criticality: critFilter || undefined,
    protection_status: protFilter || undefined,
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
            <Monitor size={20} /> Asset Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{assets?.length || 0} assets</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          <Plus size={16} /> Add Asset
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1.5">
          {['', 'critical', 'high', 'medium', 'low'].map((c) => (
            <button
              key={c}
              onClick={() => setCritFilter(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                critFilter === c ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c || 'All Criticality'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['', 'monitored', 'protected', 'unmonitored', 'compromised'].map((s) => (
            <button
              key={s}
              onClick={() => setProtFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                protFilter === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      ) : !assets?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Monitor className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No assets found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Asset</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Network</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Owner</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Criticality</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Protection</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Last Scan</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{a.asset_name}</p>
                    {a.os_platform && <p className="text-xs text-gray-400">{a.os_platform}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{a.asset_type?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {a.ip_address || a.hostname || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{a.owner_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${CRIT_BADGE[a.criticality] || ''}`}>
                      {a.criticality}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PROT_BADGE[a.protection_status] || ''}`}>
                      {a.protection_status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {a.last_scan_at ? new Date(a.last_scan_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditing(a)} className="text-xs text-navy-600 hover:text-navy-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AssetModal onClose={() => setShowAdd(false)} />}
      {editing && <AssetModal existing={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

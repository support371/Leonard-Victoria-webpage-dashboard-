/**
 * Shared holdings table used by DigitalAssets, CryptoAssets, and RealEstatePortfolio.
 * Pass `category` ('digital_asset' | 'crypto_asset' | 'real_estate') to scope the data.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { useHoldings, useCreateHolding, useUpdateHolding, useDeleteHolding } from '../../../hooks/useLeonard';

const holdingSchema = z.object({
  symbol_or_name:  z.string().min(1, 'Name required'),
  asset_subtype:   z.string().optional(),
  quantity:        z.coerce.number().min(0),
  unit_value:      z.coerce.number().min(0),
  currency:        z.string().default('USD'),
  acquisition_date: z.string().optional(),
  status:          z.enum(['active', 'sold', 'pending', 'frozen']).default('active'),
  notes:           z.string().optional(),
});

function fmtUSD(n) {
  if (!n || n === 0) return '$0';
  const num = Number(n);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000)     return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

function HoldingModal({ category, existing, onClose }) {
  const create = useCreateHolding();
  const update = useUpdateHolding();
  const isPending = create.isPending || update.isPending;
  const mutError  = create.error || update.error;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(holdingSchema),
    values: existing ? {
      symbol_or_name: existing.symbol_or_name,
      asset_subtype: existing.asset_subtype || '',
      quantity: existing.quantity,
      unit_value: existing.unit_value,
      currency: existing.currency || 'USD',
      acquisition_date: existing.acquisition_date?.slice(0, 10) || '',
      status: existing.status,
      notes: existing.notes || '',
    } : { currency: 'USD', status: 'active' },
  });

  const onSubmit = (data) => {
    const payload = { ...data, asset_category: category };
    if (existing) {
      update.mutate({ id: existing.id, ...payload }, { onSuccess: onClose });
    } else {
      create.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy-900">{existing ? 'Edit' : 'Add'} Holding</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name / Symbol *</label>
            <input {...register('symbol_or_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            {errors.symbol_or_name && <p className="text-red-500 text-xs mt-1">{errors.symbol_or_name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subtype</label>
            <input {...register('asset_subtype')} placeholder="e.g. ERC-20, REIT, SFH" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Quantity *</label>
              <input type="number" step="any" {...register('quantity')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unit Value *</label>
              <input type="number" step="any" {...register('unit_value')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
              <input {...register('currency')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Acquired</label>
              <input type="date" {...register('acquisition_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
              {['active','sold','pending','frozen'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea rows={2} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
          </div>
          {mutError && <p className="text-red-500 text-sm">{mutError.message}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-1.5 px-4 py-1.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={13} className="animate-spin" />}
              {existing ? 'Save' : 'Add Holding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HoldingsPage({ category, title, icon: Icon }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const { data: holdings, isLoading, error } = useHoldings(category);
  const deleteHolding = useDeleteHolding();

  const total = holdings?.reduce((s, h) => s + Number(h.total_value || 0), 0) || 0;

  const STATUS_BADGE = {
    active:  'bg-green-100 text-green-700',
    sold:    'bg-gray-100 text-gray-500',
    pending: 'bg-yellow-100 text-yellow-700',
    frozen:  'bg-blue-100 text-blue-700',
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            {Icon && <Icon size={20} />}
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Total: <strong>{fmtUSD(total)}</strong> across {holdings?.length || 0} position(s)</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors"
        >
          <Plus size={16} /> Add Holding
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !holdings?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          {Icon && <Icon className="mx-auto h-10 w-10 text-gray-300 mb-3" />}
          <p className="text-gray-500 font-medium">No holdings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Asset</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Subtype</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Quantity</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Unit Value</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Total Value</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Acquired</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Client</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy-900">{h.symbol_or_name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{h.asset_subtype || '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{Number(h.quantity).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{fmtUSD(h.unit_value)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-900">{fmtUSD(h.total_value)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{h.acquisition_date ? new Date(h.acquisition_date).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{h.client_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[h.status] || ''}`}>{h.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(h); setShowModal(true); }}
                        className="text-gray-400 hover:text-navy-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this holding?')) {
                            deleteHolding.mutate(h.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <HoldingModal
          category={category}
          existing={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

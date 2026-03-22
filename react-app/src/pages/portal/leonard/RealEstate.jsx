import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Plus, X, Loader2, ChevronRight } from 'lucide-react';
import { useProperties, useCreateProperty } from '../../../hooks/useLeonard';
import clsx from 'clsx';

const STATUS_BADGE = {
  active:   'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-500',
  sold:     'bg-red-100 text-red-600',
};

const OCC_BADGE = {
  occupied:          'bg-teal-100 text-teal-700',
  vacant:            'bg-yellow-100 text-yellow-700',
  partial:           'bg-blue-100 text-blue-700',
  under_renovation:  'bg-purple-100 text-purple-700',
};

const propertySchema = z.object({
  property_name:    z.string().min(2, 'Name required'),
  property_type:    z.enum(['residential','commercial','industrial','land','mixed_use','other']),
  address:          z.string().optional(),
  city:             z.string().optional(),
  state_province:   z.string().optional(),
  country:          z.string().default('US'),
  market_value:     z.coerce.number().min(0).optional().nullable(),
  acquisition_date: z.string().optional(),
  acquisition_price: z.coerce.number().min(0).optional().nullable(),
  ownership_status: z.enum(['owned','partial','leased','under_contract','pending_sale','sold']),
  occupancy_status: z.enum(['occupied','vacant','partial','under_renovation']),
  revenue_amount:   z.coerce.number().min(0).optional().nullable(),
  expense_amount:   z.coerce.number().min(0).optional().nullable(),
  revenue_period:   z.string().optional(),
  status:           z.enum(['active','archived','sold']),
  notes:            z.string().optional(),
});

function AddPropertyModal({ onClose }) {
  const { mutate: create, isPending, error } = useCreateProperty();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_type: 'residential', ownership_status: 'owned',
      occupancy_status: 'vacant', country: 'US', status: 'active',
    },
  });

  const onSubmit = (data) => create(data, { onSuccess: onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Add Property</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Name *</label>
              <input {...register('property_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              {errors.property_name && <p className="text-red-500 text-xs mt-1">{errors.property_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
              <select {...register('property_type')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['residential','commercial','industrial','land','mixed_use','other'].map((t) => <option key={t} value={t} className="capitalize">{t.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Market Value ($)</label>
              <input type="number" step="0.01" {...register('market_value')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <input {...register('address')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input {...register('city')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">State / Province</label>
              <input {...register('state_province')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ownership Status</label>
              <select {...register('ownership_status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['owned','partial','leased','under_contract','pending_sale','sold'].map((s) => <option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Occupancy</label>
              <select {...register('occupancy_status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                {['occupied','vacant','partial','under_renovation'].map((s) => <option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Acquisition Date</label>
              <input type="date" {...register('acquisition_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Acquisition Price ($)</label>
              <input type="number" step="0.01" {...register('acquisition_price')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Revenue ($)</label>
              <input type="number" step="0.01" {...register('revenue_amount')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Expenses ($)</label>
              <input type="number" step="0.01" {...register('expense_amount')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea rows={3} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error.message}</p>}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RealEstate() {
  const [statusFilter, setStatusFilter] = useState('active');
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const { data: properties, isLoading, error } = useProperties({ status: statusFilter || undefined });

  const totalValue = properties?.reduce((s, p) => s + Number(p.market_value || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            <Building2 size={20} /> Properties
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {properties?.length || 0} properties · Total market value: <strong>${totalValue.toLocaleString()}</strong>
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {['', 'active', 'sold', 'archived'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={clsx('px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors', statusFilter === s ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !properties?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No properties found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Property</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Location</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Market Value</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Ownership</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Occupancy</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">Revenue/mo</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/portal/leonard/real-estate/${p.id}`)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{p.property_name}</p>
                    {p.client_name && <p className="text-xs text-gray-400">{p.client_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize text-xs">{p.property_type.replace('_',' ')}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{[p.city, p.state_province, p.country].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy-900">{p.market_value ? `$${Number(p.market_value).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3 text-xs"><span className="capitalize">{p.ownership_status.replace('_',' ')}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${OCC_BADGE[p.occupancy_status] || ''}`}>{p.occupancy_status.replace('_',' ')}</span></td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.revenue_amount ? `$${Number(p.revenue_amount).toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddPropertyModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

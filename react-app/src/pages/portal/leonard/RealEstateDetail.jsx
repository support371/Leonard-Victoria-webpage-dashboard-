import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Edit2, Save, X, Loader2 } from 'lucide-react';
import { useProperty, useUpdateProperty } from '../../../hooks/useLeonard';

const propertySchema = z.object({
  property_name:    z.string().min(2),
  property_type:    z.enum(['residential','commercial','industrial','land','mixed_use','other']),
  address:          z.string().optional(),
  city:             z.string().optional(),
  state_province:   z.string().optional(),
  country:          z.string().default('US'),
  market_value:     z.coerce.number().min(0).optional().nullable(),
  acquisition_date: z.string().optional().nullable(),
  acquisition_price: z.coerce.number().min(0).optional().nullable(),
  ownership_status: z.enum(['owned','partial','leased','under_contract','pending_sale','sold']),
  occupancy_status: z.enum(['occupied','vacant','partial','under_renovation']),
  revenue_amount:   z.coerce.number().min(0).optional().nullable(),
  expense_amount:   z.coerce.number().min(0).optional().nullable(),
  revenue_period:   z.string().optional(),
  status:           z.enum(['active','archived','sold']),
  notes:            z.string().optional(),
});

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-800 mt-0.5">{value ?? '—'}</p>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function RealEstateDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  const { data: property, isLoading, error } = useProperty(propertyId);
  const { mutate: update, isPending, error: saveError } = useUpdateProperty(propertyId);

  const { register, handleSubmit, reset, formState: { errors: fe } } = useForm({
    resolver: zodResolver(propertySchema),
    values: property ? {
      ...property,
      acquisition_date: property.acquisition_date?.slice(0, 10) || '',
    } : undefined,
  });

  const onSubmit = (data) => update(data, { onSuccess: () => setEditing(false) });

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-navy-500" /></div>;
  if (error)     return <div className="p-8 text-red-600 text-sm">{error.message}</div>;
  if (!property) return <div className="p-8 text-gray-500 text-sm">Property not found.</div>;

  const netRevenue = (Number(property.revenue_amount || 0) - Number(property.expense_amount || 0));

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/portal/leonard/real-estate')} className="text-gray-400 hover:text-navy-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-navy-900">{property.property_name}</h1>
          <p className="text-sm text-gray-500 capitalize">{property.property_type.replace('_',' ')} · {property.ownership_status.replace('_',' ')}</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:border-navy-500">
            <Edit2 size={14} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={() => { setEditing(false); reset(); }} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <X size={14} /> Cancel
            </button>
            <button form="property-form" type="submit" disabled={isPending} className="flex items-center gap-1 px-3 py-1.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        )}
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">Market Value</p>
          <p className="text-lg font-bold text-navy-900">{property.market_value ? `$${Number(property.market_value).toLocaleString()}` : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">Monthly Revenue</p>
          <p className="text-lg font-bold text-green-700">{property.revenue_amount ? `$${Number(property.revenue_amount).toLocaleString()}` : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">Net ({property.revenue_period || 'monthly'})</p>
          <p className={`text-lg font-bold ${netRevenue >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {`$${netRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {!editing ? (
          <div className="grid grid-cols-2 gap-4">
            <Field label="Property Name"   value={property.property_name} />
            <Field label="Type"            value={property.property_type?.replace('_',' ')} />
            <Field label="Address"         value={property.address} />
            <Field label="City"            value={property.city} />
            <Field label="State / Province" value={property.state_province} />
            <Field label="Country"         value={property.country} />
            <Field label="Ownership"       value={property.ownership_status?.replace('_',' ')} />
            <Field label="Occupancy"       value={property.occupancy_status?.replace('_',' ')} />
            <Field label="Acquisition Date"  value={property.acquisition_date ? new Date(property.acquisition_date).toLocaleDateString() : null} />
            <Field label="Acquisition Price" value={property.acquisition_price ? `$${Number(property.acquisition_price).toLocaleString()}` : null} />
            <Field label="Expense/mo"      value={property.expense_amount ? `$${Number(property.expense_amount).toLocaleString()}` : null} />
            <Field label="Status"          value={property.status} />
            {property.notes && (
              <div className="col-span-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Notes</p>
                <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-line">{property.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <form id="property-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <FormField label="Property Name *">
                  <input {...register('property_name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                  {fe.property_name && <p className="text-red-500 text-xs mt-1">{fe.property_name.message}</p>}
                </FormField>
              </div>
              <FormField label="Type">
                <select {...register('property_type')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {['residential','commercial','industrial','land','mixed_use','other'].map((t) => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Market Value ($)">
                <input type="number" step="0.01" {...register('market_value')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <div className="col-span-2">
                <FormField label="Address">
                  <input {...register('address')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </FormField>
              </div>
              <FormField label="City">
                <input {...register('city')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="State / Province">
                <input {...register('state_province')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="Ownership Status">
                <select {...register('ownership_status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {['owned','partial','leased','under_contract','pending_sale','sold'].map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Occupancy Status">
                <select {...register('occupancy_status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {['occupied','vacant','partial','under_renovation'].map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                </select>
              </FormField>
              <FormField label="Acquisition Date">
                <input type="date" {...register('acquisition_date')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="Acquisition Price ($)">
                <input type="number" step="0.01" {...register('acquisition_price')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="Revenue/mo ($)">
                <input type="number" step="0.01" {...register('revenue_amount')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="Expenses/mo ($)">
                <input type="number" step="0.01" {...register('expense_amount')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
              </FormField>
              <FormField label="Status">
                <select {...register('status')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500">
                  {['active','archived','sold'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <div className="col-span-2">
                <FormField label="Notes">
                  <textarea rows={3} {...register('notes')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" />
                </FormField>
              </div>
            </div>
            {saveError && <p className="text-red-500 text-sm mt-3">{saveError.message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

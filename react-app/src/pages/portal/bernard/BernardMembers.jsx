import { useState } from 'react';
import { Users, Loader2, Search } from 'lucide-react';
import { useBernardMembers } from '../../../hooks/useBernard';

const TIER_BADGE = {
  community:   'bg-gray-100 text-gray-600',
  stewardship: 'bg-blue-100 text-blue-700',
  legacy:      'bg-purple-100 text-purple-700',
};

const STATUS_BADGE = {
  active:    'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  inactive:  'bg-gray-100 text-gray-400',
  suspended: 'bg-red-100 text-red-600',
};

export default function BernardMembers() {
  const [statusFilter, setStatusFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: members, isLoading, error } = useBernardMembers({
    status: statusFilter || undefined,
    tier:   tierFilter   || undefined,
  });

  const filtered = members?.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.first_name?.toLowerCase().includes(q) ||
      m.last_name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-950 flex items-center gap-2"><Users size={20} /> Members</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered?.length || 0} members</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="flex gap-1.5">
          {['', 'active', 'pending', 'inactive'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['', 'community', 'stewardship', 'legacy'].map((t) => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${tierFilter === t ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t || 'All Tiers'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-6 w-6 text-emerald-500" /></div>
      ) : error ? (
        <p className="text-red-500 text-sm">{error.message}</p>
      ) : !filtered?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No members found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Member</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Tier</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                        {m.first_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-emerald-900">{m.first_name} {m.last_name}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TIER_BADGE[m.membership_tier] || ''}`}>
                      {m.membership_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_BADGE[m.status] || ''}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.phone || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

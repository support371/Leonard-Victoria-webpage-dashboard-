import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search } from 'lucide-react';
import { apiClient } from '../../lib/api';

function TierBadge({ tier }) {
  const map = {
    community: 'bg-gray-100 text-gray-700',
    stewardship: 'bg-blue-100 text-blue-700',
    legacy: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${map[tier] || map.community}`}>
      {tier}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-gray-100 text-gray-500',
    suspended: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

export default function Members() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await apiClient.get('/members');
      return res.data;
    },
  });

  const filtered = data?.members?.filter((m) =>
    search === '' ||
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.members?.length ?? 0} total members
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-gray-500">Unable to load members.</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No members found.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {member.first_name} {member.last_name}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{member.email}</td>
                  <td className="px-5 py-4"><TierBadge tier={member.membership_tier} /></td>
                  <td className="px-5 py-4"><StatusBadge status={member.status} /></td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Briefcase, User, Star, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';

const CATEGORIES = [
  'All', 'Advisory', 'Legal', 'Tech', 'Operational', 'Executive Coaching', 'Wealth Management', 'Security'
];

export default function ServiceDirectory() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const { data: services, isLoading } = useQuery({
    queryKey: ['community', 'services', category],
    queryFn: async () => {
      const res = await apiClient.get('/community/services', {
        params: { category: category === 'All' ? undefined : category }
      });
      return res.data;
    }
  });

  const filtered = services?.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.practitioner_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-navy-950 py-16 text-white text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Service Marketplace</h1>
        <p className="text-navy-300 max-w-2xl mx-auto mb-10 text-lg">
          Browse and connect with specialized services offered by our network of practitioners.
        </p>
        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 group-hover:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by service or practitioner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder-white/20"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter size={16} /> Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-white hover:text-navy-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">No services found matching your criteria.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 text-blue-600 font-bold hover:underline underline-offset-4">Reset all filters</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered?.map(service => (
                <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Briefcase size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase tracking-widest">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2 leading-tight">{service.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{service.expected_outcome}</p>

                  <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-50">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                      {service.practitioner_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Practitioner</p>
                      <p className="text-xs font-bold text-navy-800 truncate">{service.practitioner_name}</p>
                    </div>
                  </div>

                  <Link to={`/community/profiles/${service.profile_id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-navy-900 rounded-xl font-bold text-sm transition-all">
                    View Practitioner <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

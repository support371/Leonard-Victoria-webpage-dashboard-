import React, { useState, useMemo } from 'react';
import { FileText, Search, Download, Eye, Grid, List, Tag } from 'lucide-react';
import { Card, Badge, SectionHeader, statusVariant } from '../../components/ui';
import { REPOSITORY_ITEMS } from '../../data/seed';

const CATEGORIES = ['All', 'Manifestos', 'PMA/FBO Documents', 'Membership Documents', 'Service Documents', 'Legal Records', 'Internal Notes', 'Technical References', 'Brand Assets'];

const FileIcon = ({ category }) => {
  const colors = {
    'Manifestos': 'text-amber-500 bg-amber-50',
    'PMA/FBO Documents': 'text-indigo-500 bg-indigo-50',
    'Legal Records': 'text-red-500 bg-red-50',
    'Membership Documents': 'text-teal-500 bg-teal-50',
    'Service Documents': 'text-blue-500 bg-blue-50',
    'Internal Notes': 'text-slate-500 bg-slate-100',
    'Technical References': 'text-purple-500 bg-purple-50',
    'Brand Assets': 'text-pink-500 bg-pink-50',
  };
  const cls = colors[category] || 'text-slate-500 bg-slate-100';
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cls}`}>
      <FileText className="w-4 h-4" />
    </div>
  );
};

const CentralRepository = () => {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('table');

  const filtered = useMemo(() => {
    return REPOSITORY_ITEMS.filter(item => {
      const catOk = category === 'All' || item.category === category;
      const searchOk = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()) || item.tags.some(t => t.includes(search.toLowerCase()));
      return catOk && searchOk;
    });
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Central Repository"
        subtitle="Structured document hub with category filters, search, and ownership tracking."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents, categories, tags..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 self-start">
          <button onClick={() => setView('table')} className={`p-2 rounded-md transition-colors ${view === 'table' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('grid')} className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat ? 'bg-amber-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400">{filtered.length} document{filtered.length !== 1 ? 's' : ''} found</p>

      {view === 'table' ? (
        <Card className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Document</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Owner</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Updated</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Size</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileIcon category={item.category} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-0.5 text-[10px] text-slate-400 font-medium">
                              <Tag className="w-2.5 h-2.5" />{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <Badge variant="default" size="xs">{item.category}</Badge>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500 hidden lg:table-cell">{item.owner}</td>
                  <td className="px-5 py-4 text-xs text-slate-400 font-mono hidden lg:table-cell">{item.updated}</td>
                  <td className="px-5 py-4 text-right text-xs text-slate-400 font-mono">{item.size}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md hover:bg-amber-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-slate-400 text-sm">No documents found.</div>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <Card key={item.id} hover className="p-5">
              <div className="flex items-start justify-between mb-4">
                <FileIcon category={item.category} />
                <Badge variant={statusVariant(item.status)} size="xs">{item.status}</Badge>
              </div>
              <p className="text-sm font-semibold text-slate-900 mb-2 leading-tight">{item.name}</p>
              <p className="text-xs text-slate-400 mb-3">{item.category}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">{item.owner}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-amber-600 rounded transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                  <button className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && <div className="col-span-full py-16 text-center text-slate-400">No documents found.</div>}
        </div>
      )}
    </div>
  );
};

export default CentralRepository;

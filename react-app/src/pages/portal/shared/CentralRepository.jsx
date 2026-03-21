import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Grid, List, FileText, Download, Eye,
  Tag, Calendar, CheckCircle, Clock, AlertCircle, ChevronDown,
} from 'lucide-react';

const REPO_ITEMS = [
  { id: 1,  title: 'PMA Member Agreement v3.2',            category: 'Legal/PMA',      portal: 'Bernard',   updated: 'Mar 12, 2025', status: 'Active',  size: '2.4 MB', format: 'PDF' },
  { id: 2,  title: 'FBO Formation Documents',              category: 'Legal/PMA',      portal: 'Bernard',   updated: 'Feb 28, 2025', status: 'Active',  size: '8.1 MB', format: 'PDF' },
  { id: 3,  title: 'Organization Manifesto — 2025 Edition',category: 'Manifestos',     portal: 'All',       updated: 'Jan 15, 2025', status: 'Active',  size: '1.2 MB', format: 'PDF' },
  { id: 4,  title: 'Membership Tiers & Benefits Guide',    category: 'Membership',     portal: 'Victoria',  updated: 'Mar 01, 2025', status: 'Active',  size: '3.7 MB', format: 'PDF' },
  { id: 5,  title: 'Q1 2025 Portfolio Report',             category: 'Internal Notes', portal: 'Leonard',   updated: 'Apr 02, 2025', status: 'Active',  size: '5.2 MB', format: 'XLSX' },
  { id: 6,  title: 'Investment Policy Statement',          category: 'Legal/PMA',      portal: 'Leonard',   updated: 'Dec 10, 2024', status: 'Active',  size: '1.8 MB', format: 'PDF' },
  { id: 7,  title: 'Board Meeting Minutes — March 2025',   category: 'Internal Notes', portal: 'Victoria',  updated: 'Mar 18, 2025', status: 'Active',  size: '0.9 MB', format: 'DOCX' },
  { id: 8,  title: 'Community Programs Catalog 2025',      category: 'Services',       portal: 'Bernard',   updated: 'Feb 14, 2025', status: 'Active',  size: '4.5 MB', format: 'PDF' },
  { id: 9,  title: 'Technical Architecture Overview',      category: 'Technical',      portal: 'Developer', updated: 'Mar 20, 2025', status: 'Active',  size: '2.1 MB', format: 'PDF' },
  { id: 10, title: 'Brand Style Guide v2',                 category: 'Brand/Design',   portal: 'All',       updated: 'Jan 30, 2025', status: 'Active',  size: '12.4 MB',format: 'PDF' },
  { id: 11, title: 'Governance Structure Document',        category: 'Legal/PMA',      portal: 'Victoria',  updated: 'Feb 05, 2025', status: 'Active',  size: '2.9 MB', format: 'PDF' },
  { id: 12, title: 'Security Protocols Manual',            category: 'Technical',      portal: 'Leonard',   updated: 'Mar 05, 2025', status: 'Active',  size: '3.3 MB', format: 'PDF' },
  { id: 13, title: 'Donor & Giving Guidelines',            category: 'Membership',     portal: 'Bernard',   updated: 'Jan 22, 2025', status: 'Active',  size: '1.6 MB', format: 'PDF' },
  { id: 14, title: 'Strategic Plan 2025–2027',             category: 'Internal Notes', portal: 'All',       updated: 'Jan 08, 2025', status: 'Active',  size: '6.8 MB', format: 'PDF' },
  { id: 15, title: 'Privacy Policy',                      category: 'Legal/PMA',      portal: 'All',       updated: 'Nov 15, 2024', status: 'Active',  size: '0.4 MB', format: 'PDF' },
  { id: 16, title: 'Terms of Service',                    category: 'Legal/PMA',      portal: 'All',       updated: 'Nov 15, 2024', status: 'Active',  size: '0.5 MB', format: 'PDF' },
  { id: 17, title: 'API Integration Guide',               category: 'Technical',      portal: 'Developer', updated: 'Mar 19, 2025', status: 'Draft',   size: '1.1 MB', format: 'MD' },
  { id: 18, title: 'Member Onboarding Checklist',         category: 'Membership',     portal: 'Victoria',  updated: 'Feb 20, 2025', status: 'Active',  size: '0.7 MB', format: 'PDF' },
  { id: 19, title: 'Real Estate Asset Registry',          category: 'Internal Notes', portal: 'Leonard',   updated: 'Mar 10, 2025', status: 'Active',  size: '4.0 MB', format: 'XLSX' },
  { id: 20, title: 'Crypto Holdings Statement Q4 2024',   category: 'Internal Notes', portal: 'Leonard',   updated: 'Jan 05, 2025', status: 'Active',  size: '1.4 MB', format: 'PDF' },
  { id: 21, title: 'Committee Charter — Finance',         category: 'Legal/PMA',      portal: 'Victoria',  updated: 'Feb 10, 2025', status: 'Active',  size: '0.8 MB', format: 'PDF' },
  { id: 22, title: 'Event Planning Guidelines',           category: 'Services',       portal: 'Bernard',   updated: 'Mar 03, 2025', status: 'Active',  size: '1.3 MB', format: 'PDF' },
];

const CATEGORIES = ['All', 'Manifestos', 'Legal/PMA', 'Membership', 'Services', 'Technical', 'Brand/Design', 'Internal Notes'];
const PORTALS    = ['All Portals', 'All', 'Leonard', 'Victoria', 'Bernard', 'Developer'];

const PORTAL_COLORS = {
  All:       'bg-navy-100 text-navy-700',
  Leonard:   'bg-indigo-100 text-indigo-700',
  Victoria:  'bg-purple-100 text-purple-700',
  Bernard:   'bg-teal-100 text-teal-700',
  Developer: 'bg-slate-100 text-slate-700',
};

const CAT_COLORS = {
  'Manifestos':     'bg-amber-100 text-amber-700',
  'Legal/PMA':      'bg-red-100 text-red-700',
  'Membership':     'bg-blue-100 text-blue-700',
  'Services':       'bg-green-100 text-green-700',
  'Technical':      'bg-cyan-100 text-cyan-700',
  'Brand/Design':   'bg-pink-100 text-pink-700',
  'Internal Notes': 'bg-orange-100 text-orange-700',
};

const FORMAT_COLORS = {
  PDF:  'bg-red-50 text-red-600 border border-red-200',
  XLSX: 'bg-green-50 text-green-600 border border-green-200',
  DOCX: 'bg-blue-50 text-blue-600 border border-blue-200',
  MD:   'bg-slate-50 text-slate-600 border border-slate-200',
};

function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <Clock className="w-3 h-3" /> Draft
    </span>
  );
}

function RepositoryCard({ item }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-navy-400 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="p-2.5 bg-navy-50 rounded-lg group-hover:bg-navy-100 transition-colors">
          <FileText className="w-5 h-5 text-navy-600" />
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${FORMAT_COLORS[item.format] || 'bg-gray-100 text-gray-600'}`}>
          {item.format}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-navy-900 leading-snug mb-3 group-hover:text-navy-700 transition-colors">
        {item.title}
      </h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CAT_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
          {item.category}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PORTAL_COLORS[item.portal] || 'bg-gray-100 text-gray-600'}`}>
          {item.portal}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.updated}</span>
        <span>{item.size}</span>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={item.status} />
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-navy-600 hover:bg-navy-50 rounded-lg transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RepositoryRow({ item }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 bg-white border-b border-slate-100 hover:bg-navy-50/40 transition-colors group">
      <div className="p-2 bg-navy-50 rounded-lg flex-shrink-0">
        <FileText className="w-4 h-4 text-navy-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-900 truncate group-hover:text-navy-700">{item.title}</p>
      </div>
      <span className={`hidden md:inline text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${CAT_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
        {item.category}
      </span>
      <span className={`hidden lg:inline text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${PORTAL_COLORS[item.portal] || 'bg-gray-100 text-gray-600'}`}>
        {item.portal}
      </span>
      <span className="hidden sm:block text-xs text-slate-500 flex-shrink-0 w-28 text-right">{item.updated}</span>
      <StatusBadge status={item.status} />
      <div className="flex gap-1.5 flex-shrink-0">
        <button className="p-1.5 text-slate-400 hover:text-navy-600 hover:bg-navy-100 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-slate-400 hover:text-navy-600 hover:bg-navy-100 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CentralRepository() {
  const [search, setSearch]       = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePortal, setActivePortal]     = useState('All Portals');
  const [viewMode, setViewMode]   = useState('grid');
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const filtered = useMemo(() => {
    return REPO_ITEMS.filter(item => {
      const matchSearch   = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchPortal   = activePortal === 'All Portals' || item.portal === activePortal;
      return matchSearch && matchCategory && matchPortal;
    });
  }, [search, activeCategory, activePortal]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Central Repository</h1>
          <p className="text-slate-500 text-sm mt-1">{REPO_ITEMS.length} documents across all portals</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-navy-100 text-navy-700' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-navy-100 text-navy-700' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(p => !p)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white hover:border-navy-300 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700">{activePortal}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showPortalMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 min-w-36">
              {PORTALS.map(p => (
                <button
                  key={p}
                  onClick={() => { setActivePortal(p); setShowPortalMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-50 transition-colors ${activePortal === p ? 'text-navy-700 font-medium' : 'text-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-slate-200 pb-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px ${
              activeCategory === cat
                ? 'border-navy-600 text-navy-700 bg-navy-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Showing <span className="font-semibold text-navy-800">{filtered.length}</span> of {REPO_ITEMS.length} items
          {activeCategory !== 'All' && <span> in <span className="font-medium text-navy-700">{activeCategory}</span></span>}
          {activePortal !== 'All Portals' && <span> for <span className="font-medium text-navy-700">{activePortal}</span></span>}
        </span>
        {(activeCategory !== 'All' || activePortal !== 'All Portals' || search) && (
          <button
            onClick={() => { setActiveCategory('All'); setActivePortal('All Portals'); setSearch(''); }}
            className="text-navy-600 hover:text-navy-800 font-medium text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No documents found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => <RepositoryCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <div className="w-8 flex-shrink-0" />
            <div className="flex-1">Title</div>
            <div className="hidden md:block w-32 flex-shrink-0">Category</div>
            <div className="hidden lg:block w-24 flex-shrink-0">Portal</div>
            <div className="hidden sm:block w-28 flex-shrink-0 text-right">Updated</div>
            <div className="w-20 flex-shrink-0">Status</div>
            <div className="w-16 flex-shrink-0">Actions</div>
          </div>
          {filtered.map(item => <RepositoryRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  ClipboardList, Search, Eye, CheckCircle, Flag, Clock,
  AlertTriangle, User, Calendar, ArrowRight, FileText,
  ShieldAlert, BarChart3, Users, ChevronDown, Filter,
  TrendingUp, Circle,
} from 'lucide-react';

const REVIEW_ITEMS = [
  {
    id: 1,
    title: 'Investment Policy Amendment',
    type: 'Document',
    portal: 'Leonard',
    priority: 'High',
    status: 'pending',
    reviewer: 'L. Chapman',
    submittedBy: 'Portfolio Mgr',
    dueDate: 'Mar 25, 2025',
    submittedDate: 'Mar 18, 2025',
    desc: 'Proposed amendment to add cryptocurrency allocation targets to the IPS.',
  },
  {
    id: 2,
    title: 'Q1 Board Resolution #2025-003',
    type: 'Resolution',
    portal: 'Victoria',
    priority: 'Normal',
    status: 'pending',
    reviewer: 'V. Harmon',
    submittedBy: 'Governance Team',
    dueDate: 'Mar 28, 2025',
    submittedDate: 'Mar 19, 2025',
    desc: 'Resolution to approve Q1 operating budget amendments.',
  },
  {
    id: 3,
    title: 'New Member Application — J. Mitchell',
    type: 'Application',
    portal: 'Bernard',
    priority: 'Normal',
    status: 'pending',
    reviewer: 'B. Founders',
    submittedBy: 'Membership Coord.',
    dueDate: 'Mar 26, 2025',
    submittedDate: 'Mar 20, 2025',
    desc: 'Tier 2 membership application for James Mitchell, referral from existing member.',
  },
  {
    id: 4,
    title: 'Security Incident Report #SI-2025-041',
    type: 'Report',
    portal: 'Leonard',
    priority: 'High',
    status: 'in_progress',
    reviewer: 'L. Chapman',
    submittedBy: 'Security Team',
    dueDate: 'Mar 22, 2025',
    submittedDate: 'Mar 17, 2025',
    desc: 'Post-incident analysis of phishing attempt on admin credentials.',
  },
  {
    id: 5,
    title: 'Committee Charter Amendment — Finance',
    type: 'Document',
    portal: 'Victoria',
    priority: 'Normal',
    status: 'pending',
    reviewer: 'V. Harmon',
    submittedBy: 'Finance Committee',
    dueDate: 'Apr 01, 2025',
    submittedDate: 'Mar 18, 2025',
    desc: 'Updated quorum requirements and voting procedure for the Finance Committee.',
  },
  {
    id: 6,
    title: 'Crypto Portfolio Rebalancing Proposal',
    type: 'Document',
    portal: 'Leonard',
    priority: 'High',
    status: 'pending',
    reviewer: 'L. Chapman',
    submittedBy: 'Crypto Desk',
    dueDate: 'Mar 24, 2025',
    submittedDate: 'Mar 16, 2025',
    desc: 'Proposal to shift 8% BTC allocation to ETH based on Q1 performance data.',
  },
  {
    id: 7,
    title: 'Event Budget Request — Spring Summit',
    type: 'Document',
    portal: 'Bernard',
    priority: 'Normal',
    status: 'pending',
    reviewer: 'B. Founders',
    submittedBy: 'Events Team',
    dueDate: 'Mar 30, 2025',
    submittedDate: 'Mar 19, 2025',
    desc: '$42,500 budget request for the Annual Spring Summit — April 18–20, 2025.',
  },
  {
    id: 8,
    title: 'Legal Entity Formation Documents',
    type: 'Document',
    portal: 'Bernard',
    priority: 'High',
    status: 'pending',
    reviewer: 'Legal Team',
    submittedBy: 'B. Founders',
    dueDate: 'Mar 22, 2025',
    submittedDate: 'Mar 15, 2025',
    desc: 'Articles of Formation and PMA Operating Agreement for new entity.',
  },
  {
    id: 9,
    title: 'Annual Governance Review 2025',
    type: 'Report',
    portal: 'Victoria',
    priority: 'Normal',
    status: 'in_progress',
    reviewer: 'V. Harmon',
    submittedBy: 'Governance Office',
    dueDate: 'Apr 05, 2025',
    submittedDate: 'Mar 14, 2025',
    desc: 'Comprehensive review of governance structure, committee performance, and policy gaps.',
  },
  {
    id: 10,
    title: 'Donor Recognition Program Proposal',
    type: 'Document',
    portal: 'Bernard',
    priority: 'Low',
    status: 'pending',
    reviewer: 'B. Founders',
    submittedBy: 'Dev. Director',
    dueDate: 'Apr 10, 2025',
    submittedDate: 'Mar 20, 2025',
    desc: 'New tiered donor recognition framework with naming rights for Tier A donors.',
  },
  {
    id: 11,
    title: 'Real Estate Acquisition Proposal — Oak View',
    type: 'Document',
    portal: 'Leonard',
    priority: 'High',
    status: 'flagged',
    reviewer: 'L. Chapman',
    submittedBy: 'RE Acquisitions',
    dueDate: 'Mar 21, 2025',
    submittedDate: 'Mar 10, 2025',
    desc: 'Flagged: Missing phase-2 environmental report. Cannot proceed until cleared.',
  },
  {
    id: 12,
    title: 'Member Tier Upgrade — Hernandez Holdings',
    type: 'Application',
    portal: 'Leonard',
    priority: 'Normal',
    status: 'completed',
    reviewer: 'L. Chapman',
    submittedBy: 'Account Mgr',
    dueDate: 'Mar 15, 2025',
    submittedDate: 'Mar 08, 2025',
    desc: 'Approved: Upgraded Hernandez Holdings from Tier 1 to Tier 2.',
  },
  {
    id: 13,
    title: 'Q1 Portfolio Compliance Report',
    type: 'Report',
    portal: 'Leonard',
    priority: 'Normal',
    status: 'completed',
    reviewer: 'L. Chapman',
    submittedBy: 'Compliance Team',
    dueDate: 'Mar 10, 2025',
    submittedDate: 'Mar 02, 2025',
    desc: 'Approved: Q1 2025 portfolio in full compliance.',
  },
  {
    id: 14,
    title: 'PMA Bylaw Amendment — Article IV',
    type: 'Document',
    portal: 'Victoria',
    priority: 'High',
    status: 'completed',
    reviewer: 'V. Harmon',
    submittedBy: 'Legal Counsel',
    dueDate: 'Mar 12, 2025',
    submittedDate: 'Mar 01, 2025',
    desc: 'Approved: Updated membership eligibility criteria in Article IV.',
  },
  {
    id: 15,
    title: 'API Access Request — Third-Party Integration',
    type: 'Document',
    portal: 'Leonard',
    priority: 'Normal',
    status: 'flagged',
    reviewer: 'Dev Team',
    submittedBy: 'Tech Lead',
    dueDate: 'Mar 23, 2025',
    submittedDate: 'Mar 17, 2025',
    desc: 'Flagged: Pending security assessment before API credentials can be issued.',
  },
];

const FILTER_TABS = [
  { id: 'all',        label: 'All' },
  { id: 'pending',    label: 'Pending Review' },
  { id: 'in_progress',label: 'In Progress' },
  { id: 'completed',  label: 'Completed' },
  { id: 'flagged',    label: 'Flagged' },
];

const TYPE_COLORS = {
  Document:    'bg-blue-100 text-blue-700 border-blue-200',
  Resolution:  'bg-purple-100 text-purple-700 border-purple-200',
  Application: 'bg-teal-100 text-teal-700 border-teal-200',
  Report:      'bg-orange-100 text-orange-700 border-orange-200',
};

const PORTAL_COLORS = {
  Leonard:   'bg-indigo-100 text-indigo-700',
  Victoria:  'bg-purple-100 text-purple-700',
  Bernard:   'bg-teal-100 text-teal-700',
  Developer: 'bg-slate-100 text-slate-700',
};

const PRIORITY_CONFIG = {
  High:   { cls: 'text-red-700 bg-red-50 border-red-200',    dot: 'bg-red-500' },
  Normal: { cls: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
  Low:    { cls: 'text-slate-600 bg-slate-50 border-slate-200', dot: 'bg-slate-400' },
};

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     cls: 'text-amber-700 bg-amber-50 border-amber-200',  icon: Clock },
  in_progress: { label: 'In Progress', cls: 'text-blue-700 bg-blue-50 border-blue-200',     icon: ArrowRight },
  completed:   { label: 'Completed',   cls: 'text-green-700 bg-green-50 border-green-200',  icon: CheckCircle },
  flagged:     { label: 'Flagged',     cls: 'text-red-700 bg-red-50 border-red-200',        icon: Flag },
};

function ReviewCard({ item }) {
  const pCfg  = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.Normal;
  const sCfg  = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const SIcon = sCfg.icon;

  return (
    <div className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all ${
      item.status === 'flagged'    ? 'border-red-200 hover:border-red-300' :
      item.priority === 'High' && item.status === 'pending' ? 'border-amber-200 hover:border-amber-300' :
      'border-slate-200 hover:border-navy-300'
    }`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {item.type}
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PORTAL_COLORS[item.portal] || 'bg-gray-100 text-gray-700'}`}>
            {item.portal}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pCfg.dot}`} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${pCfg.cls}`}>
            {item.priority}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-navy-900 leading-snug mb-2">{item.title}</h3>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">{item.desc}</p>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>Reviewer: <span className="font-medium text-slate-700">{item.reviewer}</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>Submitted by: <span className="font-medium text-slate-700">{item.submittedBy}</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span>Due: <span className="font-medium text-slate-700">{item.dueDate}</span></span>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${sCfg.cls}`}>
          <SIcon className="w-3 h-3" /> {sCfg.label}
        </span>
        <div className="flex gap-1.5">
          <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-200 rounded-lg transition-colors">
            <Eye className="w-3 h-3" /> Review
          </button>
          {item.status !== 'completed' && item.status !== 'flagged' && (
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
              <CheckCircle className="w-3 h-3" /> Approve
            </button>
          )}
          {item.status !== 'flagged' && item.status !== 'completed' && (
            <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
              <Flag className="w-3 h-3" /> Flag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewCenter() {
  const [activeTab, setActiveTab]     = useState('all');
  const [search, setSearch]           = useState('');
  const [portalFilter, setPortalFilter] = useState('All');
  const [showPortalMenu, setShowPortalMenu] = useState(false);

  const pendingCount = REVIEW_ITEMS.filter(i => i.status === 'pending').length;

  const filtered = useMemo(() => {
    return REVIEW_ITEMS.filter(item => {
      const matchTab    = activeTab === 'all' || item.status === activeTab;
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchPortal = portalFilter === 'All' || item.portal === portalFilter;
      return matchTab && matchSearch && matchPortal;
    });
  }, [activeTab, search, portalFilter]);

  const completedThisMonth = REVIEW_ITEMS.filter(i => i.status === 'completed').length;
  const inProgress         = REVIEW_ITEMS.filter(i => i.status === 'in_progress').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-navy-900">Review Center</h1>
          <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-red-500 rounded-full">
            {pendingCount}
          </span>
        </div>
        <p className="text-slate-500 text-sm sm:text-right">Approval queue across all portals</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review',       value: pendingCount,         color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock },
          { label: 'In Progress',          value: inProgress,           color: 'text-blue-700',  bg: 'bg-blue-50',  border: 'border-blue-200',  icon: ArrowRight },
          { label: 'Completed This Month', value: completedThisMonth,   color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
          { label: 'Avg Response Time',    value: '2.4 days',           color: 'text-navy-700',  bg: 'bg-navy-50',  border: 'border-navy-200',  icon: TrendingUp },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`rounded-xl p-4 border flex items-center gap-3 ${stat.bg} ${stat.border}`}>
              <Icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search review items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-navy-400"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowPortalMenu(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white hover:border-navy-300 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-700">{portalFilter === 'All' ? 'All Portals' : portalFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {showPortalMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 min-w-36">
              {['All', 'Leonard', 'Victoria', 'Bernard'].map(p => (
                <button
                  key={p}
                  onClick={() => { setPortalFilter(p); setShowPortalMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-50 transition-colors ${portalFilter === p ? 'text-navy-700 font-medium' : 'text-slate-700'}`}
                >
                  {p === 'All' ? 'All Portals' : p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-slate-200">
        {FILTER_TABS.map(tab => {
          const count = tab.id === 'all'
            ? REVIEW_ITEMS.length
            : REVIEW_ITEMS.filter(i => i.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-navy-600 text-navy-700 bg-navy-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id ? 'bg-navy-200 text-navy-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Showing <span className="font-semibold text-navy-800">{filtered.length}</span> items</span>
        {(search || portalFilter !== 'All') && (
          <button
            onClick={() => { setSearch(''); setPortalFilter('All'); }}
            className="text-navy-600 hover:text-navy-800 font-medium text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No items found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <ReviewCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}

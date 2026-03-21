import React, { useState } from 'react';
import {
  Map, Layers, Package, ChevronRight, ChevronDown,
  CheckCircle, AlertCircle, Clock, Box, Shield,
  Database, CreditCard, HardDrive, Globe, Lock,
  Code2, Layout, Zap, Users, FileText, BarChart3,
  Circle,
} from 'lucide-react';

// ─── Route Map ─────────────────────────────────────────────────────────────────
const ROUTE_TREE = [
  {
    label: 'Public',
    icon: Globe,
    color: 'text-slate-500',
    children: [
      { label: '/ — Home' },
      { label: '/about — About' },
      { label: '/manifesto — Manifesto' },
      { label: '/membership — Membership' },
      { label: '/programs — Programs' },
      { label: '/governance — Governance' },
      { label: '/contact — Contact' },
      { label: '/donate — Donate' },
      { label: '/events — Events' },
      { label: '/resources — Resources' },
      { label: '/privacy — Privacy Policy' },
      { label: '/terms — Terms of Service' },
      { label: '/disclosures — Disclosures' },
    ],
  },
  {
    label: 'Auth',
    icon: Lock,
    color: 'text-amber-500',
    children: [
      { label: '/login — Login' },
      { label: '/auth/callback — OAuth Callback' },
    ],
  },
  {
    label: 'Leonard Portal',
    icon: Shield,
    color: 'text-indigo-500',
    children: [
      { label: '/portal/leonard — Dashboard' },
      { label: '/portal/leonard/clients — Clients' },
      { label: '/portal/leonard/clients/:id — Client Detail' },
      { label: '/portal/leonard/portfolio — Portfolio' },
      { label: '/portal/leonard/portfolio/digital-assets' },
      { label: '/portal/leonard/portfolio/crypto' },
      { label: '/portal/leonard/portfolio/real-estate' },
      { label: '/portal/leonard/real-estate — Real Estate' },
      { label: '/portal/leonard/real-estate/:id' },
      { label: '/portal/leonard/security — Security' },
      { label: '/portal/leonard/security/incidents' },
      { label: '/portal/leonard/security/assets' },
      { label: '/portal/leonard/reports — Reports' },
      { label: '/portal/leonard/settings — Settings' },
    ],
  },
  {
    label: 'Victoria Portal',
    icon: Users,
    color: 'text-purple-500',
    children: [
      { label: '/portal/victoria — Dashboard' },
      { label: '/portal/victoria/meetings — Meetings' },
      { label: '/portal/victoria/resolutions — Resolutions' },
      { label: '/portal/victoria/committees — Committees' },
      { label: '/portal/victoria/documents — Documents' },
      { label: '/portal/victoria/settings — Settings' },
    ],
  },
  {
    label: 'Bernard Portal',
    icon: BarChart3,
    color: 'text-teal-500',
    children: [
      { label: '/portal/bernard — Dashboard' },
      { label: '/portal/bernard/programs — Programs' },
      { label: '/portal/bernard/events — Events' },
      { label: '/portal/bernard/members — Members' },
      { label: '/portal/bernard/settings — Settings' },
    ],
  },
  {
    label: 'Developer',
    icon: Code2,
    color: 'text-slate-600',
    children: [
      { label: '/portal/developer — Developer Portal' },
    ],
  },
  {
    label: 'Shared',
    icon: Layers,
    color: 'text-navy-500',
    children: [
      { label: '/portal/shared/repository — Central Repository' },
      { label: '/portal/shared/live-preview — Live Preview' },
      { label: '/portal/shared/live-structure — Live Structure' },
      { label: '/portal/shared/live-status — Live Status' },
      { label: '/portal/shared/review-center — Review Center' },
      { label: '/portal/shared/command-overview — Command Overview' },
    ],
  },
];

// ─── Module Registry ────────────────────────────────────────────────────────────
const MODULES = [
  { name: 'Auth',       version: 'v2.1.0', status: 'operational', deps: ['Supabase', 'JWT'], health: 'green', desc: 'Authentication and session management' },
  { name: 'Portals',    version: 'v3.0.0', status: 'operational', deps: ['React Router', 'Auth'], health: 'green', desc: 'Role-gated portal routing and layouts' },
  { name: 'Repository', version: 'v1.2.0', status: 'operational', deps: ['Supabase Storage'], health: 'green', desc: 'Document and asset management system' },
  { name: 'Preview',    version: 'v1.0.1', status: 'operational', deps: ['CI/CD Pipeline'], health: 'green', desc: 'Live environment preview and deploy tracking' },
  { name: 'API',        version: 'v2.3.0', status: 'operational', deps: ['Supabase', 'Edge Fns'], health: 'green', desc: 'REST and edge function API layer' },
  { name: 'Database',   version: 'v15.3',  status: 'operational', deps: ['PostgreSQL'], health: 'green', desc: 'Relational data layer via Supabase' },
  { name: 'Storage',    version: 'v1.1.0', status: 'operational', deps: ['Supabase Storage', 'CDN'], health: 'green', desc: 'File and media storage buckets' },
  { name: 'Payments',   version: 'v5.2.1', status: 'degraded',    deps: ['Stripe', 'Webhooks'], health: 'amber', desc: 'Stripe integration for donations and memberships' },
];

// ─── Component Library ──────────────────────────────────────────────────────────
const COMPONENTS = [
  { name: 'Navbar',           status: 'stable',     cat: 'Layout' },
  { name: 'Footer',           status: 'stable',     cat: 'Layout' },
  { name: 'WorkspaceSidebar', status: 'stable',     cat: 'Layout' },
  { name: 'LeonardLayout',    status: 'stable',     cat: 'Layout' },
  { name: 'VictoriaLayout',   status: 'stable',     cat: 'Layout' },
  { name: 'BernardLayout',    status: 'stable',     cat: 'Layout' },
  { name: 'ProtectedRoute',   status: 'stable',     cat: 'Guards' },
  { name: 'LeonardGuard',     status: 'stable',     cat: 'Guards' },
  { name: 'VictoriaGuard',    status: 'stable',     cat: 'Guards' },
  { name: 'BernardGuard',     status: 'stable',     cat: 'Guards' },
  { name: 'AuthContext',      status: 'stable',     cat: 'Context' },
  { name: 'queryClient',      status: 'stable',     cat: 'Data' },
  { name: 'DataTable',        status: 'beta',       cat: 'UI' },
  { name: 'StatCard',         status: 'stable',     cat: 'UI' },
  { name: 'StatusBadge',      status: 'stable',     cat: 'UI' },
  { name: 'ActivityFeed',     status: 'beta',       cat: 'UI' },
  { name: 'MapViewer',        status: 'deprecated', cat: 'UI' },
  { name: 'ChartBlock',       status: 'beta',       cat: 'Charts' },
];

function StatusDot({ health }) {
  const map = { green: 'bg-green-500', amber: 'bg-amber-400', red: 'bg-red-500' };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[health] || 'bg-slate-300'}`} />;
}

function CompStatusBadge({ status }) {
  const map = {
    stable:     'bg-green-100 text-green-700 border-green-200',
    beta:       'bg-amber-100 text-amber-700 border-amber-200',
    deprecated: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {status}
    </span>
  );
}

function RouteTreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon;
  const indent = depth * 16;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${depth === 0 ? 'font-semibold' : 'text-sm'}`}
        style={{ paddingLeft: `${12 + indent}px` }}
        onClick={() => hasChildren && setOpen(v => !v)}
      >
        {hasChildren ? (
          open
            ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            : <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}
        {Icon && <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${node.color || 'text-slate-400'}`} />}
        <span className={`text-sm ${depth === 0 ? 'text-navy-900 font-semibold' : 'text-slate-600 font-mono'}`}>
          {node.label}
        </span>
        {hasChildren && (
          <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
            {node.children.length}
          </span>
        )}
      </div>
      {open && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <RouteTreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LiveStructure() {
  const [activeSection, setActiveSection] = useState('routes');

  const sections = [
    { id: 'routes',     label: 'Route Map',        icon: Map },
    { id: 'modules',    label: 'Module Registry',   icon: Package },
    { id: 'components', label: 'Component Library', icon: Layout },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Live Structure</h1>
        <p className="text-slate-500 text-sm mt-1">Application Architecture Overview</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {sections.map(sec => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors -mb-px ${
                activeSection === sec.id
                  ? 'border-navy-600 text-navy-700 bg-navy-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" /> {sec.label}
            </button>
          );
        })}
      </div>

      {/* Route Map */}
      {activeSection === 'routes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ROUTE_TREE.map((node, i) => {
            const Icon = node.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className={`flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50`}>
                  <Icon className={`w-4 h-4 ${node.color}`} />
                  <span className="text-sm font-semibold text-navy-900">{node.label}</span>
                  <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {node.children.length} routes
                  </span>
                </div>
                <div className="py-2">
                  {node.children.map((child, j) => (
                    <div key={j} className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 transition-colors">
                      <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                      <code className="text-xs text-slate-600 font-mono truncate">{child.label}</code>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Module Registry */}
      {activeSection === 'modules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map(mod => (
            <div key={mod.name} className={`bg-white border rounded-xl p-4 hover:shadow-sm transition-all ${
              mod.health === 'amber' ? 'border-amber-200' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-navy-50 rounded-lg">
                  <Box className="w-4 h-4 text-navy-600" />
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot health={mod.health} />
                  <span className="text-xs text-slate-500 capitalize">{mod.status}</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-navy-900 mb-0.5">{mod.name}</h3>
              <p className="text-xs text-slate-400 font-mono mb-2">{mod.version}</p>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{mod.desc}</p>
              <div className="flex flex-wrap gap-1">
                {mod.deps.map(dep => (
                  <span key={dep} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{dep}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Component Library */}
      {activeSection === 'components' && (
        <div>
          {['Layout', 'Guards', 'Context', 'Data', 'UI', 'Charts'].map(cat => {
            const catComponents = COMPONENTS.filter(c => c.cat === cat);
            if (!catComponents.length) return null;
            return (
              <div key={cat} className="mb-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{cat}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {catComponents.map(comp => (
                    <div
                      key={comp.name}
                      className={`bg-white border rounded-xl p-3 hover:shadow-sm transition-all flex flex-col gap-2 ${
                        comp.status === 'deprecated' ? 'border-red-200 opacity-60' :
                        comp.status === 'beta' ? 'border-amber-200' : 'border-slate-200'
                      }`}
                    >
                      <div className="p-1.5 bg-navy-50 rounded-lg w-fit">
                        <Layout className="w-3 h-3 text-navy-500" />
                      </div>
                      <p className="text-xs font-semibold text-navy-900 font-mono leading-tight">{comp.name}</p>
                      <CompStatusBadge status={comp.status} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        {[
          { label: 'Total Routes',    value: ROUTE_TREE.reduce((s, n) => s + n.children.length, 0) + ROUTE_TREE.length, icon: Map },
          { label: 'Active Modules',  value: MODULES.filter(m => m.status === 'operational').length + '/' + MODULES.length, icon: Package },
          { label: 'Components',      value: COMPONENTS.filter(c => c.status === 'stable').length + ' stable', icon: Layout },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-navy-50 rounded-lg">
                <Icon className="w-4 h-4 text-navy-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

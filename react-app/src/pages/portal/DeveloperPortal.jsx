import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, Building2, Plus, Trash2, ShieldCheck, Loader2,
  AlertCircle, CheckCircle, XCircle, Clock, Activity,
  Terminal, Settings, GitBranch, Globe, ExternalLink,
  BarChart3, Zap, Database, Server, Wifi, Lock, Copy,
  ChevronRight, RefreshCw, SkipForward,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const upsertUserSchema = z.object({
  id: z.string().uuid('Must be a valid UUID'),
  email: z.string().email('Valid email required'),
  full_name: z.string().optional(),
  global_role: z.enum(['member', 'legal', 'operations', 'admin', 'developer', 'super_admin']),
});

const assignSchema = z.object({
  user_id: z.string().uuid('Must be a valid UUID'),
  workspace_slug: z.string().min(1, 'Workspace slug required'),
  workspace_role: z.enum(['owner', 'editor', 'viewer', 'legal_reviewer']),
});

// ─── Seeded Data ──────────────────────────────────────────────────────────────

const SEED_SERVICES = [
  { name: 'Web App',         uptime: 99.98, status: 'Operational', icon: Globe,    url: 'https://app.example.com'     },
  { name: 'API Server',      uptime: 99.95, status: 'Operational', icon: Server,   url: null                          },
  { name: 'Database',        uptime: 100.0, status: 'Operational', icon: Database, url: null                          },
  { name: 'Auth Service',    uptime: 99.99, status: 'Operational', icon: Lock,     url: null                          },
  { name: 'File Storage',    uptime: 99.90, status: 'Operational', icon: Database, url: null                          },
  { name: 'Email Service',   uptime: 98.70, status: 'Degraded',    icon: Wifi,     url: null                          },
  { name: 'CDN / Assets',    uptime: 99.98, status: 'Operational', icon: Zap,      url: null                          },
  { name: 'Background Jobs', uptime: 99.85, status: 'Operational', icon: Activity, url: null                          },
];

const SEED_BUILD_LOG = [
  { id: 1,  sha: 'a3f8c12', branch: 'main',           author: 'Leonard',   message: 'feat: upgrade all portal dashboards with seeded data',          status: 'success', duration: '2m 14s', time: 'Today, 10:32 AM'    },
  { id: 2,  sha: 'b9e2d77', branch: 'main',           author: 'Victoria',  message: 'fix: operations dashboard KPI alignment on mobile',             status: 'success', duration: '1m 58s', time: 'Today, 9:14 AM'     },
  { id: 3,  sha: 'c1a4e55', branch: 'feature/govern', author: 'Bernard',   message: 'feat: bernard governance documents list and escalation flags',   status: 'success', duration: '2m 03s', time: 'Yesterday, 4:45 PM' },
  { id: 4,  sha: 'd6f7b30', branch: 'feature/govern', author: 'Bernard',   message: 'chore: update tailwind config for navy palette extensions',      status: 'success', duration: '1m 44s', time: 'Yesterday, 3:20 PM' },
  { id: 5,  sha: 'e8c3a91', branch: 'hotfix/sec',     author: 'Leonard',   message: 'fix: security scan false positive — adjust threshold',          status: 'failed',  duration: '0m 32s', time: 'Yesterday, 1:05 PM' },
  { id: 6,  sha: 'f2b5d48', branch: 'main',           author: 'Developer', message: 'chore: dependency updates — react-router, lucide-react',         status: 'success', duration: '3m 11s', time: '2 days ago, 2:30 PM'},
  { id: 7,  sha: 'g4e1c22', branch: 'main',           author: 'Developer', message: 'feat: developer portal tab navigation and build log tab',        status: 'success', duration: '2m 28s', time: '2 days ago, 11:00 AM'},
  { id: 8,  sha: 'h7d9f61', branch: 'staging',        author: 'Victoria',  message: 'test: victoria meeting and resolution page layout',              status: 'skipped', duration: '—',      time: '3 days ago, 5:15 PM' },
  { id: 9,  sha: 'i0a6b83', branch: 'main',           author: 'Leonard',   message: 'feat: portfolio page — asset allocation and performance chart',   status: 'success', duration: '2m 52s', time: '3 days ago, 10:45 AM'},
  { id: 10, sha: 'j3c2e50', branch: 'feature/clients',author: 'Leonard',   message: 'feat: client management — add, edit, tier assignment',           status: 'success', duration: '1m 37s', time: '4 days ago, 3:00 PM' },
  { id: 11, sha: 'k5f8d17', branch: 'main',           author: 'Developer', message: 'refactor: extract KpiCard into shared components',               status: 'success', duration: '1m 22s', time: '4 days ago, 12:30 PM'},
  { id: 12, sha: 'l1b4a94', branch: 'hotfix/db',      author: 'Developer', message: 'fix: supabase RLS policy blocking member read access',           status: 'success', duration: '0m 48s', time: '5 days ago, 4:00 PM' },
  { id: 13, sha: 'm8e7c63', branch: 'main',           author: 'Bernard',   message: 'feat: governance hub initial scaffold with document categories',  status: 'success', duration: '2m 05s', time: '5 days ago, 11:15 AM'},
  { id: 14, sha: 'n2d0f30', branch: 'main',           author: 'Developer', message: 'chore: set up Vite env config and API base URL injection',        status: 'failed',  duration: '0m 17s', time: '6 days ago, 2:45 PM' },
  { id: 15, sha: 'o6a3b07', branch: 'main',           author: 'Developer', message: 'init: project scaffold — React 18, Tailwind, react-router-dom',  status: 'success', duration: '4m 01s', time: '1 week ago'           },
];

const SEED_ENV_VARS = [
  { key: 'VITE_SUPABASE_URL',      value: 'https://xxxxx.supabase.co', masked: true,  status: 'set' },
  { key: 'VITE_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIs…',   masked: true,  status: 'set' },
  { key: 'VITE_API_URL',           value: 'https://api.example.com',  masked: false, status: 'set' },
  { key: 'STRIPE_PUBLISHABLE_KEY', value: 'pk_live_xxxxxxxxxxxxx…',   masked: true,  status: 'set' },
  { key: 'VITE_APP_ENV',           value: 'production',               masked: false, status: 'set' },
  { key: 'VITE_SENTRY_DSN',        value: 'https://xxxx@sentry.io/…', masked: true,  status: 'set' },
];

const SEED_FEATURE_FLAGS = [
  { key: 'leonard_portal',   label: 'Leonard Portal',    enabled: true  },
  { key: 'victoria_portal',  label: 'Victoria Portal',   enabled: true  },
  { key: 'bernard_portal',   label: 'Bernard Portal',    enabled: true  },
  { key: 'developer_portal', label: 'Developer Portal',  enabled: true  },
  { key: 'live_sync',        label: 'Live Data Sync',     enabled: true  },
  { key: 'file_uploads',     label: 'File Uploads',       enabled: true  },
  { key: 'email_service',    label: 'Email Service',      enabled: false },
  { key: 'stripe_payments',  label: 'Stripe Payments',    enabled: true  },
];

const QUICK_LINKS = [
  { label: 'Live Preview',    url: '/',                        icon: Globe      },
  { label: 'Live Structure',  url: '/portal/developer',        icon: BarChart3  },
  { label: 'Live Status',     url: '/portal/developer',        icon: Activity   },
  { label: 'Central Repository',      url: 'https://github.com',       icon: GitBranch  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={18} className="text-navy-600" />
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
    </div>
  );
}

function UserRow({ user, onRevoke }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium text-navy-900 text-sm">{user.email}</p>
        {user.full_name && <p className="text-xs text-gray-400">{user.full_name}</p>}
      </td>
      <td className="px-4 py-3 text-sm capitalize text-gray-600">{user.global_role}</td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {user.memberships?.length
          ? user.memberships.map((m) => (
              <span
                key={m.workspace_id}
                className="inline-flex items-center gap-1 mr-2 px-2 py-0.5 bg-navy-50 text-navy-700 rounded text-xs"
              >
                {m.workspace_slug}
                <button
                  title="Revoke access"
                  onClick={() => onRevoke(m)}
                  className="ml-0.5 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={10} />
                </button>
              </span>
            ))
          : '—'}
      </td>
    </tr>
  );
}

function BuildStatusBadge({ status }) {
  if (status === 'success') return (
    <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
      <CheckCircle size={10} /> Success
    </span>
  );
  if (status === 'failed') return (
    <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
      <XCircle size={10} /> Failed
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-semibold">
      <SkipForward size={10} /> Skipped
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DeveloperPortal() {
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [formError, setFormError] = useState(null);
  const [assignError, setAssignError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  if (!hasRole('developer') && !hasRole('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-400 mb-3" />
          <p className="text-gray-700 font-medium">Access Denied</p>
          <p className="text-gray-400 text-sm mt-1">Developer or Super Admin role required.</p>
        </div>
      </div>
    );
  }

  // ─── Data fetching ─────────────────────────────────────────────────────────

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['dev', 'users'],
    queryFn: async () => {
      const { data } = await api.get('/api/workspaces/users');
      return data.users;
    },
  });

  const { data: workspacesData, isLoading: wsLoading } = useQuery({
    queryKey: ['workspaces', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/api/workspaces/mine');
      return data.workspaces;
    },
  });

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const upsertUser = useMutation({
    mutationFn: (body) => api.post('/api/workspaces/users', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dev', 'users'] });
      resetUser();
      setFormError(null);
    },
    onError: (err) => setFormError(err.response?.data?.error || 'Failed to save user.'),
  });

  const assignMembership = useMutation({
    mutationFn: (body) => api.post('/api/workspaces/assign', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dev', 'users'] });
      resetAssign();
      setAssignError(null);
    },
    onError: (err) => setAssignError(err.response?.data?.error || 'Failed to assign workspace.'),
  });

  const revokeMembership = useMutation({
    mutationFn: ({ membershipId }) => api.delete(`/api/workspaces/assign/${membershipId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dev', 'users'] }),
  });

  // ─── Forms ─────────────────────────────────────────────────────────────────

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    reset: resetUser,
    formState: { errors: userErrors },
  } = useForm({ resolver: zodResolver(upsertUserSchema) });

  const {
    register: registerAssign,
    handleSubmit: handleSubmitAssign,
    reset: resetAssign,
    formState: { errors: assignErrors },
  } = useForm({ resolver: zodResolver(assignSchema) });

  const onUpsertUser = (data) => upsertUser.mutate(data);
  const onAssign = (data) => assignMembership.mutate(data);

  const handleRevoke = (membership) => {
    if (window.confirm(`Revoke access to ${membership.workspace_slug}?`)) {
      revokeMembership.mutate({ membershipId: membership.membership_id });
    }
  };

  const handleCopyKey = (key) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const TABS = [
    { key: 'overview',   label: 'Overview',      icon: BarChart3   },
    { key: 'users',      label: 'Users',          icon: Users       },
    { key: 'workspaces', label: 'Workspaces',     icon: Building2   },
    { key: 'assign',     label: 'Assign Access',  icon: Plus        },
    { key: 'buildlog',   label: 'Build Log',      icon: Terminal    },
    { key: 'config',     label: 'Config',         icon: Settings    },
  ];

  const allServicesUp = SEED_SERVICES.every((s) => s.status === 'Operational');
  const degradedCount = SEED_SERVICES.filter((s) => s.status === 'Degraded').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
              <span className="text-gray-500 font-medium">Portal</span>
              <ChevronRight size={12} />
              <span className="text-navy-700 font-semibold">Developer Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Developer Portal — Technical Command</h1>
            <p className="text-sm text-gray-500 mt-1">Infrastructure management, system status, and technical governance.</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            allServicesUp
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <Activity size={14} className={allServicesUp ? 'text-green-600' : 'text-amber-500'} />
            <span className={`text-xs font-semibold ${allServicesUp ? 'text-green-700' : 'text-amber-700'}`}>
              {allServicesUp ? 'All Systems Operational' : `${degradedCount} Service Degraded`}
            </span>
          </div>
        </div>

        {/* ── Tab Bar ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-7 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === key
                  ? 'bg-navy-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ───────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* System Status Grid */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionHeader icon={Activity} title="System Status" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SEED_SERVICES.map((svc) => {
                  const Icon = svc.icon;
                  const isOp = svc.status === 'Operational';
                  return (
                    <div
                      key={svc.name}
                      className={`rounded-lg border p-3 ${isOp ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={14} className={isOp ? 'text-green-600' : 'text-amber-600'} />
                        <span className="text-xs font-medium text-gray-800">{svc.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isOp ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {svc.status}
                        </span>
                        <span className="text-[10px] text-gray-500">{svc.uptime}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Build Overview + Quick Links */}
            <div className="grid lg:grid-cols-2 gap-4">

              {/* Latest Build Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionHeader icon={GitBranch} title="Latest Deployment" />
                {(() => {
                  const latest = SEED_BUILD_LOG[0];
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <BuildStatusBadge status={latest.status} />
                        <span className="text-xs text-gray-500 font-mono">#{latest.sha}</span>
                        <span className="text-xs text-gray-400">· {latest.time}</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium">{latest.message}</p>
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-[11px] text-gray-400">Branch</p>
                          <p className="text-xs font-semibold text-navy-800">{latest.branch}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Author</p>
                          <p className="text-xs font-semibold text-navy-800">{latest.author}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Duration</p>
                          <p className="text-xs font-semibold text-navy-800">{latest.duration}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-[11px] text-gray-400 mb-1.5">Recent builds (last 5)</p>
                        <div className="space-y-1.5">
                          {SEED_BUILD_LOG.slice(0, 5).map((b) => (
                            <div key={b.id} className="flex items-center gap-2 text-xs">
                              <BuildStatusBadge status={b.status} />
                              <span className="font-mono text-gray-500">{b.sha}</span>
                              <span className="text-gray-600 truncate flex-1">{b.message.slice(0, 50)}…</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <SectionHeader icon={ExternalLink} title="Quick Links" />
                <div className="grid grid-cols-2 gap-3">
                  {QUICK_LINKS.map(({ label, url, icon: Icon }) => (
                    <a
                      key={label}
                      href={url}
                      target={url.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-navy-400 hover:bg-navy-50 transition-all text-sm font-medium text-gray-700 hover:text-navy-800"
                    >
                      <Icon size={15} className="text-navy-600" />
                      {label}
                      {url.startsWith('http') && <ExternalLink size={10} className="ml-auto text-gray-400" />}
                    </a>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">Environment</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Environment</span>
                      <span className="font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">Production</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Node Version</span>
                      <span className="font-mono text-gray-700">20.11.0</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Framework</span>
                      <span className="font-mono text-gray-700">Vite + React 18</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Last Deploy</span>
                      <span className="text-gray-700">Today, 10:32 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Users ──────────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <SectionHeader icon={Users} title="All Users" />

            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin h-6 w-6 text-navy-500" />
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">User</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Global Role</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Workspace Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersData?.map((user) => (
                      <UserRow key={user.id} user={user} onRevoke={handleRevoke} />
                    ))}
                    {!usersData?.length && (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-navy-900 mb-4 text-sm">Create / Update User Profile</h3>
              <form onSubmit={handleSubmitUser(onUpsertUser)} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Auth UUID *</label>
                  <input
                    {...registerUser('id')}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {userErrors.id && <p className="text-red-500 text-xs mt-1">{userErrors.id.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input
                    {...registerUser('email')}
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {userErrors.email && <p className="text-red-500 text-xs mt-1">{userErrors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    {...registerUser('full_name')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Global Role *</label>
                  <select
                    {...registerUser('global_role')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {['member', 'legal', 'operations', 'admin', 'developer', 'super_admin'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  {formError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
                      <AlertCircle size={14} />
                      {formError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={upsertUser.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {upsertUser.isPending && <Loader2 size={14} className="animate-spin" />}
                    Save User Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Tab: Workspaces ─────────────────────────────────────────── */}
        {activeTab === 'workspaces' && (
          <div>
            <SectionHeader icon={Building2} title="All Workspaces" />
            {wsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-6 w-6 text-navy-500" />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {workspacesData?.map((ws) => (
                  <div key={ws.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm">
                    <p className="font-semibold text-navy-900">{ws.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">slug: {ws.slug}</p>
                    <p className="text-xs text-gray-400 capitalize">{ws.workspace_type} · {ws.status}</p>
                  </div>
                ))}
                {!workspacesData?.length && (
                  <div className="col-span-3 text-center py-12 text-gray-400 text-sm">No workspaces found.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Assign Access ──────────────────────────────────────── */}
        {activeTab === 'assign' && (
          <div>
            <SectionHeader icon={Plus} title="Assign Workspace Access" />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-lg">
              <form onSubmit={handleSubmitAssign(onAssign)} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">User Auth UUID *</label>
                  <input
                    {...registerAssign('user_id')}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  />
                  {assignErrors.user_id && <p className="text-red-500 text-xs mt-1">{assignErrors.user_id.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Workspace Slug *</label>
                  <select
                    {...registerAssign('workspace_slug')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    <option value="">Select workspace…</option>
                    {workspacesData?.map((ws) => (
                      <option key={ws.id} value={ws.slug}>{ws.name} ({ws.slug})</option>
                    ))}
                  </select>
                  {assignErrors.workspace_slug && <p className="text-red-500 text-xs mt-1">{assignErrors.workspace_slug.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Workspace Role *</label>
                  <select
                    {...registerAssign('workspace_role')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                  >
                    {['owner', 'editor', 'viewer', 'legal_reviewer'].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                {assignError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {assignError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={assignMembership.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {assignMembership.isPending && <Loader2 size={14} className="animate-spin" />}
                  Assign Access
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Tab: Build Log ──────────────────────────────────────────── */}
        {activeTab === 'buildlog' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader icon={Terminal} title="Build History" />
              <span className="text-xs text-gray-400">{SEED_BUILD_LOG.length} deploys</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Commit</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Message</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Author</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Duration</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SEED_BUILD_LOG.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <BuildStatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-navy-700 bg-navy-50 px-1.5 py-0.5 rounded">{b.sha}</span>
                        <span className="ml-1.5 text-gray-400 text-[10px]">{b.branch}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell max-w-xs truncate">{b.message}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{b.author}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell font-mono">{b.duration}</td>
                      <td className="px-4 py-3 text-gray-400">{b.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Config ─────────────────────────────────────────────── */}
        {activeTab === 'config' && (
          <div className="space-y-6">

            {/* Environment Variables */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionHeader icon={Settings} title="Environment Variables" />
              <div className="space-y-2">
                {SEED_ENV_VARS.map((envVar) => (
                  <div
                    key={envVar.key}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono font-semibold text-navy-800">{envVar.key}</p>
                      <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                        {envVar.masked ? '●●●●●●●●●●●●●●●●' : envVar.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                        {envVar.status}
                      </span>
                      <button
                        onClick={() => handleCopyKey(envVar.key)}
                        className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-400 hover:text-gray-700"
                        title="Copy key name"
                      >
                        {copiedKey === envVar.key
                          ? <CheckCircle size={13} className="text-green-500" />
                          : <Copy size={13} />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <SectionHeader icon={Zap} title="Feature Flags" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100">
                    <tr>
                      <th className="text-left py-2 px-2 text-gray-500 text-xs font-medium">Feature</th>
                      <th className="text-left py-2 px-2 text-gray-500 text-xs font-medium">Key</th>
                      <th className="text-left py-2 px-2 text-gray-500 text-xs font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SEED_FEATURE_FLAGS.map((flag) => (
                      <tr key={flag.key} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 px-2 font-medium text-gray-800">{flag.label}</td>
                        <td className="py-2.5 px-2 font-mono text-xs text-gray-500">{flag.key}</td>
                        <td className="py-2.5 px-2">
                          {flag.enabled ? (
                            <span className="flex items-center gap-1 text-green-700 text-xs font-semibold">
                              <CheckCircle size={12} /> Enabled
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                              <XCircle size={12} /> Disabled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

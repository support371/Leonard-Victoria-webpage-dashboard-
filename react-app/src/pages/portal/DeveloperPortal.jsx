import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Building2,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  AlertCircle,
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={20} className="text-navy-600" />
      <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DeveloperPortal() {
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('users');
  const [formError, setFormError] = useState(null);
  const [assignError, setAssignError] = useState(null);

  // Only developer / super_admin can access this portal
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

  // ─── Data fetching ───────────────────────────────────────────────────────────

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

  // ─── Mutations ───────────────────────────────────────────────────────────────

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

  // ─── Forms ───────────────────────────────────────────────────────────────────

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

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-900">Developer / Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage users, workspace access, and provisioning.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-8">
          {[
            { key: 'users', label: 'Users', icon: Users },
            { key: 'workspaces', label: 'Workspaces', icon: Building2 },
            { key: 'assign', label: 'Assign Access', icon: Plus },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-navy-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Users */}
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

            {/* Upsert user form */}
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

        {/* Tab: Workspaces */}
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
                  <div
                    key={ws.id}
                    className="bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm"
                  >
                    <p className="font-semibold text-navy-900">{ws.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">slug: {ws.slug}</p>
                    <p className="text-xs text-gray-400 capitalize">{ws.workspace_type} · {ws.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Assign Access */}
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
      </div>
    </div>
  );
}

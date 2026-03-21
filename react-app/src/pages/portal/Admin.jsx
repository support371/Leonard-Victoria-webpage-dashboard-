import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { apiClient } from '../../lib/api';

function ApplicationRow({ app, onApprove, onReject, isActing }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-4 text-sm font-medium text-gray-900">
        {app.first_name} {app.last_name}
      </td>
      <td className="px-5 py-4 text-sm text-gray-500">{app.email}</td>
      <td className="px-5 py-4">
        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
          {app.membership_tier}
        </span>
      </td>
      <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">
        {app.motivation}
      </td>
      <td className="px-5 py-4 text-sm text-gray-400">
        {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
      </td>
      <td className="px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onApprove(app.id)}
            disabled={isActing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 disabled:opacity-50 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            onClick={() => onReject(app.id)}
            disabled={isActing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Admin() {
  const qc = useQueryClient();
  const [actingId, setActingId] = useState(null);

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['pending-applications'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/applications?status=pending');
      return res.data;
    },
  });

  const { data: auditData } = useQuery({
    queryKey: ['audit-log'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/audit-log');
      return res.data;
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await apiClient.post(`/admin/applications/${id}/${action}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pending-applications'] });
      qc.invalidateQueries({ queryKey: ['audit-log'] });
      setActingId(null);
    },
    onError: () => setActingId(null),
  });

  const handleApprove = (id) => {
    setActingId(id);
    actionMutation.mutate({ id, action: 'approve' });
  };

  const handleReject = (id) => {
    setActingId(id);
    actionMutation.mutate({ id, action: 'reject' });
  };

  const applications = applicationsData?.applications ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Review applications and audit activity</p>
      </div>

      {/* Pending Applications */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-gray-900">Pending Applications</h2>
          {applications.length > 0 && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              {applications.length}
            </span>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-10 h-10 text-green-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No pending applications.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Motivation</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <ApplicationRow
                      key={app.id}
                      app={app}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isActing={actingId === app.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Audit Log */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4">Recent Audit Log</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {!auditData?.logs?.length ? (
            <div className="p-8 text-center text-gray-400 text-sm">No audit entries yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {auditData.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm">
                      <span className="font-mono text-xs text-navy-700 bg-navy-50 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{log.actor_email || log.actor_id}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{log.resource_type} #{log.resource_id}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

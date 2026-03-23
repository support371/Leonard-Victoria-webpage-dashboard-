import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

/**
 * Returns the list of workspaces the authenticated user can access.
 * Super_admin / developer see all active workspaces.
 * Other roles see only their assigned workspaces.
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces', 'mine'],
    queryFn: async () => {
      const { data } = await api.get('/workspaces/mine');
      return data.workspaces;
    },
  });
}

/**
 * Returns workspace-scoped dashboard stats for a given slug.
 */
export function useWorkspaceDashboard(slug) {
  return useQuery({
    queryKey: ['workspace', slug, 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get(`/portal/${slug}/dashboard`);
      return data;
    },
    enabled: !!slug,
  });
}

/**
 * Returns workspace-scoped documents with signed download URLs.
 */
export function useWorkspaceDocuments(slug) {
  return useQuery({
    queryKey: ['workspace', slug, 'documents'],
    queryFn: async () => {
      const { data } = await api.get(`/portal/${slug}/documents`);
      return data.documents;
    },
    enabled: !!slug,
  });
}

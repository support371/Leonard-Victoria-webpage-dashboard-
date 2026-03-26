import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const BASE = '/portal/leonard';

// ── Dashboard ──────────────────────────────────────────────────────────────

export function useLeonardDashboard() {
  return useQuery({
    queryKey: ['leonard', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/dashboard`);
      return data;
    },
  });
}

// ── Clients ────────────────────────────────────────────────────────────────

export function useClients(filters = {}) {
  return useQuery({
    queryKey: ['leonard', 'clients', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/clients`, { params: filters });
      return data.clients;
    },
  });
}

export function useClient(id) {
  return useQuery({
    queryKey: ['leonard', 'clients', id],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/clients/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/clients`, body).then((r) => r.data.client),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leonard', 'clients'] }),
  });
}

export function useUpdateClient(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.put(`${BASE}/clients/${id}`, body).then((r) => r.data.client),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'clients'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'clients', id] });
    },
  });
}

// ── Portfolio ──────────────────────────────────────────────────────────────

export function usePortfolio() {
  return useQuery({
    queryKey: ['leonard', 'portfolio'],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/portfolio`);
      return data;
    },
  });
}

export function useHoldings(category, filters = {}) {
  const path =
    category === 'digital_asset' ? 'digital-assets' :
    category === 'crypto_asset'  ? 'crypto' : 'real-estate';
  return useQuery({
    queryKey: ['leonard', 'holdings', category, filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/portfolio/${path}`, { params: filters });
      return data.holdings;
    },
  });
}

export function useCreateHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/portfolio/holdings`, body).then((r) => r.data.holding),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'holdings'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'portfolio'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'dashboard'] });
    },
  });
}

export function useUpdateHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`${BASE}/portfolio/holdings/${id}`, body).then((r) => r.data.holding),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'holdings'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'portfolio'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'dashboard'] });
    },
  });
}

export function useDeleteHolding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${BASE}/portfolio/holdings/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'holdings'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'portfolio'] });
    },
  });
}

// ── Real Estate ────────────────────────────────────────────────────────────

export function useProperties(filters = {}) {
  return useQuery({
    queryKey: ['leonard', 'real-estate', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/real-estate`, { params: filters });
      return data.properties;
    },
  });
}

export function useProperty(id) {
  return useQuery({
    queryKey: ['leonard', 'real-estate', id],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/real-estate/${id}`);
      return data.property;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/real-estate`, body).then((r) => r.data.property),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'real-estate'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'dashboard'] });
    },
  });
}

export function useUpdateProperty(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.put(`${BASE}/real-estate/${id}`, body).then((r) => r.data.property),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'real-estate'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'real-estate', id] });
      qc.invalidateQueries({ queryKey: ['leonard', 'dashboard'] });
    },
  });
}

// ── Security ───────────────────────────────────────────────────────────────

export function useSecurityDashboard() {
  return useQuery({
    queryKey: ['leonard', 'security'],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/security`);
      return data;
    },
  });
}

export function useIncidents(filters = {}) {
  return useQuery({
    queryKey: ['leonard', 'incidents', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/security/incidents`, { params: filters });
      return data.incidents;
    },
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/security/incidents`, body).then((r) => r.data.incident),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'incidents'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'security'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'dashboard'] });
    },
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`${BASE}/security/incidents/${id}`, body).then((r) => r.data.incident),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'incidents'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'security'] });
    },
  });
}

export function useSecurityAssets(filters = {}) {
  return useQuery({
    queryKey: ['leonard', 'security-assets', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/security/assets`, { params: filters });
      return data.assets;
    },
  });
}

export function useCreateSecurityAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/security/assets`, body).then((r) => r.data.asset),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leonard', 'security-assets'] });
      qc.invalidateQueries({ queryKey: ['leonard', 'security'] });
    },
  });
}

export function useUpdateSecurityAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`${BASE}/security/assets/${id}`, body).then((r) => r.data.asset),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leonard', 'security-assets'] }),
  });
}

// ── Reports ────────────────────────────────────────────────────────────────

export function useReports() {
  return useQuery({
    queryKey: ['leonard', 'reports'],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/reports`);
      return data;
    },
  });
}

// ── Settings ───────────────────────────────────────────────────────────────

export function useLeonardSettings() {
  return useQuery({
    queryKey: ['leonard', 'settings'],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/settings`);
      return data;
    },
  });
}

export function useUpdateLeonardSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings) => api.put(`${BASE}/settings`, { settings }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leonard', 'settings'] }),
  });
}

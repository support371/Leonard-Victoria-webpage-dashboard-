import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const BASE = '/portal/bernard';

// Dashboard
export function useBernardDashboard() {
  return useQuery({
    queryKey: ['bernard', 'dashboard'],
    queryFn: async () => { const { data } = await api.get(`${BASE}/dashboard`); return data; },
  });
}

// Programs
export function usePrograms(filters = {}) {
  return useQuery({
    queryKey: ['bernard', 'programs', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/programs`, { params: filters });
      return data.programs;
    },
  });
}

export function useProgram(id) {
  return useQuery({
    queryKey: ['bernard', 'programs', id],
    queryFn: async () => { const { data } = await api.get(`${BASE}/programs/${id}`); return data; },
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/programs`, body).then((r) => r.data.program),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bernard', 'programs'] });
      qc.invalidateQueries({ queryKey: ['bernard', 'dashboard'] });
    },
  });
}

export function useUpdateProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`${BASE}/programs/${id}`, body).then((r) => r.data.program),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bernard', 'programs'] }),
  });
}

// Events
export function useBernardEvents(filters = {}) {
  return useQuery({
    queryKey: ['bernard', 'events', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/events`, { params: filters });
      return data.events;
    },
  });
}

export function useCreateBernardEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/events`, body).then((r) => r.data.event),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bernard', 'events'] });
      qc.invalidateQueries({ queryKey: ['bernard', 'dashboard'] });
    },
  });
}

export function useUpdateBernardEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`${BASE}/events/${id}`, body).then((r) => r.data.event),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bernard', 'events'] }),
  });
}

// Members
export function useBernardMembers(filters = {}) {
  return useQuery({
    queryKey: ['bernard', 'members', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/members`, { params: filters });
      return data.members;
    },
  });
}

// Settings
export function useBernardSettings() {
  return useQuery({
    queryKey: ['bernard', 'settings'],
    queryFn: async () => { const { data } = await api.get(`${BASE}/settings`); return data; },
  });
}

export function useUpdateBernardSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings) => api.put(`${BASE}/settings`, { settings }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bernard', 'settings'] }),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

const BASE = '/portal/victoria';

// Dashboard
export function useVictoriaDashboard() {
  return useQuery({
    queryKey: ['victoria', 'dashboard'],
    queryFn: async () => { const { data } = await api.get(`${BASE}/dashboard`); return data; },
  });
}

// Meetings
export function useMeetings(filters = {}) {
  return useQuery({
    queryKey: ['victoria', 'meetings', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/meetings`, { params: filters });
      return data.meetings;
    },
  });
}

export function useMeeting(id) {
  return useQuery({
    queryKey: ['victoria', 'meetings', id],
    queryFn: async () => { const { data } = await api.get(`${BASE}/meetings/${id}`); return data; },
    enabled: !!id,
  });
}

export function useCreateMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/meetings`, body).then((r) => r.data.meeting),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['victoria', 'meetings'] });
      qc.invalidateQueries({ queryKey: ['victoria', 'dashboard'] });
    },
  });
}

export function useUpdateMeeting(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.put(`${BASE}/meetings/${id}`, body).then((r) => r.data.meeting),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['victoria', 'meetings'] });
      qc.invalidateQueries({ queryKey: ['victoria', 'meetings', id] });
    },
  });
}

// Resolutions
export function useResolutions(filters = {}) {
  return useQuery({
    queryKey: ['victoria', 'resolutions', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/resolutions`, { params: filters });
      return data.resolutions;
    },
  });
}

export function useCreateResolution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/resolutions`, body).then((r) => r.data.resolution),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['victoria', 'resolutions'] });
      qc.invalidateQueries({ queryKey: ['victoria', 'dashboard'] });
    },
  });
}

export function useUpdateResolution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`${BASE}/resolutions/${id}`, body).then((r) => r.data.resolution),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['victoria', 'resolutions'] }),
  });
}

// Committees
export function useCommittees() {
  return useQuery({
    queryKey: ['victoria', 'committees'],
    queryFn: async () => { const { data } = await api.get(`${BASE}/committees`); return data.committees; },
  });
}

export function useCreateCommittee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => api.post(`${BASE}/committees`, body).then((r) => r.data.committee),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['victoria', 'committees'] }),
  });
}

export function useUpdateCommittee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => api.put(`${BASE}/committees/${id}`, body).then((r) => r.data.committee),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['victoria', 'committees'] }),
  });
}

// Documents
export function useVictoriaDocuments(filters = {}) {
  return useQuery({
    queryKey: ['victoria', 'documents', filters],
    queryFn: async () => {
      const { data } = await api.get(`${BASE}/documents`, { params: filters });
      return data.documents;
    },
  });
}

// Settings
export function useVictoriaSettings() {
  return useQuery({
    queryKey: ['victoria', 'settings'],
    queryFn: async () => { const { data } = await api.get(`${BASE}/settings`); return data; },
  });
}

export function useUpdateVictoriaSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings) => api.put(`${BASE}/settings`, { settings }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['victoria', 'settings'] }),
  });
}

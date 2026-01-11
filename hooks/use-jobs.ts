'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { Job, JobFormData, JobWithTKS, PaginationParams, ApiResponse } from '@/types';

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...jobKeys.lists(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export function useJobs(params?: PaginationParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<Job[]>('/admin/jobs', { params }),
  });
}

export function useJob(id: string, includeTks?: boolean) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: [...jobKeys.detail(id), { includeTks }],
    queryFn: () => fetchWithAuth<JobWithTKS>(`/admin/jobs/${id}`, { 
      params: { include_tks: includeTks } 
    }),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: JobFormData) => 
      fetchWithAuth<Job>('/admin/jobs', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobFormData> }) =>
      fetchWithAuth<Job>(`/admin/jobs/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/jobs/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

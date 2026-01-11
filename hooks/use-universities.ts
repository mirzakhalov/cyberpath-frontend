'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { University, UniversityFormData, PaginationParams } from '@/types';

export const universityKeys = {
  all: ['universities'] as const,
  lists: () => [...universityKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...universityKeys.lists(), params] as const,
  details: () => [...universityKeys.all, 'detail'] as const,
  detail: (id: string) => [...universityKeys.details(), id] as const,
};

export function useUniversities(params?: PaginationParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: universityKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<University[]>('/admin/universities', { params }),
  });
}

export function useUniversity(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: universityKeys.detail(id),
    queryFn: () => fetchWithAuth<University>(`/admin/universities/${id}`),
    enabled: !!id,
  });
}

export function useCreateUniversity() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: UniversityFormData) => 
      fetchWithAuth<University>('/admin/universities', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
  });
}

export function useUpdateUniversity() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UniversityFormData> }) =>
      fetchWithAuth<University>(`/admin/universities/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
      queryClient.invalidateQueries({ queryKey: universityKeys.detail(id) });
    },
  });
}

export function useDeleteUniversity() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/universities/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.lists() });
    },
  });
}

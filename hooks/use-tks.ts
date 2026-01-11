'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { TKS, TKSFormData, TKSCategory, PaginationParams } from '@/types';

export interface TKSListParams extends PaginationParams {
  category?: TKSCategory;
}

export const tksKeys = {
  all: ['tks'] as const,
  lists: () => [...tksKeys.all, 'list'] as const,
  list: (params?: TKSListParams) => [...tksKeys.lists(), params] as const,
  details: () => [...tksKeys.all, 'detail'] as const,
  detail: (id: string) => [...tksKeys.details(), id] as const,
};

export function useTKSList(params?: TKSListParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: tksKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<TKS[]>('/admin/tks', { params }),
  });
}

export function useTKS(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: tksKeys.detail(id),
    queryFn: () => fetchWithAuth<TKS>(`/admin/tks/${id}`),
    enabled: !!id,
  });
}

export function useCreateTKS() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: TKSFormData) => 
      fetchWithAuth<TKS>('/admin/tks', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tksKeys.lists() });
    },
  });
}

export function useUpdateTKS() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TKSFormData> }) =>
      fetchWithAuth<TKS>(`/admin/tks/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tksKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tksKeys.detail(id) });
    },
  });
}

export function useDeleteTKS() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/tks/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tksKeys.lists() });
    },
  });
}

export function useBulkImportTKS() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: TKSFormData[]) => 
      fetchWithAuth<{ imported: number; errors: string[] }>('/admin/tks/bulk', { 
        method: 'POST', 
        body: { items: data } 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tksKeys.lists() });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { Cluster, ClusterFormData, PaginationParams } from '@/types';

export const clusterKeys = {
  all: ['clusters'] as const,
  lists: () => [...clusterKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...clusterKeys.lists(), params] as const,
  details: () => [...clusterKeys.all, 'detail'] as const,
  detail: (id: string) => [...clusterKeys.details(), id] as const,
};

export function useClusters(params?: PaginationParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: clusterKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<Cluster[]>('/admin/clusters', { params }),
  });
}

export function useCluster(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: clusterKeys.detail(id),
    queryFn: () => fetchWithAuth<Cluster>(`/admin/clusters/${id}`),
    enabled: !!id,
  });
}

export function useCreateCluster() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: ClusterFormData) => 
      fetchWithAuth<Cluster>('/admin/clusters', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clusterKeys.lists() });
    },
  });
}

export function useUpdateCluster() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClusterFormData> }) =>
      fetchWithAuth<Cluster>(`/admin/clusters/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clusterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clusterKeys.detail(id) });
    },
  });
}

export function useDeleteCluster() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/clusters/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clusterKeys.lists() });
    },
  });
}

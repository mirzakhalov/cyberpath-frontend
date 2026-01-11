'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { Topic, TopicFormData, PaginationParams } from '@/types';

export const topicKeys = {
  all: ['topics'] as const,
  lists: () => [...topicKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...topicKeys.lists(), params] as const,
  details: () => [...topicKeys.all, 'detail'] as const,
  detail: (id: string) => [...topicKeys.details(), id] as const,
};

export function useTopics(params?: PaginationParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: topicKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<Topic[]>('/admin/topics', { params }),
  });
}

export function useTopic(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: () => fetchWithAuth<Topic>(`/admin/topics/${id}`),
    enabled: !!id,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: TopicFormData) => 
      fetchWithAuth<Topic>('/admin/topics', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TopicFormData> }) =>
      fetchWithAuth<Topic>(`/admin/topics/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: topicKeys.detail(id) });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/topics/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.lists() });
    },
  });
}

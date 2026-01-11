'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { SkillBitChallenge, SkillBitFormData, PaginationParams } from '@/types';
import { weekKeys } from './use-weeks';

export interface SkillBitListParams extends PaginationParams {
  course_id?: string;
  university_id?: string;
}

export const skillbitKeys = {
  all: ['skillbits'] as const,
  lists: () => [...skillbitKeys.all, 'list'] as const,
  list: (params?: SkillBitListParams) => [...skillbitKeys.lists(), params] as const,
  details: () => [...skillbitKeys.all, 'detail'] as const,
  detail: (id: string) => [...skillbitKeys.details(), id] as const,
};

export function useSkillBits(params?: SkillBitListParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: skillbitKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<SkillBitChallenge[]>('/admin/skillbits', { params }),
  });
}

export function useSkillBit(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: skillbitKeys.detail(id),
    queryFn: () => fetchWithAuth<SkillBitChallenge>(`/admin/skillbits/${id}`),
    enabled: !!id,
  });
}

export function useCreateSkillBit() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: SkillBitFormData) => 
      fetchWithAuth<SkillBitChallenge>('/admin/skillbits', { method: 'POST', body: data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: skillbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: weekKeys.detail(variables.course_week_id) });
    },
  });
}

export function useUpdateSkillBit() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillBitFormData> }) =>
      fetchWithAuth<SkillBitChallenge>(`/admin/skillbits/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: skillbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: skillbitKeys.detail(id) });
      if (data.course_week_id) {
        queryClient.invalidateQueries({ queryKey: weekKeys.detail(data.course_week_id) });
      }
    },
  });
}

export function useDeleteSkillBit() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/skillbits/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillbitKeys.lists() });
    },
  });
}

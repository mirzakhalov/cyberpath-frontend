'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { CareerDomain, CareerDomainFormData } from '@/types/career-domain';

export const careerDomainKeys = {
  all: ['career-domains'] as const,
  lists: () => [...careerDomainKeys.all, 'list'] as const,
  list: () => [...careerDomainKeys.lists()] as const,
  details: () => [...careerDomainKeys.all, 'detail'] as const,
  detail: (id: string) => [...careerDomainKeys.details(), id] as const,
};

// Public endpoint - no auth required
export function useCareerDomains() {
  const { fetchPublic } = useApi();

  return useQuery({
    queryKey: careerDomainKeys.list(),
    queryFn: () => fetchPublic<CareerDomain[]>('/jobs/career-domains'),
  });
}

// Admin endpoints
export function useCareerDomain(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: careerDomainKeys.detail(id),
    queryFn: () => fetchWithAuth<CareerDomain>(`/admin/career-domains/${id}`),
    enabled: !!id,
  });
}

export function useCreateCareerDomain() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: CareerDomainFormData) =>
      fetchWithAuth<CareerDomain>('/admin/career-domains', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerDomainKeys.lists() });
    },
  });
}

export function useUpdateCareerDomain() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CareerDomainFormData> }) =>
      fetchWithAuth<CareerDomain>(`/admin/career-domains/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: careerDomainKeys.lists() });
      queryClient.invalidateQueries({ queryKey: careerDomainKeys.detail(id) });
    },
  });
}

export function useDeleteCareerDomain() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) =>
      fetchWithAuth<void>(`/admin/career-domains/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerDomainKeys.lists() });
    },
  });
}

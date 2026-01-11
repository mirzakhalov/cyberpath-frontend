'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { CourseWeek, CourseWeekFormData, PaginationParams } from '@/types';
import { courseKeys } from './use-courses';

export const weekKeys = {
  all: ['weeks'] as const,
  lists: () => [...weekKeys.all, 'list'] as const,
  listByCourse: (courseId: string, params?: PaginationParams) => 
    [...weekKeys.lists(), 'course', courseId, params] as const,
  details: () => [...weekKeys.all, 'detail'] as const,
  detail: (id: string) => [...weekKeys.details(), id] as const,
};

export function useWeeksByCourse(courseId: string, params?: PaginationParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: weekKeys.listByCourse(courseId, params),
    queryFn: () => fetchWithAuthAndMeta<CourseWeek[]>(`/admin/courses/${courseId}/weeks`, { params }),
    enabled: !!courseId,
  });
}

export function useWeek(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: weekKeys.detail(id),
    queryFn: () => fetchWithAuth<CourseWeek>(`/admin/weeks/${id}`),
    enabled: !!id,
  });
}

export function useCreateWeek() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: CourseWeekFormData) => 
      fetchWithAuth<CourseWeek>('/admin/weeks', { method: 'POST', body: data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: weekKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.course_id) });
    },
  });
}

export function useUpdateWeek() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseWeekFormData> }) =>
      fetchWithAuth<CourseWeek>(`/admin/weeks/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: weekKeys.lists() });
      queryClient.invalidateQueries({ queryKey: weekKeys.detail(id) });
      if (data.course_id) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(data.course_id) });
      }
    },
  });
}

export function useDeleteWeek() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/weeks/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: weekKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useReorderWeeks() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ courseId, weekIds }: { courseId: string; weekIds: string[] }) =>
      fetchWithAuth<void>(`/admin/courses/${courseId}/weeks/reorder`, { 
        method: 'PUT', 
        body: { week_ids: weekIds } 
      }),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: weekKeys.listByCourse(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
  });
}

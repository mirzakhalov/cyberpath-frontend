'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from './use-api';
import { Course, CourseFormData, PaginationParams } from '@/types';

export interface CourseListParams extends PaginationParams {
  university_id?: string;
}

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: CourseListParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export function useCourses(params?: CourseListParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => fetchWithAuthAndMeta<Course[]>('/admin/courses', { params }),
  });
}

export function useCourse(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchWithAuth<Course>(`/admin/courses/${id}`),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (data: CourseFormData) => 
      fetchWithAuth<Course>('/admin/courses', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseFormData> }) =>
      fetchWithAuth<Course>(`/admin/courses/${id}`, { method: 'PUT', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: (id: string) => 
      fetchWithAuth<void>(`/admin/courses/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

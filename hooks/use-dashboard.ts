'use client';

import { useQuery } from '@tanstack/react-query';
import { useApi } from './use-api';
import {
  StudentListItem,
  StudentDetail,
  StudentQueryParams,
  PathwayListItem,
  PathwayDetail,
  PathwayQueryParams,
  ProgressStats,
  AgentSessionListItem,
  AgentSessionDetail,
  AgentSessionQueryParams,
  AgentStats,
} from '@/types';

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  students: () => [...dashboardKeys.all, 'students'] as const,
  studentList: (params?: StudentQueryParams) => [...dashboardKeys.students(), 'list', params] as const,
  studentDetail: (id: string) => [...dashboardKeys.students(), 'detail', id] as const,
  pathways: () => [...dashboardKeys.all, 'pathways'] as const,
  pathwayList: (params?: PathwayQueryParams) => [...dashboardKeys.pathways(), 'list', params] as const,
  pathwayDetail: (id: string) => [...dashboardKeys.pathways(), 'detail', id] as const,
  progress: (days?: number) => [...dashboardKeys.all, 'progress', days] as const,
  agentSessions: () => [...dashboardKeys.all, 'agent-sessions'] as const,
  agentSessionList: (params?: AgentSessionQueryParams) => [...dashboardKeys.agentSessions(), 'list', params] as const,
  agentSessionDetail: (id: string) => [...dashboardKeys.agentSessions(), 'detail', id] as const,
  agentStats: (days?: number) => [...dashboardKeys.all, 'agent-stats', days] as const,
};

// Students Hooks
export function useStudents(params?: StudentQueryParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: dashboardKeys.studentList(params),
    queryFn: () => fetchWithAuthAndMeta<StudentListItem[]>('/admin/dashboard/students', { params }),
  });
}

export function useStudent(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: dashboardKeys.studentDetail(id),
    queryFn: () => fetchWithAuth<StudentDetail>(`/admin/dashboard/students/${id}`),
    enabled: !!id,
  });
}

// Pathways Hooks
export function usePathways(params?: PathwayQueryParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: dashboardKeys.pathwayList(params),
    queryFn: () => fetchWithAuthAndMeta<PathwayListItem[]>('/admin/dashboard/pathways', { params }),
  });
}

export function usePathway(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: dashboardKeys.pathwayDetail(id),
    queryFn: () => fetchWithAuth<PathwayDetail>(`/admin/dashboard/pathways/${id}`),
    enabled: !!id,
  });
}

// Progress Hooks
export function useProgress(days?: number) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: dashboardKeys.progress(days),
    queryFn: () => fetchWithAuth<ProgressStats>('/admin/dashboard/progress', { 
      params: days ? { days } : undefined 
    }),
  });
}

// Agent Sessions Hooks
export function useAgentSessions(params?: AgentSessionQueryParams) {
  const { fetchWithAuthAndMeta } = useApi();

  return useQuery({
    queryKey: dashboardKeys.agentSessionList(params),
    queryFn: () => fetchWithAuthAndMeta<AgentSessionListItem[]>('/admin/dashboard/agent-sessions', { params }),
  });
}

export function useAgentSession(id: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: dashboardKeys.agentSessionDetail(id),
    queryFn: () => fetchWithAuth<AgentSessionDetail>(`/admin/dashboard/agent-sessions/${id}`),
    enabled: !!id,
  });
}

export function useAgentStats(days?: number) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: dashboardKeys.agentStats(days),
    queryFn: () => fetchWithAuth<AgentStats>('/admin/dashboard/agent-stats', { 
      params: days ? { days } : undefined 
    }),
  });
}


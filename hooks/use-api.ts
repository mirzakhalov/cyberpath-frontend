'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';
import { apiRequest, apiRequestWithMeta } from '@/lib/api/client';
import { ApiResponse } from '@/types';

export function useApi() {
  const { getToken } = useAuth();

  const fetchWithAuth = useCallback(
    async <T>(
      endpoint: string,
      options: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        body?: unknown;
        params?: Record<string, string | number | boolean | undefined>;
      } = {}
    ): Promise<T> => {
      const token = await getToken();
      return apiRequest<T>(endpoint, { ...options, token });
    },
    [getToken]
  );

  const fetchWithAuthAndMeta = useCallback(
    async <T>(
      endpoint: string,
      options: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        body?: unknown;
        params?: Record<string, string | number | boolean | undefined>;
      } = {}
    ): Promise<ApiResponse<T>> => {
      const token = await getToken();
      return apiRequestWithMeta<T>(endpoint, { ...options, token });
    },
    [getToken]
  );

  return { fetchWithAuth, fetchWithAuthAndMeta, getToken };
}


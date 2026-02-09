'use client';

import { useState, useCallback } from 'react';
import { onboardingRequest } from '@/lib/api/onboarding';
import type {
  ExploreJobsResponse,
  JobPreviewResponse,
  JobExploreItemWithSkills,
  JobPreview,
  OnboardingError,
} from '@/types';

export interface UseJobExploreReturn {
  // State
  jobs: JobExploreItemWithSkills[] | null;
  totalJobs: number;
  selectedJobPreview: JobPreview | null;
  isLoading: boolean;
  isPreviewLoading: boolean;
  error: OnboardingError | null;

  // Actions
  fetchTopJobScores: (
    sessionToken: string | null,
    desiredJob: string,
    resumeText?: string,
    limit?: number
  ) => Promise<void>;
  fetchJobPreview: (
    jobId: string,
    sessionToken?: string | null,
    resumeText?: string
  ) => Promise<void>;
  clearPreview: () => void;
  clearError: () => void;
}

export function useJobExplore(): UseJobExploreReturn {
  const [jobs, setJobs] = useState<JobExploreItemWithSkills[] | null>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [selectedJobPreview, setSelectedJobPreview] = useState<JobPreview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [error, setError] = useState<OnboardingError | null>(null);

  const fetchTopJobScores = useCallback(
    async (
      sessionToken: string | null,
      desiredJob: string,
      resumeText?: string,
      limit: number = 10
    ) => {
      if (!desiredJob) {
        setError({
          code: 'MISSING_GOALS',
          message: 'Please provide your career goals to explore jobs',
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await onboardingRequest<ExploreJobsResponse>(
          '/onboarding/explore-jobs',
          {
            method: 'POST',
            sessionToken,
            body: {
              session_token: sessionToken,
              desired_job: desiredJob,
              resume_text: resumeText,
              limit,
            },
          }
        );

        if (response.success && response.data) {
          setJobs(response.data.jobs);
          setTotalJobs(response.data.total_jobs);
        }
      } catch (err) {
        const onboardingError = err as OnboardingError;
        setError({
          code: onboardingError.code || 'EXPLORE_FAILED',
          message: onboardingError.message || 'Failed to explore jobs',
          details: onboardingError.details,
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchJobPreview = useCallback(
    async (
      jobId: string,
      sessionToken?: string | null,
      resumeText?: string
    ) => {
      if (!jobId) {
        setError({
          code: 'MISSING_JOB',
          message: 'Please provide a job ID',
        });
        return;
      }

      setIsPreviewLoading(true);
      setError(null);

      try {
        const response = await onboardingRequest<JobPreviewResponse>(
          '/onboarding/job-preview',
          {
            method: 'POST',
            sessionToken,
            body: {
              job_id: jobId,
              session_token: sessionToken,
              resume_text: resumeText,
            },
          }
        );

        if (response.success && response.data) {
          setSelectedJobPreview(response.data);
        }
      } catch (err) {
        const onboardingError = err as OnboardingError;
        setError({
          code: onboardingError.code || 'PREVIEW_FAILED',
          message: onboardingError.message || 'Failed to get job preview',
          details: onboardingError.details,
        });
        throw err;
      } finally {
        setIsPreviewLoading(false);
      }
    },
    []
  );

  const clearPreview = useCallback(() => {
    setSelectedJobPreview(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    jobs,
    totalJobs,
    selectedJobPreview,
    isLoading,
    isPreviewLoading,
    error,

    // Actions
    fetchTopJobScores,
    fetchJobPreview,
    clearPreview,
    clearError,
  };
}

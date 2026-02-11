'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  startOnboarding,
  getJobRecommendations,
  selectJob,
  generatePathway,
  getPathway,
} from '@/lib/api/onboarding';
import type {
  OnboardingJob,
  JobRecommendation,
  Pathway,
  OnboardingError,
} from '@/types';

const SESSION_STORAGE_KEY = 'cyberpath_session';
const SELECTED_JOB_KEY = 'cyberpath_selected_job';
const DESIRED_JOB_KEY = 'cyberpath_desired_job';
const RECOMMENDATIONS_KEY = 'cyberpath_recommendations';

export interface UseOnboardingReturn {
  // State
  sessionToken: string | null;
  desiredJob: string;
  hasResume: boolean;
  recommendations: JobRecommendation[] | null;
  goalBasedRecs: JobRecommendation[] | null;
  skillBasedRecs: JobRecommendation[] | null;
  overallAnalysis: string | null;
  selectedJob: OnboardingJob | null;
  pathway: Pathway | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: OnboardingError | null;

  // Actions
  startSession: (desiredJob: string, resumeFile?: File, resumeText?: string) => Promise<void>;
  fetchRecommendations: (desiredJob?: string) => Promise<void>;
  selectJobForPathway: (jobId: string) => Promise<void>;
  generateUserPathway: (courseMode?: 'parallel' | 'sequential', generationMode?: 'topic' | 'lesson') => Promise<void>;
  fetchPathway: (pathwayId: string) => Promise<void>;
  clearError: () => void;
  resetOnboarding: () => void;
}

export function useOnboarding(): UseOnboardingReturn {
  const { getToken, isSignedIn } = useAuth();
  
  // State
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [desiredJob, setDesiredJob] = useState<string>('');
  const [hasResume, setHasResume] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<JobRecommendation[] | null>(null);
  const [goalBasedRecs, setGoalBasedRecs] = useState<JobRecommendation[] | null>(null);
  const [skillBasedRecs, setSkillBasedRecs] = useState<JobRecommendation[] | null>(null);
  const [overallAnalysis, setOverallAnalysis] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<OnboardingJob | null>(null);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<OnboardingError | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      const storedJob = localStorage.getItem(SELECTED_JOB_KEY);
      const storedDesiredJob = localStorage.getItem(DESIRED_JOB_KEY);
      
      if (storedSession) {
        setSessionToken(storedSession);
      }
      if (storedJob) {
        try {
          setSelectedJob(JSON.parse(storedJob));
        } catch {
          localStorage.removeItem(SELECTED_JOB_KEY);
        }
      }
      if (storedDesiredJob) {
        setDesiredJob(storedDesiredJob);
      }

      const storedRecs = localStorage.getItem(RECOMMENDATIONS_KEY);
      if (storedRecs) {
        try {
          const parsed = JSON.parse(storedRecs);
          if (parsed.recommendations) setRecommendations(parsed.recommendations);
          if (parsed.goalBasedRecs) setGoalBasedRecs(parsed.goalBasedRecs);
          if (parsed.skillBasedRecs) setSkillBasedRecs(parsed.skillBasedRecs);
          if (parsed.overallAnalysis) setOverallAnalysis(parsed.overallAnalysis);
        } catch {
          localStorage.removeItem(RECOMMENDATIONS_KEY);
        }
      }

      // Mark as initialized after loading from localStorage
      setIsInitialized(true);
    }
  }, []);

  // Start onboarding session
  const startSession = useCallback(async (
    jobGoals: string,
    resumeFile?: File,
    resumeText?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await startOnboarding(jobGoals, resumeFile, resumeText);
      
      if (response.success && response.data) {
        setSessionToken(response.data.session_token);
        setDesiredJob(response.data.desired_job);
        setHasResume(response.data.has_resume);
        
        // Persist to localStorage
        localStorage.setItem(SESSION_STORAGE_KEY, response.data.session_token);
        localStorage.setItem(DESIRED_JOB_KEY, response.data.desired_job);
      }
    } catch (err) {
      const onboardingError = err as OnboardingError;
      setError({
        code: onboardingError.code || 'UNKNOWN_ERROR',
        message: onboardingError.message || 'Failed to start onboarding session',
        details: onboardingError.details,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch job recommendations
  const fetchRecommendations = useCallback(async (updatedDesiredJob?: string) => {
    if (!sessionToken) {
      setError({
        code: 'NO_SESSION',
        message: 'No session token available. Please start the onboarding process.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const jobToUse = updatedDesiredJob || desiredJob;
      const response = await getJobRecommendations(sessionToken, jobToUse);
      
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations);
        setGoalBasedRecs(response.data.goal_based || []);
        setSkillBasedRecs(response.data.skill_based || []);
        setOverallAnalysis(response.data.overall_analysis);

        // Cache recommendations so they survive navigation
        localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify({
          recommendations: response.data.recommendations,
          goalBasedRecs: response.data.goal_based || [],
          skillBasedRecs: response.data.skill_based || [],
          overallAnalysis: response.data.overall_analysis,
        }));
      }
    } catch (err) {
      const onboardingError = err as OnboardingError;
      setError({
        code: onboardingError.code || 'RECOMMENDATION_FAILED',
        message: onboardingError.message || 'Failed to get job recommendations',
        details: onboardingError.details,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, desiredJob]);

  // Select a job
  const selectJobForPathway = useCallback(async (jobId: string) => {
    if (!sessionToken) {
      setError({
        code: 'NO_SESSION',
        message: 'No session token available. Please start the onboarding process.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await selectJob(sessionToken, jobId);
      
      if (response.success && response.data) {
        setSelectedJob(response.data.selected_job);
        
        // Persist selected job
        localStorage.setItem(SELECTED_JOB_KEY, JSON.stringify(response.data.selected_job));
      }
    } catch (err) {
      const onboardingError = err as OnboardingError;
      setError({
        code: onboardingError.code || 'UNKNOWN_ERROR',
        message: onboardingError.message || 'Failed to select job',
        details: onboardingError.details,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken]);

  // Generate pathway (requires auth)
  const generateUserPathway = useCallback(async (
    courseMode: 'parallel' | 'sequential' = 'parallel',
    generationMode: 'topic' | 'lesson' = 'topic'
  ) => {
    if (!selectedJob) {
      setError({
        code: 'MISSING_JOB',
        message: 'No job selected. Please select a job first.',
      });
      return;
    }

    if (!isSignedIn) {
      setError({
        code: 'FORBIDDEN',
        message: 'You must be signed in to generate a pathway.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) {
        throw { code: 'FORBIDDEN', message: 'Unable to get authentication token' };
      }

      const response = await generatePathway(token, selectedJob.id, desiredJob, courseMode, generationMode);
      
      if (response.success && response.data) {
        setPathway(response.data.pathway);
        
        // Clear onboarding session data after successful pathway generation
        localStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem(SELECTED_JOB_KEY);
        localStorage.removeItem(DESIRED_JOB_KEY);
        localStorage.removeItem(RECOMMENDATIONS_KEY);
      }
    } catch (err) {
      const onboardingError = err as OnboardingError;
      setError({
        code: onboardingError.code || 'GENERATION_FAILED',
        message: onboardingError.message || 'Failed to generate pathway',
        details: onboardingError.details,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedJob, isSignedIn, getToken, desiredJob]);

  // Fetch existing pathway
  const fetchPathway = useCallback(async (pathwayId: string) => {
    if (!isSignedIn) {
      setError({
        code: 'FORBIDDEN',
        message: 'You must be signed in to view your pathway.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      if (!token) {
        throw { code: 'FORBIDDEN', message: 'Unable to get authentication token' };
      }

      const response = await getPathway(token, pathwayId);

      if (response.success && response.data) {
        setPathway(response.data);
      }
    } catch (err) {
      const onboardingError = err as OnboardingError;
      setError({
        code: onboardingError.code || 'NOT_FOUND',
        message: onboardingError.message || 'Failed to fetch pathway',
        details: onboardingError.details,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset onboarding state
  const resetOnboarding = useCallback(() => {
    setSessionToken(null);
    setDesiredJob('');
    setHasResume(false);
    setRecommendations(null);
    setOverallAnalysis(null);
    setSelectedJob(null);
    setPathway(null);
    setError(null);
    
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SELECTED_JOB_KEY);
    localStorage.removeItem(DESIRED_JOB_KEY);
    localStorage.removeItem(RECOMMENDATIONS_KEY);
  }, []);

  return {
    // State
    sessionToken,
    desiredJob,
    hasResume,
    recommendations,
    goalBasedRecs,
    skillBasedRecs,
    overallAnalysis,
    selectedJob,
    pathway,
    isLoading,
    isInitialized,
    error,

    // Actions
    startSession,
    fetchRecommendations,
    selectJobForPathway,
    generateUserPathway,
    fetchPathway,
    clearError,
    resetOnboarding,
  };
}


import { ApiResponse, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * API request handler for onboarding endpoints that support file uploads.
 * Uses session token authentication instead of Bearer token.
 */
export async function onboardingRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: FormData | Record<string, unknown>;
    sessionToken?: string | null;
    authToken?: string | null;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = 'POST', body, sessionToken, authToken } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {};
  
  // Add session token if provided (for anonymous onboarding flow)
  if (sessionToken) {
    headers['X-Session-Token'] = sessionToken;
  }
  
  // Add auth token if provided (for authenticated requests)
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  let requestBody: FormData | string | undefined;
  
  if (body instanceof FormData) {
    // Don't set Content-Type for FormData - browser will set it with boundary
    requestBody = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw {
      code: error.error?.code || 'UNKNOWN_ERROR',
      message: error.error?.message || 'An error occurred',
      details: error.error?.details,
    };
  }

  return data as ApiResponse<T>;
}

/**
 * Start the onboarding flow with resume upload and career goals.
 */
export async function startOnboarding(
  desiredJob: string,
  resumeFile?: File,
  resumeText?: string
): Promise<ApiResponse<import('@/types').OnboardingStartResponse>> {
  const formData = new FormData();
  formData.append('desired_job', desiredJob);
  
  if (resumeFile) {
    formData.append('resume', resumeFile);
  }
  
  if (resumeText) {
    formData.append('resume_text', resumeText);
  }

  return onboardingRequest('/onboarding/start', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Get job recommendations based on resume and career goals.
 */
export async function getJobRecommendations(
  sessionToken: string,
  desiredJob: string,
  resumeText?: string
): Promise<ApiResponse<import('@/types').RecommendationsResponse>> {
  return onboardingRequest('/onboarding/recommend-jobs', {
    method: 'POST',
    sessionToken,
    body: {
      session_token: sessionToken,
      desired_job: desiredJob,
      resume_text: resumeText,
    },
  });
}

/**
 * Select a job from the recommendations.
 */
export async function selectJob(
  sessionToken: string,
  jobId: string
): Promise<ApiResponse<import('@/types').SelectJobResponse>> {
  return onboardingRequest('/onboarding/select-job', {
    method: 'POST',
    sessionToken,
    body: {
      job_id: jobId,
      session_token: sessionToken,
    },
  });
}

/**
 * Generate a personalized learning pathway for the selected job.
 * Requires authentication.
 */
export async function generatePathway(
  authToken: string,
  jobId: string,
  desiredGoals?: string,
  courseMode: 'parallel' | 'sequential' = 'parallel',
  generationMode: 'topic' | 'lesson' = 'topic'
): Promise<ApiResponse<import('@/types').GeneratePathwayResponse>> {
  return onboardingRequest('/onboarding/generate-pathway', {
    method: 'POST',
    authToken,
    body: {
      job_id: jobId,
      desired_goals: desiredGoals,
      course_mode: courseMode,
      generation_mode: generationMode,
    },
  });
}

/**
 * Get an existing pathway by ID.
 * Requires authentication.
 */
export async function getPathway(
  authToken: string,
  pathwayId: string,
  includeWeeks: boolean = true
): Promise<ApiResponse<import('@/types').Pathway>> {
  const url = `/onboarding/pathway/${pathwayId}${includeWeeks ? '?include_weeks=true' : ''}`;
  return onboardingRequest(url, {
    method: 'GET',
    authToken,
  });
}




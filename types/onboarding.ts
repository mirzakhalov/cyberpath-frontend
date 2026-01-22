// Onboarding Flow Types

export interface OnboardingJob {
  id: string;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  requirements: string;
  tks_count: number;
  created_at?: string;
}

export interface JobRecommendation {
  job: OnboardingJob;
  match_score: number;
  justification: string;
  key_matches: string[];
  growth_areas: string[];
}

export interface OnboardingStartResponse {
  session_token: string;
  session_id: string;
  expires_at: string;
  desired_job: string;
  has_resume: boolean;
}

export interface RecommendationsResponse {
  session_id: string;
  recommendations: JobRecommendation[];
  overall_analysis: string;
  tokens_used: {
    input: number;
    output: number;
  };
}

export interface SelectJobResponse {
  session_token: string;
  selected_job: OnboardingJob;
  next_step: 'create_account';
  message: string;
}

export interface CourseWeekTopic {
  id: string;
  name: string;
}

export interface CourseWeekChallenge {
  id: string;
  name: string;
  difficulty: number;
}

export interface CourseWeekCourse {
  id: string;
  code: string;
  name: string;
  university: {
    name: string;
  };
}

export interface CourseWeekData {
  id: string;
  title: string;
  description: string;
  week_number: number;
  estimated_hours: number;
  course: CourseWeekCourse;
  topics: CourseWeekTopic[];
  skillbit_challenges: CourseWeekChallenge[];
}

export interface PathwayWeek {
  id: string;
  sequence_order: number;
  course_week_id: string;
  course_week: CourseWeekData;
  progress: {
    status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
    started_at: string | null;
    completed_at: string | null;
  };
}

export interface CyberpathCourse {
  id: string;
  course_number: number;
  title: string;
  week_count: number;
  completion_percentage: number;
  weeks: PathwayWeek[];
}

export interface Pathway {
  id: string;
  user_id: string;
  selected_job_id: string;
  course_mode: 'parallel' | 'sequential';
  match_score: number | null;
  total_required_tks: number;
  existing_competencies_count: number;
  tks_gap_count: number;
  is_partial: boolean;
  partial_reason: string | null;
  total_weeks: number;
  completion_percentage: number;
  selected_job: OnboardingJob;
  cyberpath_courses: CyberpathCourse[];
}

export interface GeneratePathwayResponse {
  pathway: Pathway;
  generation_complete: boolean;
  already_exists?: boolean;
}

// Onboarding State
export interface OnboardingState {
  sessionToken: string | null;
  sessionId: string | null;
  desiredJob: string;
  hasResume: boolean;
  recommendations: JobRecommendation[] | null;
  overallAnalysis: string | null;
  selectedJob: OnboardingJob | null;
  pathway: Pathway | null;
}

// Error codes
export type OnboardingErrorCode =
  | 'MISSING_GOALS'
  | 'MISSING_JOB'
  | 'NO_SESSION'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'RECOMMENDATION_FAILED'
  | 'GENERATION_FAILED';

export interface OnboardingError {
  code: OnboardingErrorCode;
  message: string;
  details?: Record<string, unknown>;
}


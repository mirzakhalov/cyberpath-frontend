// Onboarding Flow Types

import type { CareerDomain } from './career-domain';

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
  category?: 'goal_based' | 'skill_based';
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
  goal_based: JobRecommendation[];
  skill_based: JobRecommendation[];
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

export interface PathwayTopicProgress {
  id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  started_at: string | null;
  completed_at: string | null;
}

export interface PathwayTopicTKS {
  id: string;
  code: string;
  name: string;
  category: 'task' | 'knowledge' | 'skill';
}

export interface PathwayTopicData {
  id: string;
  name: string;
  description: string;
  tks_count: number;
  prerequisite_count: number;
  tks: PathwayTopicTKS[];
  prerequisites: { id: string; name: string }[];
  prerequisite_for: { id: string; name: string }[];
}

export interface PathwayTopic {
  id: string;
  sequence_order: number;
  topic_id: string;
  topic: PathwayTopicData;
  progress: PathwayTopicProgress;
}

export interface CyberpathCourse {
  id: string;
  course_number: number;
  title: string;
  week_count: number;
  topic_count: number;
  completion_percentage: number;
  weeks: PathwayWeek[];
  topics: PathwayTopic[];
}

export interface KsCoverageDetails {
  total_ks: number;
  covered_ks: number;
  uncovered_ks_codes: string[];
}

export interface Pathway {
  id: string;
  user_id: string;
  selected_job_id: string;
  course_mode: 'parallel' | 'sequential';
  generation_mode: 'topic' | 'lesson';
  match_score: number | null;
  total_required_tks: number;
  existing_competencies_count: number;
  tks_gap_count: number;
  is_partial: boolean;
  partial_reason: string | null;
  total_weeks: number;
  completion_percentage: number;
  ks_coverage_percentage: number | null;
  ks_coverage_details: KsCoverageDetails | null;
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
  goalBasedRecommendations: JobRecommendation[] | null;
  skillBasedRecommendations: JobRecommendation[] | null;
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

// Job Exploration Types
// Re-export CareerDomain from career-domain.ts for convenience
export type { CareerDomain } from './career-domain';

export interface SkillItem {
  code: string;
  name: string;
  has: boolean;
  importance: number;
}

export interface JobExploreItem {
  id: string;
  title: string;
  career_domain: CareerDomain | null;
  salary_min?: number;
  salary_max?: number;
  tks_count: number;
  resume_match_score: number;
  goal_match_score: number;
  coverage_count: number;
  gap_count: number;
}

export interface JobExploreItemWithSkills {
  id: string;
  title: string;
  career_domain: CareerDomain | null;
  salary_min?: number;
  salary_max?: number;
  resume_match_score: number;
  goal_match_score: number;
  combined_score: number;
  skills: SkillItem[];
  skills_have_count: number;
  skills_need_count: number;
  total_skills: number;
}

export interface TKSGapItem {
  code: string;
  name: string;
  category: 'task' | 'knowledge' | 'skill';
  importance: 'high' | 'medium' | 'low';
}

export interface JobPreview {
  job: {
    id: string;
    title: string;
    description: string;
    salary_min?: number;
    salary_max?: number;
  };
  career_domain: CareerDomain | null;
  coverage_percentage: number;
  total_skills: number;
  skills_have: number;
  skills_need: number;
  top_gaps: TKSGapItem[];
  gap_summary: {
    task: number;
    knowledge: number;
    skill: number;
  };
}

export interface ExploreJobsResponse {
  jobs: JobExploreItemWithSkills[];
  total_jobs: number;
}

export interface JobPreviewResponse extends JobPreview {}




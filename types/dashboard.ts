// Dashboard API Types

// Student Types
export interface StudentListItem {
  id: string;
  email: string;
  name: string | null;
  age_verified: boolean;
  consent_given: boolean;
  has_demographics: boolean;
  document_count: number;
  pathway_count: number;
  competency_count: number;
  average_progress: number;
  created_at: string;
  last_activity: string | null;
}

export interface StudentUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  age_verified_at: string | null;
  consent_given_at: string | null;
  demographics: Record<string, unknown> | null;
  created_at: string;
}

export interface StudentDocument {
  id: string;
  filename: string;
  document_type: string;
  analysis_status: string;
  uploaded_at: string;
}

export interface StudentCompetency {
  tks_id: string;
  tks_statement: string;
  source: string;
  confidence_score: number;
}

export interface StudentPathwayCourse {
  id: string;
  course_number: number;
  title: string;
  week_count: number;
  completion_percentage: number;
  status_breakdown: {
    not_started: number;
    in_progress: number;
    completed: number;
    skipped: number;
  };
}

export interface StudentPathway {
  id: string;
  selected_job_id: string;
  selected_job: {
    id: string;
    title: string;
  };
  match_score: number;
  completion_percentage: number;
  courses: StudentPathwayCourse[];
}

export interface StudentAgentSession {
  id: string;
  workflow_type: string;
  status: string;
  decision_count: number;
}

export interface StudentDetail {
  user: StudentUser;
  pathways: StudentPathway[];
  documents: StudentDocument[];
  competencies: StudentCompetency[];
  agent_sessions: StudentAgentSession[];
}

// Pathway Types
export interface PathwayListItem {
  id: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  selected_job: {
    id: string;
    title: string;
  };
  course_mode: string;
  match_score: number;
  total_courses: number;
  total_weeks: number;
  completion_percentage: number;
  is_partial: boolean;
  partial_reason: string | null;
  tks_gap_count: number;
  existing_competencies: number;
  created_at: string;
}

export interface PathwayWeekProgress {
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  completed_at: string | null;
}

export interface PathwayWeek {
  id: string;
  sequence_order: number;
  course_week: {
    id: string;
    title: string;
    week_number: number;
    course: {
      title: string;
      university: string;
    };
  };
  progress: PathwayWeekProgress | null;
}

export interface PathwayCourse {
  id: string;
  course_number: number;
  title: string;
  week_count: number;
  completion_percentage: number;
  weeks: PathwayWeek[];
}

export interface PathwayDetail {
  pathway: {
    id: string;
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    selected_job: {
      id: string;
      title: string;
    };
    course_mode: string;
    match_score: number;
    match_reasoning: string;
    total_required_tks: number;
    existing_competencies_count: number;
    tks_gap_count: number;
    is_partial: boolean;
    completion_percentage: number;
    created_at: string;
  };
  courses: PathwayCourse[];
  agent_session: {
    id: string;
    workflow_type: string;
    status: string;
    decisions: AgentDecision[];
  } | null;
}

// Progress Types
export interface ProgressOverview {
  total_pathways: number;
  total_students_with_pathways: number;
  average_completion_percentage: number;
  recent_completions: number;
  period_days: number;
}

export interface ProgressStatusBreakdown {
  not_started: number;
  in_progress: number;
  completed: number;
  skipped: number;
}

export interface CompletionBuckets {
  '0-25%': number;
  '25-50%': number;
  '50-75%': number;
  '75-100%': number;
}

export interface PopularJob {
  id: string;
  title: string;
  pathway_count: number;
}

export interface ActivityTimelineItem {
  date: string;
  completions: number;
}

export interface ProgressStats {
  overview: ProgressOverview;
  status_breakdown: ProgressStatusBreakdown;
  completion_buckets: CompletionBuckets;
  popular_jobs: PopularJob[];
  activity_timeline: ActivityTimelineItem[];
}

// Agent Session Types
export type WorkflowType = 'job_recommendation' | 'pathway_generation' | 'tks_analysis';
export type SessionStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type DecisionType = 
  | 'job_recommendation' 
  | 'tks_selection' 
  | 'lesson_search' 
  | 'course_construction' 
  | 'course_ordering' 
  | 'course_naming';

export interface AgentSessionListItem {
  id: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  workflow_type: WorkflowType;
  input_summary: Record<string, unknown>;
  output_summary: Record<string, unknown>;
  status: SessionStatus;
  started_at: string;
  completed_at: string | null;
  total_duration_ms: number | null;
  total_input_tokens: number;
  total_output_tokens: number;
  estimated_cost_usd: number;
  decision_count: number;
}

export interface AgentDecision {
  id: string;
  sequence_number: number;
  decision_type: DecisionType;
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_output: Record<string, unknown>;
  reasoning: string;
  confidence_score: number | null;
  input_tokens: number;
  output_tokens: number;
  duration_ms: number;
  model_name: string;
  is_successful: boolean;
  error_message: string | null;
  created_at: string;
}

export interface AgentSessionDetail {
  session: AgentSessionListItem;
  decisions: AgentDecision[];
  summary: {
    total_decisions: number;
    successful_decisions: number;
    failed_decisions: number;
    decision_types: Record<string, number>;
  };
}

export interface AgentStats {
  period_days: number;
  total_sessions: number;
  status_breakdown: Record<SessionStatus, number>;
  workflow_breakdown: Record<WorkflowType, number>;
  decision_type_breakdown: Record<DecisionType, number>;
  averages: {
    duration_ms: number;
    input_tokens: number;
    output_tokens: number;
  };
  totals: {
    estimated_cost_usd: number;
  };
  error_rate_percent: number;
}

// Query Params
export interface StudentQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  has_pathway?: boolean;
  has_documents?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PathwayQueryParams {
  page?: number;
  page_size?: number;
  user_id?: string;
  job_id?: string;
  is_partial?: boolean;
  min_progress?: number;
  max_progress?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AgentSessionQueryParams {
  page?: number;
  page_size?: number;
  user_id?: string;
  workflow_type?: WorkflowType;
  status?: SessionStatus;
  start_date?: string;
  end_date?: string;
}


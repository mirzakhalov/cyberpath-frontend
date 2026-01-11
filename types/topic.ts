import { TKS } from './tks';

export interface Topic {
  id: string;
  name: string;
  description: string;
  tks?: TKS[];
  tks_count?: number;
  prerequisites?: Topic[];
  prerequisite_count?: number;
  prerequisite_for?: Topic[];
  course_week_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TopicFormData {
  name: string;
  description: string;
  tks_ids: string[];
  prerequisite_ids: string[];
}


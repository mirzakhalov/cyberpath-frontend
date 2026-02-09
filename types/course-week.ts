import type { Topic } from './topic';
import type { SkillBitChallenge } from './skillbit';
import type { Course } from './course';

export interface CourseWeek {
  id: string;
  course_id: string;
  week_number: number;
  title: string;
  description?: string;
  estimated_hours?: number;
  course?: Course;
  topics?: Topic[];
  topic_count?: number;
  skillbit_challenges?: SkillBitChallenge[];
  has_skillbit?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseWeekFormData {
  course_id: string;
  week_number: number;
  title: string;
  description?: string;
  estimated_hours?: number;
  topic_ids: string[];
}





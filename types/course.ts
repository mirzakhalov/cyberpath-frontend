import { University } from './university';
import { CourseWeek } from './course-week';

export interface Course {
  id: string;
  university_id: string;
  university?: University;
  course_code: string;
  course_name: string;
  description?: string;
  week_count?: number;
  weeks?: CourseWeek[];
  created_at?: string;
  updated_at?: string;
}

export interface CourseFormData {
  university_id: string;
  course_code: string;
  course_name: string;
  description?: string;
}


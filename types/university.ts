export interface University {
  id: string;
  name: string;
  sso_entity_id?: string;
  contact_email?: string;
  contact_name?: string;
  notes?: string;
  course_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UniversityFormData {
  name: string;
  sso_entity_id?: string;
  contact_email?: string;
  contact_name?: string;
  notes?: string;
}





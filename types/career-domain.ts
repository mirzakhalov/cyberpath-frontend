export interface CareerDomain {
  id: string;
  code: string;
  name: string;
  description: string;
  job_count?: number;
  created_at?: string;
}

export interface CareerDomainFormData {
  code: string;
  name: string;
  description?: string;
}

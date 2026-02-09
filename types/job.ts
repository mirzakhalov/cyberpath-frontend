import { TKS } from './tks';
import { Cluster } from './cluster';
import { CareerDomain } from './career-domain';

export interface Job {
  id: string;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  clusters?: Cluster[];
  career_domain_id?: string;
  career_domain?: CareerDomain;
  tks_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface JobWithTKS extends Job {
  tks?: TKS[];
  required_tks?: TKS[];
}

export interface JobFormData {
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  cluster_ids: string[];
  career_domain_id?: string;
}

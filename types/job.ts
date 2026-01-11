import { Cluster } from './cluster';

export interface Job {
  id: string;
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  cluster_count: number;
  clusters?: Cluster[];
  created_at: string;
  updated_at?: string;
}

export interface JobFormData {
  title: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  requirements?: string;
  cluster_ids: string[];
}

export interface JobWithTKS extends Job {
  required_tks?: {
    id: string;
    code: string;
    name: string;
    category: 'task' | 'knowledge' | 'skill';
  }[];
}


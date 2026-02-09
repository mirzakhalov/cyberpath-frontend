import { TKS } from './tks';

export interface Cluster {
  id: string;
  name: string;
  description: string;
  code?: string;
  tks?: TKS[];
  tks_count?: number;
  job_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClusterFormData {
  name: string;
  description: string;
  code?: string;
  tks_ids: string[];
}





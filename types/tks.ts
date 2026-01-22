export type TKSCategory = 'task' | 'knowledge' | 'skill';

export interface TKS {
  id: string;
  code: string;
  name: string;
  description: string;
  category: TKSCategory;
  cluster_count?: number;
  topic_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TKSFormData {
  code: string;
  name: string;
  description: string;
  category: TKSCategory;
}

export interface TKSFilters {
  category?: TKSCategory;
  search?: string;
}



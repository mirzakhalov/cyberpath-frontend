import { z } from 'zod';

export const clusterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  code: z.string().max(20, 'Code must be less than 20 characters').optional(),
  tks_ids: z.array(z.string()).min(1, 'At least one TKS must be selected'),
});

export type ClusterSchemaType = z.infer<typeof clusterSchema>;

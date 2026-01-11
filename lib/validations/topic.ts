import { z } from 'zod';

export const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  tks_ids: z.array(z.string()).min(1, 'At least one TKS must be selected'),
  prerequisite_ids: z.array(z.string()),
});

export type TopicSchemaType = z.infer<typeof topicSchema>;

import { z } from 'zod';

export const tksSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be less than 50 characters'),
  name: z.string().min(1, 'Name is required').max(300, 'Name must be less than 300 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['task', 'knowledge', 'skill'], {
    message: 'Category is required',
  }),
});

export type TKSSchemaType = z.infer<typeof tksSchema>;

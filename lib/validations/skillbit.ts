import { z } from 'zod';

export const skillbitSchema = z.object({
  course_week_id: z.string().min(1, 'Course week is required'),
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  external_id: z.string().min(1, 'External ID is required').max(100, 'External ID must be less than 100 characters'),
  url: z.string().url('Invalid URL').min(1, 'URL is required'),
  description: z.string().optional(),
});

export type SkillbitSchemaType = z.infer<typeof skillbitSchema>;

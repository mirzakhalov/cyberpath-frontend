import { z } from 'zod';

export const courseWeekSchema = z.object({
  course_id: z.string().min(1, 'Course is required'),
  week_number: z.number().min(1, 'Week number must be at least 1'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  estimated_hours: z.number().min(0, 'Estimated hours must be positive').optional(),
  topic_ids: z.array(z.string()),
});

export type CourseWeekSchemaType = z.infer<typeof courseWeekSchema>;

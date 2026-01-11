import { z } from 'zod';

export const courseSchema = z.object({
  university_id: z.string().min(1, 'University is required'),
  course_code: z.string().min(1, 'Course code is required').max(50, 'Course code must be less than 50 characters'),
  course_name: z.string().min(1, 'Course name is required').max(200, 'Course name must be less than 200 characters'),
  description: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

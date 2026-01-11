import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required'),
  salary_min: z.number().min(0, 'Salary must be positive').optional(),
  salary_max: z.number().min(0, 'Salary must be positive').optional(),
  requirements: z.string().optional(),
  cluster_ids: z.array(z.string()).length(4, 'Exactly 4 clusters must be selected'),
}).refine(
  (data) => {
    if (data.salary_min && data.salary_max) {
      return data.salary_min <= data.salary_max;
    }
    return true;
  },
  {
    message: 'Minimum salary must be less than or equal to maximum salary',
    path: ['salary_min'],
  }
);

export type JobSchemaType = z.infer<typeof jobSchema>;

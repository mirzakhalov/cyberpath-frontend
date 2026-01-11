import { z } from 'zod';

export const universitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  sso_entity_id: z.string().max(500, 'SSO Entity ID must be less than 500 characters').optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_name: z.string().max(200, 'Contact name must be less than 200 characters').optional(),
  notes: z.string().optional(),
});

export type UniversitySchemaType = z.infer<typeof universitySchema>;

import { z } from 'zod';
import { EmploymentType } from './jobApi';

export const jobFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  experience: z.coerce.number().min(0, { message: 'Experience must be a positive number' }),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  isRemote: z.boolean().default(false),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
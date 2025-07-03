import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  industry: z.string().min(1, { message: 'Industry is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
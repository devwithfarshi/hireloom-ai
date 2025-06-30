import { z } from 'zod';

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  lastName: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;
import { z } from "zod";

export const candidateProfileSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  openToRemote: z.boolean().default(false),
  resumeUrl: z.string().min(1, { message: "Resume URL is required" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  experience: z.coerce
    .number()
    .min(0, { message: "Experience must be a positive number" }),
});

export type CandidateProfileFormValues = z.infer<typeof candidateProfileSchema>;

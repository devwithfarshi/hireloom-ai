import { z } from "zod";

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;

export const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform is required" }),
  url: z.string().min(1, { message: "URL is required" }).regex(urlRegex, {
    message: "Please enter a valid URL",
  }),
});

export const candidateProfileSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  openToRemote: z.boolean().default(false),
  skills: z.string().min(1, { message: "Skills are required" }),
  experience: z.coerce
    .number()
    .min(0, { message: "Experience must be a positive number" }),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type CandidateProfileFormValues = z.infer<typeof candidateProfileSchema>;
export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

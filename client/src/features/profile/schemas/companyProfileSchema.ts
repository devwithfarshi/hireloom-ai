import { z } from "zod";

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;

export const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10000+",
];

export const companyProfileSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  companySize: z.string().optional(),
  domain: z
    .string()
    .optional()
    .refine((val) => !val || urlRegex.test(val), {
      message: "Please enter a valid domain",
    }),
});

export type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;
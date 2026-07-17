import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const optionalUrl = optionalText.pipe(z.string().url("Enter a valid URL.").optional());

export const remoteStatusOptions = ["Remote", "Hybrid", "On-site", "Flexible", "Unknown"] as const;
export const employmentTypeOptions = ["Full-time", "Contract", "Contract-to-hire", "Part-time", "Internship", "Unknown"] as const;
export const jobStatusOptions = ["Discovered", "Interested", "Applied", "Archived"] as const;

export const jobInputSchema = z
  .object({
    careerPageUrl: optionalUrl,
    company: z.string().trim().min(1, "Company is required.").max(120, "Company is too long."),
    datePosted: z.date().optional(),
    description: z
      .string()
      .trim()
      .min(80, "Paste at least 80 characters from the job description.")
      .max(80_000, "Job description is too long for the MVP form."),
    employmentType: z.enum(employmentTypeOptions).optional(),
    jobUrl: optionalUrl,
    location: optionalText,
    notes: optionalText,
    remoteStatus: z.enum(remoteStatusOptions).optional(),
    salaryMax: z.number().int().min(0).optional(),
    salaryMin: z.number().int().min(0).optional(),
    source: optionalText,
    sourceJobId: optionalText,
    status: z.enum(jobStatusOptions).default("Discovered"),
    title: z.string().trim().min(1, "Job title is required.").max(160, "Job title is too long."),
  })
  .refine(
    (value) => value.salaryMin === undefined || value.salaryMax === undefined || value.salaryMax >= value.salaryMin,
    {
      message: "Maximum salary must be greater than or equal to minimum salary.",
      path: ["salaryMax"],
    },
  );

export type JobInput = z.infer<typeof jobInputSchema>;

import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const resumeInputSchema = z.object({
  isDefault: z.boolean().default(false),
  label: z.string().trim().min(1, "Resume label is required.").max(80, "Resume label is too long."),
  rawText: z
    .string()
    .trim()
    .min(120, "Paste at least 120 characters so ACA has enough resume context.")
    .max(100_000, "Resume text is too long for the MVP editor."),
});

export const resumeFileMetadataSchema = z.object({
  contentType: optionalText,
  fileName: optionalText,
  fileUrl: optionalText,
});

export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type ResumeFileMetadata = z.infer<typeof resumeFileMetadataSchema>;

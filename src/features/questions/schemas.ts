import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

export const reusePolicyOptions = ["Use as-is", "Adapt before use", "Needs fresh review"] as const;

export const approvedAnswerInputSchema = z.object({
  answer: z.string().trim().min(20, "Answer must be at least 20 characters.").max(12_000, "Answer is too long."),
  category: optionalText,
  question: z.string().trim().min(10, "Question must be at least 10 characters.").max(1_000, "Question is too long."),
  reusePolicy: z.enum(reusePolicyOptions).default("Adapt before use"),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type ApprovedAnswerInput = z.infer<typeof approvedAnswerInputSchema>;

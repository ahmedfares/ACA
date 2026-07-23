import { z } from "zod";

const scoreSchema = z.number().int().min(0).max(100);

export const applicationQuestionDraftSchema = z.object({
  answer: z.string().trim().min(1).max(4000),
  category: z.string().trim().min(1).max(120).optional(),
  confidence: scoreSchema,
  question: z.string().trim().min(1).max(1000),
  sourceAnswerId: z.string().trim().min(1).optional(),
  status: z.enum(["Ready", "NeedsReview"]).default("NeedsReview"),
});

export const applicationPackageSchema = z.object({
  confidence: scoreSchema,
  coverLetter: z.string().trim().min(80).max(8000),
  keyPoints: z.array(z.string().trim().min(1)).min(3).max(8),
  questions: z.array(applicationQuestionDraftSchema).max(8),
  recruiterMessage: z.string().trim().min(40).max(3000),
  reviewNotes: z.array(z.string().trim().min(1)).max(8),
  tailoredSummary: z.string().trim().min(40).max(4000),
});

export type ApplicationPackage = z.infer<typeof applicationPackageSchema>;
export type ApplicationQuestionDraft = z.infer<typeof applicationQuestionDraftSchema>;

export const applicationPackageJsonSchema = {
  additionalProperties: false,
  properties: {
    confidence: { maximum: 100, minimum: 0, type: "integer" },
    coverLetter: { type: "string" },
    keyPoints: { items: { type: "string" }, maxItems: 8, minItems: 3, type: "array" },
    questions: {
      items: {
        additionalProperties: false,
        properties: {
          answer: { type: "string" },
          category: { type: "string" },
          confidence: { maximum: 100, minimum: 0, type: "integer" },
          question: { type: "string" },
          sourceAnswerId: { type: "string" },
          status: { enum: ["Ready", "NeedsReview"], type: "string" },
        },
        required: ["question", "answer", "confidence", "status"],
        type: "object",
      },
      maxItems: 8,
      type: "array",
    },
    recruiterMessage: { type: "string" },
    reviewNotes: { items: { type: "string" }, maxItems: 8, type: "array" },
    tailoredSummary: { type: "string" },
  },
  required: ["tailoredSummary", "coverLetter", "recruiterMessage", "keyPoints", "questions", "reviewNotes", "confidence"],
  type: "object",
} as const;

import { z } from "zod";

const scoreSchema = z.number().int().min(0).max(100);

export const jobRecommendationSchema = z.enum(["Strong Apply", "Apply", "Review", "Skip", "Disqualified"]);

export const hardCriteriaResultSchema = z.enum(["Pass", "Review", "Disqualified"]);

export const jobScoreSchema = z.object({
  breakdown: z.object({
    careerGrowth: scoreSchema,
    companyQuality: scoreSchema,
    compensation: scoreSchema,
    employmentType: scoreSchema,
    experience: scoreSchema,
    industry: scoreSchema,
    location: scoreSchema,
    preferredSkills: scoreSchema,
    remotePreference: scoreSchema,
    requiredSkills: scoreSchema,
    seniority: scoreSchema,
  }),
  confidence: scoreSchema,
  concerns: z.array(z.string()).max(8),
  gaps: z.array(z.string()).max(8),
  hardCriteria: z.object({
    result: hardCriteriaResultSchema,
    violations: z.array(z.string()),
  }),
  missingInformation: z.array(z.string()).max(8),
  overallScore: scoreSchema,
  reasonsToApply: z.array(z.string()).max(5),
  reasonsToSkip: z.array(z.string()).max(5),
  recommendation: jobRecommendationSchema,
  strengths: z.array(z.string()).max(8),
});

export type JobScore = z.infer<typeof jobScoreSchema>;

export const jobScoreJsonSchema = {
  additionalProperties: false,
  properties: {
    breakdown: {
      additionalProperties: false,
      properties: {
        careerGrowth: { maximum: 100, minimum: 0, type: "integer" },
        companyQuality: { maximum: 100, minimum: 0, type: "integer" },
        compensation: { maximum: 100, minimum: 0, type: "integer" },
        employmentType: { maximum: 100, minimum: 0, type: "integer" },
        experience: { maximum: 100, minimum: 0, type: "integer" },
        industry: { maximum: 100, minimum: 0, type: "integer" },
        location: { maximum: 100, minimum: 0, type: "integer" },
        preferredSkills: { maximum: 100, minimum: 0, type: "integer" },
        remotePreference: { maximum: 100, minimum: 0, type: "integer" },
        requiredSkills: { maximum: 100, minimum: 0, type: "integer" },
        seniority: { maximum: 100, minimum: 0, type: "integer" },
      },
      required: [
        "requiredSkills",
        "preferredSkills",
        "experience",
        "seniority",
        "industry",
        "location",
        "remotePreference",
        "compensation",
        "employmentType",
        "careerGrowth",
        "companyQuality",
      ],
      type: "object",
    },
    confidence: { maximum: 100, minimum: 0, type: "integer" },
    concerns: { items: { type: "string" }, maxItems: 8, type: "array" },
    gaps: { items: { type: "string" }, maxItems: 8, type: "array" },
    hardCriteria: {
      additionalProperties: false,
      properties: {
        result: { enum: ["Pass", "Review", "Disqualified"], type: "string" },
        violations: { items: { type: "string" }, type: "array" },
      },
      required: ["result", "violations"],
      type: "object",
    },
    missingInformation: { items: { type: "string" }, maxItems: 8, type: "array" },
    overallScore: { maximum: 100, minimum: 0, type: "integer" },
    reasonsToApply: { items: { type: "string" }, maxItems: 5, type: "array" },
    reasonsToSkip: { items: { type: "string" }, maxItems: 5, type: "array" },
    recommendation: {
      enum: ["Strong Apply", "Apply", "Review", "Skip", "Disqualified"],
      type: "string",
    },
    strengths: { items: { type: "string" }, maxItems: 8, type: "array" },
  },
  required: [
    "overallScore",
    "recommendation",
    "confidence",
    "hardCriteria",
    "breakdown",
    "strengths",
    "gaps",
    "concerns",
    "missingInformation",
    "reasonsToApply",
    "reasonsToSkip",
  ],
  type: "object",
} as const;

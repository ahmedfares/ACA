import { describe, expect, it } from "vitest";

import { jobScoreJsonSchema, jobScoreSchema } from "@/features/matching";
import { validJobScore } from "./fixtures";

describe("job score schema", () => {
  it("accepts the documented structured scoring shape", () => {
    expect(jobScoreSchema.parse(validJobScore)).toEqual(validJobScore);
  });

  it("rejects invalid scores and unknown recommendations", () => {
    const result = jobScoreSchema.safeParse({
      ...validJobScore,
      overallScore: 101,
      recommendation: "Maybe",
    });

    expect(result.success).toBe(false);
  });

  it("keeps a JSON schema companion for provider structured outputs", () => {
    expect(jobScoreJsonSchema.required).toContain("overallScore");
    expect(jobScoreJsonSchema.properties.recommendation.enum).toContain("Disqualified");
  });
});

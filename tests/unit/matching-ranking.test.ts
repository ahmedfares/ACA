import { describe, expect, it, vi } from "vitest";

import { createMatchingRepository, rankTopMatches, type ScoredJobForRanking } from "@/features/matching";

function score(overrides: Partial<ScoredJobForRanking>): ScoredJobForRanking {
  return {
    company: "Acme",
    confidence: 80,
    createdAt: new Date("2026-07-20"),
    hardCriteriaResult: "Pass",
    id: "score-1",
    jobId: "job-1",
    location: "Remote",
    overall: 80,
    reasonsToApply: ["Good alignment."],
    recommendation: "Apply",
    title: "Engineer",
    ...overrides,
  };
}

describe("top matches ranking", () => {
  it("sorts eligible scored jobs by score, confidence, then recency", () => {
    const ranked = rankTopMatches([
      score({ confidence: 90, createdAt: new Date("2026-07-20"), id: "lower", jobId: "job-lower", overall: 75 }),
      score({ confidence: 70, createdAt: new Date("2026-07-20"), id: "tie-low-confidence", jobId: "job-tie-1", overall: 88 }),
      score({ confidence: 90, createdAt: new Date("2026-07-19"), id: "tie-high-confidence", jobId: "job-tie-2", overall: 88 }),
      score({ confidence: 90, createdAt: new Date("2026-07-21"), id: "winner", jobId: "job-winner", overall: 88 }),
    ]);

    expect(ranked.map((match) => match.id)).toEqual(["winner", "tie-high-confidence", "tie-low-confidence", "lower"]);
    expect(ranked.map((match) => match.rank)).toEqual([1, 2, 3, 4]);
  });

  it("excludes disqualified and skipped jobs", () => {
    const ranked = rankTopMatches([
      score({ id: "skip", jobId: "job-skip", recommendation: "Skip" }),
      score({ hardCriteriaResult: "Disqualified", id: "hard-fail", jobId: "job-hard-fail" }),
      score({ id: "apply", jobId: "job-apply", recommendation: "Apply" }),
    ]);

    expect(ranked.map((match) => match.id)).toEqual(["apply"]);
  });

  it("uses only the latest score for each job in repository ranking", async () => {
    const db = {
      careerProfile: {},
      job: {},
      jobScore: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn().mockResolvedValue([
          {
            confidence: 70,
            createdAt: new Date("2026-07-20"),
            hardCriteriaResult: "Pass",
            id: "newer",
            job: { company: "Acme", id: "job-1", location: "Remote", title: "Engineer" },
            jobId: "job-1",
            overall: 90,
            reasonsToApply: ["Latest score."],
            recommendation: "Apply",
          },
          {
            confidence: 99,
            createdAt: new Date("2026-07-19"),
            hardCriteriaResult: "Pass",
            id: "older",
            job: { company: "Acme", id: "job-1", location: "Remote", title: "Engineer" },
            jobId: "job-1",
            overall: 100,
            reasonsToApply: ["Old score."],
            recommendation: "Strong Apply",
          },
        ]),
      },
      preference: {},
      resume: {},
      skill: {},
    };
    const repository = createMatchingRepository(db as never);

    const ranked = await repository.listRankedMatches("user-1", 10);

    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe("newer");
    expect(db.jobScore.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
      }),
    );
  });
});

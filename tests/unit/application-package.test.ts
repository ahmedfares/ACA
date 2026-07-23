import { describe, expect, it, vi } from "vitest";

import { MockAiProvider } from "@/features/ai";
import { applicationPackageReviewDecision, generateApplicationPackage } from "@/features/applications";
import { mockApplicationPackage } from "@/features/applications/mock-package";

function context(overrides: Record<string, unknown> = {}) {
  return {
    approvedAnswers: [],
    careerProfile: {
      currentTitle: "Senior Software Engineer",
      summary: "Builds reliable systems.",
    },
    defaultResume: {
      id: "resume-1",
      label: "Primary resume",
      rawText: "Senior Software Engineer with React, TypeScript, PostgreSQL, AWS, and reliability experience.",
    },
    job: {
      company: "Acme Cloud",
      description: "Senior engineer role building reliable cloud products.",
      id: "job-1",
      title: "Senior Software Engineer",
    },
    latestScore: {
      concerns: [],
      gaps: [],
      missingInformation: [],
      overall: 84,
      reasonsToApply: ["Strong match for reliable product systems."],
      recommendation: "Apply",
      strengths: ["Reliability", "TypeScript"],
    },
    preference: {
      preferredTitles: ["Senior Software Engineer"],
    },
    skills: [{ name: "TypeScript" }],
    ...overrides,
  };
}

describe("application package generation", () => {
  it("persists a validated mock package and creates review item for uncertain output", async () => {
    const repository = {
      getPackageContext: vi.fn().mockResolvedValue(context()),
      savePackage: vi.fn().mockResolvedValue({ id: "application-1" }),
    };
    const reviews = {
      createOrUpdateReviewItem: vi.fn().mockResolvedValue({ id: "review-1" }),
    };
    const provider = new MockAiProvider({
      "application-package.v1": mockApplicationPackage,
    });

    const result = await generateApplicationPackage({
      jobId: "job-1",
      provider,
      repository: repository as never,
      reviewRepository: reviews as never,
      userId: "user-1",
    });

    expect(result.package.coverLetter).toContain("Dear hiring team");
    expect(repository.savePackage).toHaveBeenCalledWith(
      "user-1",
      "job-1",
      "resume-1",
      expect.objectContaining({ confidence: 84 }),
      expect.objectContaining({ model: "mock-ai" }),
    );
    expect(reviews.createOrUpdateReviewItem).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        relatedJobId: "job-1",
        shouldCreate: true,
        type: "ApplicationPackageReview",
      }),
    );
  });

  it("requires a scored job before package generation", async () => {
    const repository = {
      getPackageContext: vi.fn().mockResolvedValue(context({ latestScore: null })),
      savePackage: vi.fn(),
    };
    const provider = new MockAiProvider({
      "application-package.v1": mockApplicationPackage,
    });

    await expect(
      generateApplicationPackage({
        jobId: "job-1",
        provider,
        repository: repository as never,
        reviewRepository: { createOrUpdateReviewItem: vi.fn() } as never,
        userId: "user-1",
      }),
    ).rejects.toThrow("Score this job before generating an application package.");
    expect(repository.savePackage).not.toHaveBeenCalled();
  });

  it("does not create review items for high-confidence clean packages", () => {
    const decision = applicationPackageReviewDecision({
      jobId: "job-1",
      pkg: {
        ...mockApplicationPackage,
        confidence: 95,
        questions: [],
        reviewNotes: [],
      },
    });

    expect(decision.shouldCreate).toBe(false);
  });
});

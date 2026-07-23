import { describe, expect, it, vi } from "vitest";

import { MockAiProvider } from "@/features/ai";
import { evaluateHardCriteria, scoreJob } from "@/features/matching";
import { validJobScore } from "./fixtures";

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    careerProfile: {
      currentTitle: "Senior Software Engineer",
      summary: "Backend and cloud engineer.",
    },
    defaultResume: {
      label: "Primary resume",
      rawText: "Senior Software Engineer with Java, Spring Boot, PostgreSQL, AWS, and React experience.",
    },
    job: {
      company: "Acme Cloud",
      description: "Senior backend engineer role using Java, Spring Boot, PostgreSQL, and AWS.",
      employmentType: "Full-time",
      id: "job-1",
      location: "Remote US",
      remoteStatus: "Remote",
      salaryMax: 190000,
      salaryMin: 140000,
      title: "Senior Backend Engineer",
      userId: "user-1",
      ...overrides,
    },
    preference: {
      dealBreakers: [],
      employmentTypes: ["Full-time"],
      minCompensation: 140000,
      preferredLocations: ["Remote US"],
      remotePreference: "Remote preferred",
      userId: "user-1",
    },
    skills: [{ name: "Java" }, { name: "Spring Boot" }, { name: "AWS" }],
  };
}

describe("matching service", () => {
  function reviewRepository() {
    return {
      createOrUpdateJobScoreReview: vi.fn().mockResolvedValue({ id: "review-1" }),
    };
  }

  it("evaluates hard criteria before scoring", () => {
    expect(
      evaluateHardCriteria(
        { employmentType: "Contract", remoteStatus: "On-site", salaryMax: 120000 },
        {
          dealBreakers: [],
          employmentTypes: ["Full-time"],
          minCompensation: 150000,
          remotePreference: "Remote only",
        },
      ),
    ).toEqual({
      result: "Disqualified",
      violations: [
        "Compensation is below the minimum target of $150,000.",
        "Employment type Contract is outside the preferred types.",
        "Role is not remote, but the profile is set to remote only.",
      ],
    });
  });

  it("persists a validated score from the AI provider", async () => {
    const repository = {
      createJobScore: vi.fn().mockResolvedValue({ id: "score-1" }),
      getScoreContext: vi.fn().mockResolvedValue(createContext()),
    };
    const provider = new MockAiProvider({ "job-scoring.v1": validJobScore });
    const reviews = reviewRepository();

    await scoreJob({
      jobId: "job-1",
      provider,
      repository: repository as never,
      reviewRepository: reviews as never,
      userId: "user-1",
    });

    expect(repository.createJobScore).toHaveBeenCalledWith(
      "user-1",
      "job-1",
      expect.objectContaining({
        hardCriteria: { result: "Pass", violations: [] },
        overallScore: 81,
        recommendation: "Apply",
      }),
      {
        model: "mock-ai",
        promptVersion: "v1",
      },
    );
    expect(reviews.createOrUpdateJobScoreReview).toHaveBeenCalled();
  });

  it("overrides AI output when hard criteria disqualify the job", async () => {
    const repository = {
      createJobScore: vi.fn().mockResolvedValue({ id: "score-1" }),
      getScoreContext: vi.fn().mockResolvedValue(
        createContext({
          remoteStatus: "On-site",
          salaryMax: 120000,
        }),
      ),
    };
    const provider = new MockAiProvider({ "job-scoring.v1": validJobScore });
    const reviews = reviewRepository();

    await scoreJob({
      jobId: "job-1",
      provider,
      repository: repository as never,
      reviewRepository: reviews as never,
      userId: "user-1",
    });

    expect(repository.createJobScore).toHaveBeenCalledWith(
      "user-1",
      "job-1",
      expect.objectContaining({
        overallScore: 35,
        recommendation: "Disqualified",
        reasonsToSkip: expect.arrayContaining(["Compensation is below the minimum target of $140,000."]),
      }),
      expect.any(Object),
    );
  });

  it("requires profile and default resume before scoring", async () => {
    const repository = {
      createJobScore: vi.fn(),
      getScoreContext: vi.fn().mockResolvedValue({ ...createContext(), defaultResume: null }),
    };
    const provider = new MockAiProvider({ "job-scoring.v1": validJobScore });
    const reviews = reviewRepository();

    await expect(
      scoreJob({
        jobId: "job-1",
        provider,
        repository: repository as never,
        reviewRepository: reviews as never,
        userId: "user-1",
      }),
    ).rejects.toThrow("Complete your profile and default resume before scoring jobs.");
    expect(repository.createJobScore).not.toHaveBeenCalled();
    expect(reviews.createOrUpdateJobScoreReview).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from "vitest";

import { createReviewQueueRepository, reviewDecisionForJobScore } from "@/features/review-queue";
import { validJobScore } from "./fixtures";

describe("review queue", () => {
  it("routes low-confidence or incomplete scores to review", () => {
    const decision = reviewDecisionForJobScore({
      jobId: "job-1",
      score: {
        ...validJobScore,
        confidence: 72,
        concerns: ["Team scope is unclear."],
        missingInformation: ["Hiring manager expectations are missing."],
        recommendation: "Review",
      },
      userId: "user-1",
    });

    expect(decision).toMatchObject({
      priority: 1,
      recommendation: "Review",
      relatedJobId: "job-1",
      shouldCreate: true,
      type: "JobScoreReview",
    });
    expect(decision.requiredAction).toContain("Confidence is 72%");
  });

  it("does not create review items for confident clean apply scores", () => {
    const decision = reviewDecisionForJobScore({
      jobId: "job-1",
      score: {
        ...validJobScore,
        confidence: 92,
        concerns: [],
        missingInformation: [],
        recommendation: "Apply",
      },
      userId: "user-1",
    });

    expect(decision.shouldCreate).toBe(false);
  });

  it("creates or updates open job score review items", async () => {
    const db = {
      reviewQueueItem: {
        create: vi.fn().mockResolvedValue({ id: "item-1" }),
        findFirst: vi.fn().mockResolvedValue(null),
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
    };
    const repository = createReviewQueueRepository(db as never);

    await repository.createOrUpdateJobScoreReview("user-1", {
      confidence: 72,
      priority: 1,
      recommendation: "Review",
      relatedJobId: "job-1",
      requiredAction: "Needs review.",
      shouldCreate: true,
      type: "JobScoreReview",
    });

    expect(db.reviewQueueItem.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        relatedJobId: "job-1",
        userId: "user-1",
      }),
    });
  });

  it("resolves only open items owned by the user", async () => {
    const db = {
      reviewQueueItem: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const repository = createReviewQueueRepository(db as never);

    await repository.resolveItem("user-1", "item-1", "Resolved");

    expect(db.reviewQueueItem.updateMany).toHaveBeenCalledWith({
      data: expect.objectContaining({
        resolution: "Resolved",
        status: "Resolved",
      }),
      where: {
        id: "item-1",
        status: "Open",
        userId: "user-1",
      },
    });
  });
});

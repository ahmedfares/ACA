import { describe, expect, it, vi } from "vitest";

import { createQuestionRepository, matchApprovedAnswers, normalizeQuestion } from "@/features/questions";

const answers = [
  {
    answer: "I improved production reliability by fixing recurring incidents and improving alerting.",
    category: "Behavioral",
    id: "answer-1",
    normalizedQuestion: "tell us about a time you improved reliability",
    question: "Tell us about a time you improved reliability.",
    reusePolicy: "Adapt before use",
    tags: ["reliability"],
  },
  {
    answer: "I mentor engineers by pairing, giving direct feedback, and sharing context.",
    category: "Leadership",
    id: "answer-2",
    normalizedQuestion: "how do you mentor engineers",
    question: "How do you mentor engineers?",
    reusePolicy: "Adapt before use",
    tags: ["mentoring"],
  },
];

describe("question bank", () => {
  it("normalizes questions for duplicate-safe storage", () => {
    expect(normalizeQuestion(" Tell us: ABOUT reliability?! ")).toBe("tell us about reliability");
  });

  it("ranks exact and high-overlap approved answers", () => {
    const matches = matchApprovedAnswers("Describe a time you improved production reliability.", answers);

    expect(matches[0]).toMatchObject({
      answer: expect.objectContaining({ id: "answer-1" }),
      strategy: "Likely reusable with edits",
    });
    expect(matches[0]?.score).toBeGreaterThanOrEqual(55);
  });

  it("returns exact approved questions at full confidence", () => {
    const matches = matchApprovedAnswers("How do you mentor engineers?", answers);

    expect(matches[0]).toMatchObject({
      answer: expect.objectContaining({ id: "answer-2" }),
      score: 100,
      strategy: "Exact approved question",
    });
  });

  it("upserts approved answers by user and normalized question", async () => {
    const db = {
      approvedAnswer: {
        deleteMany: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn().mockResolvedValue({ id: "answer-1" }),
      },
      questionMatch: {
        create: vi.fn(),
      },
      user: {
        upsert: vi.fn(),
      },
    };
    const repository = createQuestionRepository(db as never);

    await repository.saveApprovedAnswer("user-1", {
      answer: "This is a reusable answer with enough detail.",
      category: "Behavioral",
      question: "Tell us about reliability.",
      reusePolicy: "Adapt before use",
      tags: ["reliability"],
    });

    expect(db.approvedAnswer.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_normalizedQuestion: {
            normalizedQuestion: "tell us about reliability",
            userId: "user-1",
          },
        },
      }),
    );
  });

  it("records a matched answer for later package reuse", async () => {
    const db = {
      approvedAnswer: {
        deleteMany: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn(),
      },
      questionMatch: {
        create: vi.fn().mockResolvedValue({ id: "match-1" }),
      },
      user: {
        upsert: vi.fn(),
      },
    };
    const repository = createQuestionRepository(db as never);

    await repository.recordMatch("user-1", {
      answerId: "answer-1",
      question: "Describe reliability work.",
      score: 88,
      strategy: "Strong reusable match",
    });

    expect(db.questionMatch.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        approvedAnswerId: "answer-1",
        normalizedQuestion: "describe reliability work",
        score: 88,
        userId: "user-1",
      }),
    });
  });
});

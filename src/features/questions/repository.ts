import type { PrismaClient } from "@prisma/client";

import { normalizeQuestion } from "@/features/questions/matching";
import { approvedAnswerInputSchema, type ApprovedAnswerInput } from "@/features/questions/schemas";
import { prisma } from "@/lib/prisma";

type QuestionDb = Pick<PrismaClient, "approvedAnswer" | "questionMatch" | "user">;

function answerData(input: ApprovedAnswerInput) {
  return {
    answer: input.answer,
    category: input.category ?? null,
    normalizedQuestion: normalizeQuestion(input.question),
    question: input.question,
    reusePolicy: input.reusePolicy,
    status: "Approved",
    tags: input.tags,
  };
}

export function createQuestionRepository(db: QuestionDb = prisma) {
  return {
    async ensureUser(user: { email?: string | null; id: string; name?: string | null }) {
      return db.user.upsert({
        create: {
          email: user.email ?? `${user.id}@local.invalid`,
          id: user.id,
          name: user.name ?? null,
        },
        update: {
          email: user.email ?? `${user.id}@local.invalid`,
          name: user.name ?? null,
        },
        where: { id: user.id },
      });
    },

    async listApprovedAnswers(userId: string) {
      return db.approvedAnswer.findMany({
        orderBy: [{ updatedAt: "desc" }],
        where: { status: "Approved", userId },
      });
    },

    async saveApprovedAnswer(userId: string, input: unknown) {
      const parsed = approvedAnswerInputSchema.parse(input);
      const data = answerData(parsed);

      return db.approvedAnswer.upsert({
        create: {
          ...data,
          userId,
        },
        update: data,
        where: {
          userId_normalizedQuestion: {
            normalizedQuestion: data.normalizedQuestion,
            userId,
          },
        },
      });
    },

    async deleteApprovedAnswer(userId: string, answerId: string) {
      return db.approvedAnswer.deleteMany({
        where: {
          id: answerId,
          userId,
        },
      });
    },

    async recordMatch(userId: string, input: { answerId: string; question: string; score: number; strategy: string }) {
      return db.questionMatch.create({
        data: {
          approvedAnswerId: input.answerId,
          normalizedQuestion: normalizeQuestion(input.question),
          question: input.question.trim(),
          score: input.score,
          strategy: input.strategy,
          userId,
        },
      });
    },
  };
}

export const questionRepository = createQuestionRepository();

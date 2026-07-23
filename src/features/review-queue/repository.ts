import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ReviewQueueDecision } from "@/features/review-queue/rules";

type ReviewQueueDb = Pick<PrismaClient, "reviewQueueItem">;

export function createReviewQueueRepository(db: ReviewQueueDb = prisma) {
  return {
    async createOrUpdateJobScoreReview(userId: string, decision: ReviewQueueDecision) {
      return this.createOrUpdateReviewItem(userId, decision);
    },

    async createOrUpdateReviewItem(userId: string, decision: ReviewQueueDecision) {
      if (!decision.shouldCreate) {
        return null;
      }

      const existing = await db.reviewQueueItem.findFirst({
        where: {
          relatedJobId: decision.relatedJobId,
          status: "Open",
          type: decision.type,
          userId,
        },
      });
      const data = {
        confidence: decision.confidence ?? null,
        priority: decision.priority,
        recommendation: decision.recommendation ?? null,
        relatedJobId: decision.relatedJobId,
        requiredAction: decision.requiredAction,
        type: decision.type,
        userId,
      };

      if (existing) {
        return db.reviewQueueItem.update({
          data,
          where: { id: existing.id },
        });
      }

      return db.reviewQueueItem.create({ data });
    },

    async listOpenItems(userId: string) {
      return db.reviewQueueItem.findMany({
        include: {
          job: {
            select: {
              company: true,
              id: true,
              title: true,
            },
          },
        },
        orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
        where: {
          status: "Open",
          userId,
        },
      });
    },

    async resolveItem(userId: string, itemId: string, resolution: string) {
      return db.reviewQueueItem.updateMany({
        data: {
          resolution,
          resolvedAt: new Date(),
          status: "Resolved",
        },
        where: {
          id: itemId,
          status: "Open",
          userId,
        },
      });
    },
  };
}

export const reviewQueueRepository = createReviewQueueRepository();

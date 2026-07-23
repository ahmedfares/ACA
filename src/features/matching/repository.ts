import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { JobScore } from "@/features/matching/schemas";

type MatchingDb = Pick<PrismaClient, "careerProfile" | "job" | "jobScore" | "preference" | "resume" | "skill">;

export type ScoreContext = Awaited<ReturnType<ReturnType<typeof createMatchingRepository>["getScoreContext"]>>;

export function createMatchingRepository(db: MatchingDb = prisma) {
  return {
    async createJobScore(userId: string, jobId: string, score: JobScore, metadata: { model: string; promptVersion: string }) {
      return db.jobScore.create({
        data: {
          confidence: score.confidence,
          concerns: score.concerns,
          gaps: score.gaps,
          hardCriteria: score.hardCriteria,
          hardCriteriaResult: score.hardCriteria.result,
          jobId,
          missingInformation: score.missingInformation,
          model: metadata.model,
          overall: score.overallScore,
          promptVersion: metadata.promptVersion,
          reasonsToApply: score.reasonsToApply,
          reasonsToSkip: score.reasonsToSkip,
          recommendation: score.recommendation,
          scoreBreakdown: score.breakdown,
          strengths: score.strengths,
          userId,
        },
      });
    },

    async getLatestScore(userId: string, jobId: string) {
      return db.jobScore.findFirst({
        orderBy: { createdAt: "desc" },
        where: { jobId, userId },
      });
    },

    async getScoreContext(userId: string, jobId: string) {
      const [job, careerProfile, preference, skills, defaultResume] = await Promise.all([
        db.job.findFirst({ where: { id: jobId, userId } }),
        db.careerProfile.findUnique({ where: { userId } }),
        db.preference.findUnique({ where: { userId } }),
        db.skill.findMany({ orderBy: { name: "asc" }, where: { userId } }),
        db.resume.findFirst({ orderBy: { updatedAt: "desc" }, where: { isDefault: true, userId } }),
      ]);

      return {
        careerProfile,
        defaultResume,
        job,
        preference,
        skills,
      };
    },
  };
}

export const matchingRepository = createMatchingRepository();

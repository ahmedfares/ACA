import type { PrismaClient } from "@prisma/client";

import { applicationStatusInputSchema, type ApplicationPackage } from "@/features/applications/schemas";
import { normalizeQuestion } from "@/features/questions";
import { prisma } from "@/lib/prisma";

type ApplicationDb = Pick<
  PrismaClient,
  | "application"
  | "applicationMaterial"
  | "applicationQuestion"
  | "approvedAnswer"
  | "careerProfile"
  | "job"
  | "jobScore"
  | "preference"
  | "resume"
  | "skill"
>;

export type ApplicationPackageContext = Awaited<ReturnType<ReturnType<typeof createApplicationRepository>["getPackageContext"]>>;
export type PersistedApplicationPackage = Awaited<ReturnType<ReturnType<typeof createApplicationRepository>["getLatestPackage"]>>;

function compactText(value?: string | null, maxLength = 6000) {
  const text = (value ?? "").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

export function createApplicationRepository(db: ApplicationDb = prisma) {
  return {
    async getPackageContext(userId: string, jobId: string) {
      const [job, careerProfile, preference, skills, defaultResume, latestScore, approvedAnswers] = await Promise.all([
        db.job.findFirst({ where: { id: jobId, userId } }),
        db.careerProfile.findUnique({ where: { userId } }),
        db.preference.findUnique({ where: { userId } }),
        db.skill.findMany({ orderBy: { name: "asc" }, where: { userId } }),
        db.resume.findFirst({ orderBy: { updatedAt: "desc" }, where: { isDefault: true, userId } }),
        db.jobScore.findFirst({ orderBy: { createdAt: "desc" }, where: { jobId, userId } }),
        db.approvedAnswer.findMany({ orderBy: { updatedAt: "desc" }, take: 20, where: { status: "Approved", userId } }),
      ]);

      return {
        approvedAnswers,
        careerProfile,
        defaultResume,
        job,
        latestScore,
        preference,
        skills,
      };
    },

    async savePackage(
      userId: string,
      jobId: string,
      resumeId: string | null,
      pkg: ApplicationPackage,
      metadata: { model: string; promptVersion: string },
    ) {
      const application = await db.application.upsert({
        create: {
          jobId,
          resumeId,
          status: "PackageDraft",
          userId,
        },
        update: {
          resumeId,
          status: "PackageDraft",
        },
        where: {
          userId_jobId: {
            jobId,
            userId,
          },
        },
      });

      await Promise.all([
        db.applicationMaterial.deleteMany({ where: { applicationId: application.id, userId } }),
        db.applicationQuestion.deleteMany({ where: { applicationId: application.id, userId } }),
      ]);

      await db.applicationMaterial.createMany({
        data: [
          {
            applicationId: application.id,
            content: pkg.tailoredSummary,
            model: metadata.model,
            promptVersion: metadata.promptVersion,
            type: "TailoredSummary",
            userId,
          },
          {
            applicationId: application.id,
            content: pkg.coverLetter,
            model: metadata.model,
            promptVersion: metadata.promptVersion,
            type: "CoverLetter",
            userId,
          },
          {
            applicationId: application.id,
            content: pkg.recruiterMessage,
            model: metadata.model,
            promptVersion: metadata.promptVersion,
            type: "RecruiterMessage",
            userId,
          },
        ],
      });

      if (pkg.questions.length > 0) {
        await db.applicationQuestion.createMany({
          data: pkg.questions.map((question) => ({
            answerText: question.answer,
            applicationId: application.id,
            approvedAnswerId: question.sourceAnswerId ?? null,
            category: question.category ?? null,
            confidence: question.confidence,
            normalizedText: normalizeQuestion(question.question),
            originalText: question.question,
            status: question.status,
            userId,
          })),
        });
      }

      return this.getLatestPackage(userId, jobId);
    },

    async getLatestPackage(userId: string, jobId: string) {
      return db.application.findFirst({
        include: {
          job: {
            select: {
              company: true,
              id: true,
              title: true,
            },
          },
          materials: {
            orderBy: { createdAt: "asc" },
          },
          questions: {
            orderBy: { createdAt: "asc" },
          },
          resume: {
            select: {
              id: true,
              label: true,
            },
          },
        },
        where: { jobId, userId },
      });
    },

    async listApplications(userId: string) {
      return db.application.findMany({
        include: {
          job: {
            select: {
              company: true,
              id: true,
              jobUrl: true,
              location: true,
              title: true,
            },
          },
          materials: {
            select: {
              id: true,
              type: true,
            },
          },
          questions: {
            select: {
              id: true,
              status: true,
            },
          },
          resume: {
            select: {
              id: true,
              label: true,
            },
          },
        },
        orderBy: [{ updatedAt: "desc" }],
        where: { userId },
      });
    },

    async updateApplicationStatus(userId: string, applicationId: string, input: unknown) {
      const parsed = applicationStatusInputSchema.parse(input);

      return db.application.updateMany({
        data: {
          applicationDate: parsed.applicationDate ?? null,
          applicationUrl: parsed.applicationUrl ?? null,
          followUpDate: parsed.followUpDate ?? null,
          notes: parsed.notes ?? null,
          recruiterContact: parsed.recruiterContact ?? null,
          recruiterName: parsed.recruiterName ?? null,
          source: parsed.source ?? null,
          status: parsed.status,
        },
        where: {
          id: applicationId,
          userId,
        },
      });
    },

    async listApplicationsForExport(userId: string) {
      return db.application.findMany({
        include: {
          job: {
            select: {
              company: true,
              jobUrl: true,
              title: true,
            },
          },
          resume: {
            select: {
              label: true,
            },
          },
        },
        orderBy: [{ updatedAt: "desc" }],
        where: { userId },
      });
    },

    async listJobsForExport(userId: string) {
      return db.job.findMany({
        orderBy: [{ updatedAt: "desc" }],
        where: { userId },
      });
    },
  };
}

export function packageContextForPrompt(context: NonNullable<ApplicationPackageContext>) {
  return JSON.stringify(
    {
      approvedAnswerMemory: context.approvedAnswers.map((answer) => ({
        answer: compactText(answer.answer, 1500),
        category: answer.category,
        id: answer.id,
        question: answer.question,
        reusePolicy: answer.reusePolicy,
        tags: answer.tags,
      })),
      trustedProfile: context.careerProfile,
      trustedPreferences: context.preference,
      trustedResume: {
        label: context.defaultResume?.label,
        rawText: compactText(context.defaultResume?.rawText),
      },
      trustedScore: context.latestScore
        ? {
            concerns: context.latestScore.concerns,
            gaps: context.latestScore.gaps,
            missingInformation: context.latestScore.missingInformation,
            overall: context.latestScore.overall,
            reasonsToApply: context.latestScore.reasonsToApply,
            recommendation: context.latestScore.recommendation,
            strengths: context.latestScore.strengths,
          }
        : null,
      trustedSkills: context.skills,
      untrustedJob: {
        company: context.job?.company,
        description: compactText(context.job?.description),
        employmentType: context.job?.employmentType,
        location: context.job?.location,
        remoteStatus: context.job?.remoteStatus,
        salaryMax: context.job?.salaryMax,
        salaryMin: context.job?.salaryMin,
        title: context.job?.title,
      },
    },
    null,
    2,
  );
}

export const applicationRepository = createApplicationRepository();

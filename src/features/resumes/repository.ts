import { Prisma, type PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { resumeInputSchema, type ResumeInput } from "@/features/resumes/schemas";

type ResumeDb = Pick<PrismaClient, "resume" | "user">;

function jsonOrNull(value: unknown) {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function resumeData(input: ResumeInput) {
  return {
    extractedJson: jsonOrNull(undefined),
    label: input.label,
    rawText: input.rawText,
  };
}

export function createResumeRepository(db: ResumeDb = prisma) {
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

    async listResumes(userId: string) {
      return db.resume.findMany({
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        where: { userId },
      });
    },

    async saveResume(userId: string, input: unknown) {
      const parsed = resumeInputSchema.parse(input);
      const existingCount = await db.resume.count({ where: { userId } });
      const shouldBeDefault = parsed.isDefault || existingCount === 0;

      if (shouldBeDefault) {
        await db.resume.updateMany({
          data: { isDefault: false },
          where: { userId },
        });
      }

      return db.resume.create({
        data: {
          ...resumeData(parsed),
          isDefault: shouldBeDefault,
          userId,
        },
      });
    },

    async setDefaultResume(userId: string, resumeId: string) {
      const resume = await db.resume.findFirst({
        where: { id: resumeId, userId },
      });

      if (!resume) {
        throw new Error("Resume not found for user.");
      }

      await db.resume.updateMany({
        data: { isDefault: false },
        where: { userId },
      });

      return db.resume.update({
        data: { isDefault: true },
        where: { id: resume.id },
      });
    },
  };
}

export const resumeRepository = createResumeRepository();

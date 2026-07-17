import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { canonicalizeUrl, descriptionHash, normalizeText } from "@/features/jobs/normalization";
import { jobInputSchema, type JobInput } from "@/features/jobs/schemas";

type JobDb = Pick<PrismaClient, "job" | "user">;

function jobData(input: JobInput) {
  const canonicalUrl = canonicalizeUrl(input.jobUrl);

  return {
    canonicalUrl: canonicalUrl ?? null,
    careerPageUrl: input.careerPageUrl ?? null,
    company: input.company,
    datePosted: input.datePosted ?? null,
    description: input.description,
    descriptionHash: descriptionHash(input.description),
    employmentType: input.employmentType ?? null,
    jobUrl: input.jobUrl ?? null,
    location: input.location ?? null,
    normalizedCompany: normalizeText(input.company) ?? null,
    normalizedLocation: normalizeText(input.location) ?? null,
    normalizedTitle: normalizeText(input.title) ?? null,
    notes: input.notes ?? null,
    remoteStatus: input.remoteStatus ?? null,
    salaryMax: input.salaryMax ?? null,
    salaryMin: input.salaryMin ?? null,
    source: input.source ?? null,
    sourceJobId: input.sourceJobId ?? null,
    status: input.status,
    title: input.title,
  };
}

export function createJobRepository(db: JobDb = prisma) {
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

    async createJob(userId: string, input: unknown) {
      const parsed = jobInputSchema.parse(input);

      return db.job.create({
        data: {
          ...jobData(parsed),
          userId,
        },
      });
    },

    async getJob(userId: string, jobId: string) {
      return db.job.findFirst({
        where: { id: jobId, userId },
      });
    },

    async listJobs(userId: string) {
      return db.job.findMany({
        orderBy: [{ updatedAt: "desc" }],
        where: { userId },
      });
    },
  };
}

export const jobRepository = createJobRepository();

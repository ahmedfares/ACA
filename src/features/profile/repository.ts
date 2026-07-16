import { Prisma, type PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  careerProfileInputSchema,
  preferenceInputSchema,
  replaceSkillsInputSchema,
  type CareerProfileInput,
  type PreferenceInput,
  type SkillInput,
} from "@/features/profile/schemas";

type ProfileDb = Pick<PrismaClient, "careerProfile" | "preference" | "skill" | "user">;

function jsonOrNull(value: unknown) {
  return value === undefined ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function profileData(input: CareerProfileInput) {
  return {
    currentTitle: input.currentTitle ?? null,
    yearsExperience: input.yearsExperience ?? null,
    summary: input.summary ?? null,
    workHistory: jsonOrNull(input.workHistory),
    education: jsonOrNull(input.education),
    certifications: jsonOrNull(input.certifications),
    achievements: jsonOrNull(input.achievements),
    industries: input.industries,
    leadership: input.leadership ?? null,
    instructions: input.instructions ?? null,
  };
}

function preferenceData(input: PreferenceInput) {
  return {
    preferredTitles: input.preferredTitles,
    minCompensation: input.minCompensation ?? null,
    desiredCompensation: input.desiredCompensation ?? null,
    preferredLocations: input.preferredLocations,
    remotePreference: input.remotePreference ?? null,
    employmentTypes: input.employmentTypes,
    workAuthorization: input.workAuthorization ?? null,
    sponsorship: input.sponsorship ?? null,
    relocation: input.relocation ?? null,
    travel: input.travel ?? null,
    dealBreakers: input.dealBreakers,
    targetCompanies: input.targetCompanies,
    excludedCompanies: input.excludedCompanies,
    preferredSkills: input.preferredSkills,
  };
}

function skillData(userId: string, input: SkillInput) {
  return {
    userId,
    name: input.name,
    category: input.category ?? null,
    proficiency: input.proficiency ?? null,
    years: input.years ?? null,
  };
}

export function createProfileRepository(db: ProfileDb = prisma) {
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

    async getProfileBundle(userId: string) {
      const [careerProfile, preference, skills] = await Promise.all([
        db.careerProfile.findUnique({ where: { userId } }),
        db.preference.findUnique({ where: { userId } }),
        db.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }], where: { userId } }),
      ]);

      return { careerProfile, preference, skills };
    },

    async upsertCareerProfile(userId: string, input: unknown) {
      const parsed = careerProfileInputSchema.parse(input);
      const data = profileData(parsed);

      return db.careerProfile.upsert({
        create: { ...data, userId },
        update: data,
        where: { userId },
      });
    },

    async upsertPreference(userId: string, input: unknown) {
      const parsed = preferenceInputSchema.parse(input);
      const data = preferenceData(parsed);

      return db.preference.upsert({
        create: { ...data, userId },
        update: data,
        where: { userId },
      });
    },

    async replaceSkills(userId: string, input: unknown) {
      const parsed = replaceSkillsInputSchema.parse(input);

      await db.skill.deleteMany({ where: { userId } });

      if (parsed.length > 0) {
        await db.skill.createMany({
          data: parsed.map((skill) => skillData(userId, skill)),
        });
      }

      return db.skill.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }], where: { userId } });
    },
  };
}

export const profileRepository = createProfileRepository();

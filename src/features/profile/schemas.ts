import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const textList = z
  .array(z.string().trim().min(1))
  .default([])
  .transform((values) => Array.from(new Set(values)));

const jsonObject = z.record(z.string(), z.unknown());

export const careerProfileInputSchema = z.object({
  currentTitle: optionalText,
  yearsExperience: z.number().int().min(0).max(80).optional(),
  summary: optionalText,
  workHistory: z.array(jsonObject).optional(),
  education: z.array(jsonObject).optional(),
  certifications: z.array(jsonObject).optional(),
  achievements: z.array(jsonObject).optional(),
  industries: textList,
  leadership: optionalText,
  instructions: optionalText,
});

export const preferenceInputSchema = z
  .object({
    preferredTitles: textList,
    minCompensation: z.number().int().min(0).optional(),
    desiredCompensation: z.number().int().min(0).optional(),
    preferredLocations: textList,
    remotePreference: optionalText,
    employmentTypes: textList,
    workAuthorization: optionalText,
    sponsorship: optionalText,
    relocation: optionalText,
    travel: optionalText,
    dealBreakers: textList,
    targetCompanies: textList,
    excludedCompanies: textList,
    preferredSkills: textList,
  })
  .refine(
    (value) =>
      value.minCompensation === undefined ||
      value.desiredCompensation === undefined ||
      value.desiredCompensation >= value.minCompensation,
    {
      message: "Desired compensation must be greater than or equal to minimum compensation.",
      path: ["desiredCompensation"],
    },
  );

export const skillInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: optionalText,
  proficiency: optionalText,
  years: z.number().int().min(0).max(80).optional(),
});

export const replaceSkillsInputSchema = z
  .array(skillInputSchema)
  .max(200)
  .transform((skills) => {
    const seen = new Set<string>();

    return skills.filter((skill) => {
      const key = skill.name.toLocaleLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  });

export type CareerProfileInput = z.infer<typeof careerProfileInputSchema>;
export type PreferenceInput = z.infer<typeof preferenceInputSchema>;
export type SkillInput = z.infer<typeof skillInputSchema>;

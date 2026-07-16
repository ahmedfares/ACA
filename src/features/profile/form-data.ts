import {
  careerProfileInputSchema,
  preferenceInputSchema,
  replaceSkillsInputSchema,
  type CareerProfileInput,
  type PreferenceInput,
  type SkillInput,
} from "@/features/profile/schemas";

export type ProfileFormInput = {
  careerProfile: CareerProfileInput;
  preference: PreferenceInput;
  skills: SkillInput[];
};

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function optionalNumber(formData: FormData, key: string) {
  const value = optionalString(formData, key)?.trim();

  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function splitList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSkills(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", category, proficiency, years] = line.split("|").map((part) => part.trim());

      return {
        category,
        name,
        proficiency,
        years: years ? Number(years) : undefined,
      };
    });
}

export function parseProfileFormData(formData: FormData): ProfileFormInput {
  const careerProfile = careerProfileInputSchema.parse({
    currentTitle: optionalString(formData, "currentTitle"),
    industries: splitList(optionalString(formData, "industries")),
    instructions: optionalString(formData, "instructions"),
    leadership: optionalString(formData, "leadership"),
    summary: optionalString(formData, "summary"),
    yearsExperience: optionalNumber(formData, "yearsExperience"),
  });

  const preference = preferenceInputSchema.parse({
    dealBreakers: splitList(optionalString(formData, "dealBreakers")),
    desiredCompensation: optionalNumber(formData, "desiredCompensation"),
    employmentTypes: splitList(optionalString(formData, "employmentTypes")),
    excludedCompanies: splitList(optionalString(formData, "excludedCompanies")),
    minCompensation: optionalNumber(formData, "minCompensation"),
    preferredLocations: splitList(optionalString(formData, "preferredLocations")),
    preferredSkills: splitList(optionalString(formData, "preferredSkills")),
    preferredTitles: splitList(optionalString(formData, "preferredTitles")),
    relocation: optionalString(formData, "relocation"),
    remotePreference: optionalString(formData, "remotePreference"),
    sponsorship: optionalString(formData, "sponsorship"),
    targetCompanies: splitList(optionalString(formData, "targetCompanies")),
    travel: optionalString(formData, "travel"),
    workAuthorization: optionalString(formData, "workAuthorization"),
  });

  const skills = replaceSkillsInputSchema.parse(parseSkills(optionalString(formData, "skills")));

  return { careerProfile, preference, skills };
}

export function listToText(values?: string[] | null) {
  return values?.join(", ") ?? "";
}

export function skillsToText(skills: SkillInput[]) {
  return skills
    .map((skill) => [skill.name, skill.category, skill.proficiency, skill.years].filter(Boolean).join(" | "))
    .join("\n");
}

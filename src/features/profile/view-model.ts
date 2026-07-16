import type { CareerProfile, Preference, Skill } from "@prisma/client";

import { listToText, skillsToText } from "@/features/profile/form-data";
import type { ProfileFormDefaults } from "@/components/profile/profile-form";

export function profileDefaultsFromBundle(bundle: {
  careerProfile: CareerProfile | null;
  preference: Preference | null;
  skills: Skill[];
}): ProfileFormDefaults {
  const { careerProfile, preference, skills } = bundle;

  return {
    currentTitle: careerProfile?.currentTitle ?? "",
    dealBreakers: listToText(preference?.dealBreakers),
    desiredCompensation: preference?.desiredCompensation?.toString() ?? "",
    employmentTypes: listToText(preference?.employmentTypes),
    excludedCompanies: listToText(preference?.excludedCompanies),
    industries: listToText(careerProfile?.industries),
    instructions: careerProfile?.instructions ?? "",
    leadership: careerProfile?.leadership ?? "",
    minCompensation: preference?.minCompensation?.toString() ?? "",
    preferredLocations: listToText(preference?.preferredLocations),
    preferredSkills: listToText(preference?.preferredSkills),
    preferredTitles: listToText(preference?.preferredTitles),
    remotePreference: preference?.remotePreference ?? "",
    skills: skillsToText(
      skills.map((skill) => ({
        category: skill.category ?? undefined,
        name: skill.name,
        proficiency: skill.proficiency ?? undefined,
        years: skill.years ?? undefined,
      })),
    ),
    summary: careerProfile?.summary ?? "",
    targetCompanies: listToText(preference?.targetCompanies),
    workAuthorization: preference?.workAuthorization ?? "",
    yearsExperience: careerProfile?.yearsExperience?.toString() ?? "",
  };
}

export const emptyProfileDefaults: ProfileFormDefaults = {};

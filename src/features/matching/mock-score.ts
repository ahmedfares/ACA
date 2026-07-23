import type { JobScore } from "@/features/matching/schemas";

export const mockJobScore: JobScore = {
  breakdown: {
    careerGrowth: 72,
    companyQuality: 65,
    compensation: 80,
    employmentType: 100,
    experience: 78,
    industry: 70,
    location: 90,
    preferredSkills: 75,
    remotePreference: 100,
    requiredSkills: 82,
    seniority: 76,
  },
  confidence: 84,
  concerns: ["Confirm the role scope and compensation directly with the recruiter."],
  gaps: ["Some preferred tools may need deeper evidence from the resume."],
  hardCriteria: {
    result: "Pass",
    violations: [],
  },
  missingInformation: ["Interview process, team size, and exact tech stack depth are not stated."],
  overallScore: 81,
  reasonsToApply: ["Strong alignment with backend, cloud, and product delivery experience."],
  reasonsToSkip: ["Skip if the role requires experience not present in the profile or resume."],
  recommendation: "Apply",
  strengths: ["Core engineering experience appears aligned with the role."],
};

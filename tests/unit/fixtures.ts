import type { JobScore } from "@/features/matching";

export const validJobScore: JobScore = {
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
  concerns: ["Compensation range is not confirmed by recruiter."],
  gaps: ["Job mentions Kubernetes, which is not prominent in the resume."],
  hardCriteria: {
    result: "Pass",
    violations: [],
  },
  missingInformation: ["Interview process and team size are not stated."],
  overallScore: 81,
  reasonsToApply: ["Strong backend and cloud alignment."],
  reasonsToSkip: ["Skip if the role requires heavy Kubernetes ownership."],
  recommendation: "Apply",
  strengths: ["Backend systems experience matches the role."],
};

type HardCriteriaJob = {
  employmentType?: string | null;
  remoteStatus?: string | null;
  salaryMax?: number | null;
  salaryMin?: number | null;
};

type HardCriteriaPreference = {
  dealBreakers?: string[];
  employmentTypes?: string[];
  minCompensation?: number | null;
  preferredLocations?: string[];
  remotePreference?: string | null;
  workAuthorization?: string | null;
};

export type HardCriteriaEvaluation = {
  result: "Pass" | "Review" | "Disqualified";
  violations: string[];
};

function includesNormalized(values: string[] | undefined, target?: string | null) {
  if (!target) {
    return false;
  }

  return (values ?? []).some((value) => value.toLocaleLowerCase() === target.toLocaleLowerCase());
}

export function evaluateHardCriteria(job: HardCriteriaJob, preference?: HardCriteriaPreference | null): HardCriteriaEvaluation {
  if (!preference) {
    return {
      result: "Review",
      violations: ["Profile preferences are missing."],
    };
  }

  const violations: string[] = [];

  if (preference.minCompensation && job.salaryMax && job.salaryMax < preference.minCompensation) {
    violations.push(`Compensation is below the minimum target of $${preference.minCompensation.toLocaleString()}.`);
  }

  if ((preference.employmentTypes?.length ?? 0) > 0 && job.employmentType && !includesNormalized(preference.employmentTypes, job.employmentType)) {
    violations.push(`Employment type ${job.employmentType} is outside the preferred types.`);
  }

  if (preference.remotePreference === "Remote only" && job.remoteStatus && job.remoteStatus !== "Remote") {
    violations.push("Role is not remote, but the profile is set to remote only.");
  }

  if (includesNormalized(preference.dealBreakers, "Required relocation") && includesNormalized(preference.preferredLocations, "Open to relocation") === false) {
    if (job.remoteStatus === "On-site") {
      violations.push("On-site role may require relocation, which is listed as a deal-breaker.");
    }
  }

  if (violations.length === 0) {
    return { result: "Pass", violations: [] };
  }

  return {
    result: violations.some((violation) => /below the minimum|remote only/i.test(violation)) ? "Disqualified" : "Review",
    violations,
  };
}

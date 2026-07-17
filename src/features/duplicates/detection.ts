export type DuplicateLevel =
  | "Exact duplicate"
  | "Probable duplicate"
  | "Possible repost"
  | "Different role"
  | "Previously applied"
  | "Safe to continue";

export type DuplicateJobInput = {
  canonicalUrl?: string | null;
  company?: string | null;
  description?: string | null;
  id?: string;
  jobUrl?: string | null;
  location?: string | null;
  source?: string | null;
  sourceJobId?: string | null;
  title?: string | null;
};

export type DuplicateResult = {
  confidence: number;
  level: DuplicateLevel;
  matchedJobId?: string;
  matchedJobLabel?: string;
  reasons: string[];
};

const legalSuffixes = new Set(["inc", "llc", "ltd", "corp", "corporation", "company", "co"]);
const trackingParams = [/^utm_/i, /^fbclid$/i, /^gclid$/i, /^mc_/i, /^ref$/i, /^source$/i];

function normalizeBasic(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCompany(value?: string | null) {
  return normalizeBasic(value)
    .split(" ")
    .filter((part) => !legalSuffixes.has(part))
    .join(" ")
    .replace(/\band$/g, "")
    .trim();
}

export function normalizeTitle(value?: string | null) {
  return normalizeBasic(value)
    .replace(/\b(sr|snr)\b/g, "senior")
    .replace(/\b(swe|software developer)\b/g, "software engineer")
    .replace(/\b(job|req|requisition)\s*[0-9]+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeLocation(value?: string | null) {
  const normalized = normalizeBasic(value)
    .replace(/\bunited states\b/g, "us")
    .replace(/\busa\b/g, "us")
    .replace(/\bremote anywhere\b/g, "remote")
    .replace(/\bremote us\b/g, "remote");

  return normalized || undefined;
}

export function canonicalizeDuplicateUrl(value?: string | null) {
  if (!value) return undefined;

  try {
    const url = new URL(value);

    url.hash = "";
    url.hostname = url.hostname.toLocaleLowerCase();
    for (const key of [...url.searchParams.keys()]) {
      if (trackingParams.some((pattern) => pattern.test(key))) {
        url.searchParams.delete(key);
      }
    }
    url.searchParams.sort();

    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
    url.pathname = path;

    return url.toString();
  } catch {
    return undefined;
  }
}

export function extractSourceJobId(value?: string | null) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const searchKeys = ["gh_jid", "job_id", "jid", "lever-source-id"];

    for (const key of searchKeys) {
      const found = url.searchParams.get(key);
      if (found) return found;
    }

    const lastPart = pathParts.at(-1);
    if (lastPart && /[a-z0-9-]{5,}/i.test(lastPart)) {
      return lastPart;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function cleanDescription(value?: string | null) {
  return normalizeBasic(value?.replace(/<[^>]+>/g, " "));
}

function tokens(value: string) {
  return new Set(value.split(" ").filter((token) => token.length > 2));
}

export function descriptionSimilarity(left?: string | null, right?: string | null) {
  const leftTokens = tokens(cleanDescription(left));
  const rightTokens = tokens(cleanDescription(right));

  if (leftTokens.size === 0 || rightTokens.size === 0) return 0;

  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;

  return intersection / union;
}

function sameCompanyTitleLocation(candidate: DuplicateJobInput, existing: DuplicateJobInput) {
  const company = normalizeCompany(candidate.company) === normalizeCompany(existing.company);
  const title = normalizeTitle(candidate.title) === normalizeTitle(existing.title);
  const candidateLocation = normalizeLocation(candidate.location);
  const existingLocation = normalizeLocation(existing.location);
  const location = !candidateLocation || !existingLocation || candidateLocation === existingLocation;

  return company && title && location;
}

function jobLabel(job: DuplicateJobInput) {
  return [job.company, job.title].filter(Boolean).join(" - ") || "Saved job";
}

export function detectDuplicates(candidate: DuplicateJobInput, existingJobs: DuplicateJobInput[]): DuplicateResult[] {
  const canonicalUrl = canonicalizeDuplicateUrl(candidate.jobUrl ?? candidate.canonicalUrl);
  const sourceJobId = candidate.sourceJobId ?? extractSourceJobId(candidate.jobUrl);
  const results: DuplicateResult[] = [];

  for (const existing of existingJobs) {
    const reasons: string[] = [];
    let confidence = 0;
    let level: DuplicateLevel = "Safe to continue";
    const existingUrl = canonicalizeDuplicateUrl(existing.jobUrl ?? existing.canonicalUrl);
    const existingSourceJobId = existing.sourceJobId ?? extractSourceJobId(existing.jobUrl);
    const similarity = descriptionSimilarity(candidate.description, existing.description);

    if (canonicalUrl && existingUrl && canonicalUrl === existingUrl) {
      confidence = 100;
      level = "Exact duplicate";
      reasons.push("Same normalized job URL");
    }

    if (sourceJobId && existingSourceJobId && sourceJobId === existingSourceJobId) {
      confidence = Math.max(confidence, 100);
      level = "Exact duplicate";
      reasons.push("Same source job ID");
    }

    if (sameCompanyTitleLocation(candidate, existing)) {
      confidence = Math.max(confidence, 85);
      if (level !== "Exact duplicate") level = "Probable duplicate";
      reasons.push("Same company, title, and location");
    }

    if (similarity >= 0.9) {
      confidence = Math.max(confidence, 90);
      if (level === "Safe to continue") level = "Probable duplicate";
      reasons.push("Highly similar description");
    } else if (similarity >= 0.75) {
      confidence = Math.max(confidence, 70);
      if (level === "Safe to continue") level = "Possible repost";
      reasons.push("Substantially similar description");
    }

    if (level === "Safe to continue" && normalizeCompany(candidate.company) === normalizeCompany(existing.company)) {
      confidence = 25;
      level = "Different role";
      reasons.push("Same company, but title or description differs");
    }

    if (confidence >= 60 || level === "Different role") {
      results.push({
        confidence,
        level,
        matchedJobId: existing.id,
        matchedJobLabel: jobLabel(existing),
        reasons,
      });
    }
  }

  return results.sort((left, right) => right.confidence - left.confidence);
}

export function duplicateSummary(results: DuplicateResult[]) {
  const actionable = results.filter((result) => result.level !== "Different role");

  if (actionable.length === 0) {
    return {
      confidence: 0,
      level: "Safe to continue" as const,
      reasons: ["No meaningful duplicate signals found"],
    };
  }

  return actionable[0];
}

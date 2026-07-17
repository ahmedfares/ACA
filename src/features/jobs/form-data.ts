import { jobInputSchema, type JobInput } from "@/features/jobs/schemas";

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

function optionalDate(formData: FormData, key: string) {
  const value = optionalString(formData, key)?.trim();

  if (!value) {
    return undefined;
  }

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function parseJobFormData(formData: FormData): JobInput {
  return jobInputSchema.parse({
    careerPageUrl: optionalString(formData, "careerPageUrl"),
    company: optionalString(formData, "company"),
    datePosted: optionalDate(formData, "datePosted"),
    description: optionalString(formData, "description"),
    employmentType: optionalString(formData, "employmentType") || undefined,
    jobUrl: optionalString(formData, "jobUrl"),
    location: optionalString(formData, "location"),
    notes: optionalString(formData, "notes"),
    remoteStatus: optionalString(formData, "remoteStatus") || undefined,
    salaryMax: optionalNumber(formData, "salaryMax"),
    salaryMin: optionalNumber(formData, "salaryMin"),
    source: optionalString(formData, "source"),
    sourceJobId: optionalString(formData, "sourceJobId"),
    status: optionalString(formData, "status") || undefined,
    title: optionalString(formData, "title"),
  });
}

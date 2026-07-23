import { applicationStatusInputSchema, type ApplicationStatusInput } from "@/features/applications/schemas";

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function optionalDate(formData: FormData, key: string) {
  const value = optionalString(formData, key)?.trim();

  if (!value) {
    return undefined;
  }

  const parsed = new Date(`${value}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function parseApplicationStatusFormData(formData: FormData): ApplicationStatusInput {
  return applicationStatusInputSchema.parse({
    applicationDate: optionalDate(formData, "applicationDate"),
    applicationUrl: optionalString(formData, "applicationUrl"),
    followUpDate: optionalDate(formData, "followUpDate"),
    notes: optionalString(formData, "notes"),
    recruiterContact: optionalString(formData, "recruiterContact"),
    recruiterName: optionalString(formData, "recruiterName"),
    source: optionalString(formData, "source"),
    status: optionalString(formData, "status"),
  });
}

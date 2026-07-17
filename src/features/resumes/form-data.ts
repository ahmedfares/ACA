import { resumeInputSchema, type ResumeInput } from "@/features/resumes/schemas";

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function parseResumeFormData(formData: FormData): ResumeInput {
  return resumeInputSchema.parse({
    isDefault: checkbox(formData, "isDefault"),
    label: optionalString(formData, "label"),
    rawText: optionalString(formData, "rawText"),
  });
}

export function countResumeWords(rawText?: string | null) {
  return rawText?.trim().split(/\s+/).filter(Boolean).length ?? 0;
}

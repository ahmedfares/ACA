import { approvedAnswerInputSchema, type ApprovedAnswerInput } from "@/features/questions/schemas";

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : undefined;
}

function tagsFrom(value?: string) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export function parseApprovedAnswerFormData(formData: FormData): ApprovedAnswerInput {
  return approvedAnswerInputSchema.parse({
    answer: optionalString(formData, "answer"),
    category: optionalString(formData, "category"),
    question: optionalString(formData, "question"),
    reusePolicy: optionalString(formData, "reusePolicy") || undefined,
    tags: tagsFrom(optionalString(formData, "tags")),
  });
}

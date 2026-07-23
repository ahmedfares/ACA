import type { z } from "zod";

import { AiProviderError } from "@/features/ai/types";

export function parseJsonObject(rawText: string): unknown {
  const trimmed = rawText.trim();

  if (!trimmed) {
    throw new AiProviderError("AI provider returned an empty response.", "validation");
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new AiProviderError("AI provider returned invalid JSON.", "validation", error);
  }
}

export function validateStructuredOutput<T>(schema: z.ZodType<T>, rawText: string): T {
  const parsedJson = parseJsonObject(rawText);
  const parsed = schema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new AiProviderError(parsed.error.issues.map((issue) => issue.message).join(" "), "validation", parsed.error);
  }

  return parsed.data;
}

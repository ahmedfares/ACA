import type { z } from "zod";

export type AiPromptMessage = {
  content: string;
  role: "system" | "user";
};

export type AiPromptDefinition = {
  description: string;
  id: string;
  messages: AiPromptMessage[];
  outputJsonSchema: Record<string, unknown>;
  version: string;
};

export type AiStructuredRequest<T> = {
  maxOutputTokens?: number;
  metadata?: Record<string, string>;
  prompt: AiPromptDefinition;
  schema: z.ZodType<T>;
  temperature?: number;
  timeoutMs?: number;
};

export type AiStructuredResult<T> = {
  data: T;
  model: string;
  promptId: string;
  promptVersion: string;
  rawText: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
};

export interface AiProvider {
  generateStructured<T>(request: AiStructuredRequest<T>): Promise<AiStructuredResult<T>>;
}

export class AiProviderError extends Error {
  constructor(
    message: string,
    readonly code: "configuration" | "network" | "provider" | "validation",
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

import { env } from "@/lib/env";
import { validateStructuredOutput } from "@/features/ai/structured-output";
import { AiProviderError, type AiProvider, type AiStructuredRequest, type AiStructuredResult } from "@/features/ai/types";

type OpenAiProviderOptions = {
  apiKey?: string;
  fetchImpl?: typeof fetch;
  model?: string;
};

type OpenAiUsage = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
};

function extractResponseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === "string") {
    return record.output_text;
  }

  if (Array.isArray(record.output)) {
    for (const item of record.output) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const itemRecord = item as Record<string, unknown>;

      if (!Array.isArray(itemRecord.content)) {
        continue;
      }

      for (const content of itemRecord.content) {
        if (!content || typeof content !== "object") {
          continue;
        }

        const contentRecord = content as Record<string, unknown>;

        if (typeof contentRecord.text === "string") {
          return contentRecord.text;
        }
      }
    }
  }

  return "";
}

function usageFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const usage = (payload as Record<string, unknown>).usage as OpenAiUsage | undefined;

  if (!usage) {
    return undefined;
  }

  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    totalTokens: usage.total_tokens,
  };
}

export class OpenAiProvider implements AiProvider {
  private readonly apiKey?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly model: string;

  constructor(options: OpenAiProviderOptions = {}) {
    this.apiKey = options.apiKey ?? env.OPENAI_API_KEY;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.model = options.model ?? env.AI_MODEL ?? "gpt-4.1-mini";
  }

  async generateStructured<T>(request: AiStructuredRequest<T>): Promise<AiStructuredResult<T>> {
    if (!this.apiKey) {
      throw new AiProviderError("OPENAI_API_KEY is required before AI calls can run.", "configuration");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? 30000);

    try {
      const response = await this.fetchImpl("https://api.openai.com/v1/responses", {
        body: JSON.stringify({
          input: request.prompt.messages,
          max_output_tokens: request.maxOutputTokens ?? 1600,
          metadata: request.metadata,
          model: this.model,
          temperature: request.temperature ?? 0.2,
          text: {
            format: {
              name: request.prompt.id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64),
              schema: request.prompt.outputJsonSchema,
              strict: true,
              type: "json_schema",
            },
          },
        }),
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AiProviderError(`OpenAI request failed with ${response.status}.`, "provider", await response.text());
      }

      const payload: unknown = await response.json();
      const rawText = extractResponseText(payload);
      const data = validateStructuredOutput(request.schema, rawText);

      return {
        data,
        model: this.model,
        promptId: request.prompt.id,
        promptVersion: request.prompt.version,
        rawText,
        usage: usageFromPayload(payload),
      };
    } catch (error) {
      if (error instanceof AiProviderError) {
        throw error;
      }

      throw new AiProviderError("OpenAI request failed.", "network", error);
    } finally {
      clearTimeout(timeout);
    }
  }
}

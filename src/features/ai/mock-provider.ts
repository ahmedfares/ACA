import { validateStructuredOutput } from "@/features/ai/structured-output";
import type { AiProvider, AiStructuredRequest, AiStructuredResult } from "@/features/ai/types";

export class MockAiProvider implements AiProvider {
  constructor(private readonly responses: Record<string, unknown>) {}

  async generateStructured<T>(request: AiStructuredRequest<T>): Promise<AiStructuredResult<T>> {
    const response = this.responses[request.prompt.id];
    const rawText = JSON.stringify(response ?? {});
    const data = validateStructuredOutput(request.schema, rawText);

    return {
      data,
      model: "mock-ai",
      promptId: request.prompt.id,
      promptVersion: request.prompt.version,
      rawText,
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      },
    };
  }
}

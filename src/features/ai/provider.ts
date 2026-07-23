import { env } from "@/lib/env";
import { MockAiProvider } from "@/features/ai/mock-provider";
import { OpenAiProvider } from "@/features/ai/openai-provider";
import { mockJobScore } from "@/features/matching/mock-score";
import type { AiProvider } from "@/features/ai/types";

export function createAiProvider(): AiProvider {
  if (env.AI_PROVIDER === "mock") {
    return new MockAiProvider({
      "job-scoring.v1": mockJobScore,
    });
  }

  return new OpenAiProvider();
}

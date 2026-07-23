import { describe, expect, it, vi } from "vitest";

import { AiProviderError, getPrompt, MockAiProvider, OpenAiProvider, promptIds, promptRegistry } from "@/features/ai";
import { jobScoreSchema } from "@/features/matching";
import { validJobScore } from "./fixtures";

describe("AI provider foundation", () => {
  it("registers documented prompt ids and includes prompt-injection guardrails", () => {
    expect(promptIds).toContain("job-scoring.v1");
    expect(promptIds).toContain("question-answer.v1");
    expect(Object.keys(promptRegistry)).toHaveLength(promptIds.length);
    expect(getPrompt("job-scoring.v1").messages[0].content).toContain("untrusted content");
    expect(getPrompt("job-scoring.v1").messages[0].content).toContain("Never fabricate");
  });

  it("validates mock provider structured responses", async () => {
    const provider = new MockAiProvider({
      "job-scoring.v1": validJobScore,
    });

    const result = await provider.generateStructured({
      prompt: getPrompt("job-scoring.v1"),
      schema: jobScoreSchema,
    });

    expect(result.data.recommendation).toBe("Apply");
    expect(result.model).toBe("mock-ai");
  });

  it("rejects mock provider output that does not match schema", async () => {
    const provider = new MockAiProvider({
      "job-scoring.v1": {
        ...validJobScore,
        overallScore: 200,
      },
    });

    await expect(
      provider.generateStructured({
        prompt: getPrompt("job-scoring.v1"),
        schema: jobScoreSchema,
      }),
    ).rejects.toMatchObject({ code: "validation" });
  });

  it("throws configuration errors before calling OpenAI without a key", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const provider = new OpenAiProvider({ apiKey: "", fetchImpl });

    await expect(
      provider.generateStructured({
        prompt: getPrompt("job-scoring.v1"),
        schema: jobScoreSchema,
      }),
    ).rejects.toBeInstanceOf(AiProviderError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("posts structured-output requests through the OpenAI adapter", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          output_text: JSON.stringify(validJobScore),
          usage: {
            input_tokens: 10,
            output_tokens: 20,
            total_tokens: 30,
          },
        }),
        { status: 200 },
      ),
    );
    const provider = new OpenAiProvider({ apiKey: "test-key", fetchImpl, model: "test-model" });

    const result = await provider.generateStructured({
      prompt: getPrompt("job-scoring.v1"),
      schema: jobScoreSchema,
    });
    const [, init] = fetchImpl.mock.calls[0];
    const body = JSON.parse(String(init?.body));

    expect(result.data.overallScore).toBe(81);
    expect(result.usage?.totalTokens).toBe(30);
    expect(body.model).toBe("test-model");
    expect(body.text.format.type).toBe("json_schema");
    expect(body.text.format.strict).toBe(true);
  });
});

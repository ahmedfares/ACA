import { describe, expect, it } from "vitest";

import { countResumeWords, parseResumeFormData } from "@/features/resumes/form-data";
import { resumeInputSchema } from "@/features/resumes/schemas";

describe("resume schemas", () => {
  it("normalizes resume input", () => {
    const parsed = resumeInputSchema.parse({
      isDefault: true,
      label: "  Primary resume  ",
      rawText: "Senior engineer ".repeat(70),
    });

    expect(parsed.label).toBe("Primary resume");
    expect(parsed.isDefault).toBe(true);
  });

  it("rejects very short resume text", () => {
    const result = resumeInputSchema.safeParse({
      label: "Primary resume",
      rawText: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("parses resume form data", () => {
    const formData = new FormData();

    formData.set("label", "Primary resume");
    formData.set("rawText", "Senior engineer ".repeat(70));
    formData.set("isDefault", "on");

    expect(parseResumeFormData(formData)).toEqual({
      isDefault: true,
      label: "Primary resume",
      rawText: "Senior engineer ".repeat(70).trim(),
    });
    expect(countResumeWords("one two three")).toBe(3);
  });
});

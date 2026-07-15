import { describe, expect, it } from "vitest";

import {
  careerProfileInputSchema,
  preferenceInputSchema,
  replaceSkillsInputSchema,
} from "@/features/profile";

describe("profile schemas", () => {
  it("normalizes career profile text and list fields", () => {
    const parsed = careerProfileInputSchema.parse({
      currentTitle: "  Senior Engineer  ",
      industries: ["Software", "Software", "Cloud"],
      summary: "  ",
    });

    expect(parsed.currentTitle).toBe("Senior Engineer");
    expect(parsed.industries).toEqual(["Software", "Cloud"]);
    expect(parsed.summary).toBeUndefined();
  });

  it("rejects desired compensation below minimum compensation", () => {
    const result = preferenceInputSchema.safeParse({
      desiredCompensation: 100000,
      minCompensation: 120000,
    });

    expect(result.success).toBe(false);
  });

  it("deduplicates replacement skills case-insensitively", () => {
    const parsed = replaceSkillsInputSchema.parse([
      { name: "React", category: "Frontend" },
      { name: "react", category: "Frontend" },
      { name: "Java", category: "Backend" },
    ]);

    expect(parsed.map((skill) => skill.name)).toEqual(["React", "Java"]);
  });
});

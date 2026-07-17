import { describe, expect, it } from "vitest";

import { parseJobFormData } from "@/features/jobs/form-data";
import { canonicalizeUrl, descriptionHash, normalizeText } from "@/features/jobs/normalization";
import { jobInputSchema } from "@/features/jobs/schemas";

describe("job schemas", () => {
  it("normalizes valid manual job input", () => {
    const parsed = jobInputSchema.parse({
      company: "  Acme Cloud  ",
      description: "Senior engineer ".repeat(10),
      employmentType: "Full-time",
      jobUrl: "https://example.com/jobs/123",
      remoteStatus: "Remote",
      salaryMax: 190000,
      salaryMin: 140000,
      title: "  Senior Software Engineer  ",
    });

    expect(parsed.company).toBe("Acme Cloud");
    expect(parsed.title).toBe("Senior Software Engineer");
    expect(parsed.remoteStatus).toBe("Remote");
  });

  it("rejects salary ranges where max is lower than min", () => {
    const result = jobInputSchema.safeParse({
      company: "Acme",
      description: "Senior engineer ".repeat(10),
      salaryMax: 120000,
      salaryMin: 140000,
      title: "Senior Software Engineer",
    });

    expect(result.success).toBe(false);
  });

  it("parses job form data with optional numbers and dates", () => {
    const formData = new FormData();

    formData.set("company", "Acme Cloud");
    formData.set("title", "Senior Software Engineer");
    formData.set("description", "Senior engineer ".repeat(10));
    formData.set("remoteStatus", "Hybrid");
    formData.set("employmentType", "Full-time");
    formData.set("salaryMin", "140000");
    formData.set("salaryMax", "190000");
    formData.set("datePosted", "2026-07-17");

    const parsed = parseJobFormData(formData);

    expect(parsed.company).toBe("Acme Cloud");
    expect(parsed.salaryMin).toBe(140000);
    expect(parsed.salaryMax).toBe(190000);
    expect(parsed.datePosted).toBeInstanceOf(Date);
  });

  it("canonicalizes URLs and hashes descriptions deterministically", () => {
    expect(canonicalizeUrl("https://example.com/jobs?id=2&a=1#details")).toBe("https://example.com/jobs?a=1&id=2");
    expect(normalizeText("A&B Senior Engineer!")).toBe("aandb senior engineer");
    expect(descriptionHash("Senior Engineer")).toBe(descriptionHash(" senior   engineer "));
  });
});

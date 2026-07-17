import { describe, expect, it } from "vitest";

import {
  canonicalizeDuplicateUrl,
  descriptionSimilarity,
  detectDuplicates,
  duplicateSummary,
  extractSourceJobId,
  normalizeCompany,
  normalizeLocation,
  normalizeTitle,
} from "@/features/duplicates";

const baseJob = {
  company: "Acme Cloud Inc.",
  description:
    "Senior Software Engineer building React TypeScript PostgreSQL services, partnering with product, improving systems, and shipping reliable user experiences.",
  id: "job-1",
  jobUrl: "https://boards.greenhouse.io/acme/jobs/12345?utm_source=linkedin",
  location: "Remote US",
  title: "Senior Software Engineer",
};

describe("duplicate detection", () => {
  it("normalizes job identity fields", () => {
    expect(normalizeCompany("Acme & Co. LLC")).toBe("acme");
    expect(normalizeTitle("Sr. SWE Req 123")).toBe("senior software engineer");
    expect(normalizeLocation("Remote United States")).toBe("remote");
    expect(canonicalizeDuplicateUrl("https://EXAMPLE.com/jobs/123/?utm_source=x&b=2&a=1#apply")).toBe(
      "https://example.com/jobs/123?a=1&b=2",
    );
    expect(extractSourceJobId("https://boards.greenhouse.io/acme/jobs/12345?gh_jid=999")).toBe("999");
  });

  it("flags the same URL with tracking parameters as an exact duplicate", () => {
    const results = detectDuplicates(
      {
        ...baseJob,
        jobUrl: "https://boards.greenhouse.io/acme/jobs/12345?utm_campaign=social",
      },
      [baseJob],
    );

    expect(results[0]).toMatchObject({
      confidence: 100,
      level: "Exact duplicate",
      reasons: expect.arrayContaining(["Same normalized job URL"]),
    });
  });

  it("flags the same source job id with a different URL as exact", () => {
    const results = detectDuplicates(
      {
        ...baseJob,
        jobUrl: "https://company.example/careers/software-engineer?gh_jid=12345",
      },
      [{ ...baseJob, jobUrl: "https://boards.greenhouse.io/acme/jobs/888?gh_jid=12345" }],
    );

    expect(results[0]).toMatchObject({
      confidence: 100,
      level: "Exact duplicate",
      reasons: expect.arrayContaining(["Same source job ID"]),
    });
  });

  it("flags same company title location with a similar description as probable", () => {
    const results = detectDuplicates(
      {
        ...baseJob,
        description:
          "Senior software engineer building React TypeScript PostgreSQL services with product partners, improving systems, and shipping reliable customer experiences.",
        jobUrl: "https://example.com/jobs/new",
      },
      [baseJob],
    );

    expect(results[0].level).toBe("Probable duplicate");
    expect(results[0].confidence).toBeGreaterThanOrEqual(85);
    expect(results[0].reasons).toContain("Same company, title, and location");
  });

  it("flags substantially similar descriptions as possible reposts", () => {
    const results = detectDuplicates(
      {
        company: "Other Co",
        description:
          "Senior Software Engineer building React TypeScript PostgreSQL services, partnering with product, improving systems, and shipping reliable user experiences with mentoring leadership analytics dashboards.",
        title: "Product Engineer",
      },
      [baseJob],
    );

    expect(results[0]).toMatchObject({
      level: "Possible repost",
      reasons: expect.arrayContaining(["Substantially similar description"]),
    });
  });

  it("keeps same-company different-role signals below duplicate warnings", () => {
    const results = detectDuplicates(
      {
        company: "Acme Cloud",
        description: "Finance analyst role with forecasting, reporting, budgets, and stakeholder planning.",
        location: "New York",
        title: "Finance Analyst",
      },
      [baseJob],
    );

    expect(results[0]).toMatchObject({
      confidence: 25,
      level: "Different role",
    });
    expect(duplicateSummary(results).level).toBe("Safe to continue");
  });

  it("calculates higher similarity for overlapping descriptions", () => {
    expect(descriptionSimilarity(baseJob.description, baseJob.description)).toBe(1);
    expect(descriptionSimilarity(baseJob.description, "warehouse operations inventory logistics")).toBeLessThan(0.2);
  });
});

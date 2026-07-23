import { describe, expect, it, vi } from "vitest";

import { createApplicationRepository, escapeCsvValue, rowsToCsv } from "@/features/applications";

describe("application tracker", () => {
  it("escapes CSV values safely", () => {
    expect(escapeCsvValue('Acme, "Cloud"\nRole')).toBe('"Acme, ""Cloud""\nRole"');
  });

  it("creates CSV with headers and rows", () => {
    const csv = rowsToCsv(["company", "status"], [["Acme Cloud", "Applied"]]);

    expect(csv).toBe("company,status\nAcme Cloud,Applied");
  });

  it("updates only applications owned by the user", async () => {
    const db = {
      application: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        upsert: vi.fn(),
      },
      applicationMaterial: {
        createMany: vi.fn(),
        deleteMany: vi.fn(),
      },
      applicationQuestion: {
        createMany: vi.fn(),
        deleteMany: vi.fn(),
      },
      approvedAnswer: {
        findMany: vi.fn(),
      },
      careerProfile: {
        findUnique: vi.fn(),
      },
      job: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
      jobScore: {
        findFirst: vi.fn(),
      },
      preference: {
        findUnique: vi.fn(),
      },
      resume: {
        findFirst: vi.fn(),
      },
      skill: {
        findMany: vi.fn(),
      },
    };
    const repository = createApplicationRepository(db as never);

    await repository.updateApplicationStatus("user-1", "application-1", {
      applicationDate: new Date("2026-07-23T00:00:00"),
      applicationUrl: "https://example.com/apply",
      followUpDate: new Date("2026-07-30T00:00:00"),
      notes: "Submitted package.",
      recruiterContact: "recruiter@example.com",
      recruiterName: "Alex",
      source: "Company site",
      status: "Applied",
    });

    expect(db.application.updateMany).toHaveBeenCalledWith({
      data: expect.objectContaining({
        applicationUrl: "https://example.com/apply",
        status: "Applied",
      }),
      where: {
        id: "application-1",
        userId: "user-1",
      },
    });
  });
});

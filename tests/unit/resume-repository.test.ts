import { describe, expect, it, vi } from "vitest";

import { createResumeRepository } from "@/features/resumes/repository";

function createDb(existingCount = 0) {
  return {
    resume: {
      count: vi.fn().mockResolvedValue(existingCount),
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "resume-1", ...data })),
      findFirst: vi.fn().mockResolvedValue({ id: "resume-1", userId: "user-1" }),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockImplementation(({ data, where }) => Promise.resolve({ ...data, ...where })),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    user: {
      upsert: vi.fn(),
    },
  };
}

describe("resume repository", () => {
  it("makes the first saved resume the default", async () => {
    const db = createDb(0);
    const repository = createResumeRepository(db as never);

    const saved = await repository.saveResume("user-1", {
      label: "Primary",
      rawText: "Senior engineer ".repeat(70),
    });

    expect(saved.isDefault).toBe(true);
    expect(db.resume.updateMany).toHaveBeenCalledWith({
      data: { isDefault: false },
      where: { userId: "user-1" },
    });
  });

  it("scopes default changes by user before updating", async () => {
    const db = createDb(2);
    const repository = createResumeRepository(db as never);

    await repository.setDefaultResume("user-1", "resume-1");

    expect(db.resume.findFirst).toHaveBeenCalledWith({
      where: { id: "resume-1", userId: "user-1" },
    });
    expect(db.resume.updateMany).toHaveBeenCalledWith({
      data: { isDefault: false },
      where: { userId: "user-1" },
    });
  });

  it("rejects cross-user default changes", async () => {
    const db = createDb(2);

    db.resume.findFirst.mockResolvedValueOnce(null);

    await expect(createResumeRepository(db as never).setDefaultResume("user-1", "resume-2")).rejects.toThrow(
      "Resume not found for user.",
    );
  });
});

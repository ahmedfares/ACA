import { describe, expect, it, vi } from "vitest";

import { createJobRepository } from "@/features/jobs/repository";

function createDb() {
  return {
    job: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "job-1", ...data })),
      findFirst: vi.fn().mockResolvedValue({ id: "job-1", userId: "user-1" }),
      findMany: vi.fn().mockResolvedValue([]),
    },
    user: {
      upsert: vi.fn(),
    },
  };
}

describe("job repository", () => {
  it("creates jobs scoped to the user with normalized duplicate fields", async () => {
    const db = createDb();
    const repository = createJobRepository(db as never);

    await repository.createJob("user-1", {
      company: "Acme & Co",
      description: "Senior engineer ".repeat(10),
      jobUrl: "https://example.com/jobs?b=2&a=1#details",
      location: "Remote US",
      title: "Senior Software Engineer",
    });

    expect(db.job.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        canonicalUrl: "https://example.com/jobs?a=1&b=2",
        normalizedCompany: "acme and co",
        normalizedLocation: "remote us",
        normalizedTitle: "senior software engineer",
        userId: "user-1",
      }),
    });
  });

  it("lists and reads jobs only through the current user id", async () => {
    const db = createDb();
    const repository = createJobRepository(db as never);

    await repository.listJobs("user-1");
    await repository.getJob("user-1", "job-1");

    expect(db.job.findMany).toHaveBeenCalledWith({
      orderBy: [{ updatedAt: "desc" }],
      where: { userId: "user-1" },
    });
    expect(db.job.findFirst).toHaveBeenCalledWith({
      where: { id: "job-1", userId: "user-1" },
    });
  });
});

import { describe, expect, it } from "vitest";

import { assertUserOwnsRecord, userScopedWhere } from "@/features/profile";

describe("profile ownership helpers", () => {
  it("creates user-scoped where clauses", () => {
    expect(userScopedWhere("profile-1", "user-1")).toEqual({
      id: "profile-1",
      userId: "user-1",
    });
  });

  it("returns records owned by the current user", () => {
    expect(assertUserOwnsRecord({ id: "skill-1", userId: "user-1" }, "user-1")).toEqual({
      id: "skill-1",
      userId: "user-1",
    });
  });

  it("rejects missing or cross-user records", () => {
    expect(() => assertUserOwnsRecord(null, "user-1")).toThrow("Resource not found for user.");
    expect(() => assertUserOwnsRecord({ userId: "user-2" }, "user-1")).toThrow(
      "Resource not found for user.",
    );
  });
});

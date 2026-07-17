import { describe, expect, it } from "vitest";

import { alphaAuthUsersFromEnv, parseAlphaAuthUsers } from "@/lib/alpha-auth";

describe("alpha auth users", () => {
  it("parses distinct tester credentials from JSON", () => {
    expect(
      parseAlphaAuthUsers(
        JSON.stringify([
          { email: "Tester1@Example.com", name: "Tester One", password: "secret-1" },
          { email: "tester2@example.com", id: "custom-user", password: "secret-2" },
        ]),
      ),
    ).toEqual([
      {
        email: "tester1@example.com",
        id: "alpha-tester1-example-com",
        name: "Tester One",
        password: "secret-1",
      },
      {
        email: "tester2@example.com",
        id: "custom-user",
        name: "tester2@example.com",
        password: "secret-2",
      },
    ]);
  });

  it("falls back to the local demo user outside production", () => {
    expect(alphaAuthUsersFromEnv({ NODE_ENV: "development" })).toEqual([
      {
        email: "demo@example.com",
        id: "dev-user",
        name: "Demo User",
        password: "change-me",
      },
    ]);
  });

  it("does not create an implicit production demo user", () => {
    expect(alphaAuthUsersFromEnv({ NODE_ENV: "production" })).toEqual([]);
  });
});

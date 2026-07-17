import { z } from "zod";

export type AlphaAuthUser = {
  email: string;
  id: string;
  name: string;
  password: string;
};

const alphaUserSchema = z.object({
  email: z.string().email(),
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(1),
});

function userIdFromEmail(email: string) {
  return `alpha-${email.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export function parseAlphaAuthUsers(rawValue?: string) {
  if (!rawValue?.trim()) {
    return [];
  }

  const parsed = z.array(alphaUserSchema).safeParse(JSON.parse(rawValue));

  if (!parsed.success) {
    throw new Error("ALPHA_AUTH_USERS must be a JSON array of { email, password, name?, id? } objects.");
  }

  return parsed.data.map((user): AlphaAuthUser => {
    const email = user.email.toLocaleLowerCase();

    return {
      email,
      id: user.id ?? userIdFromEmail(email),
      name: user.name ?? email,
      password: user.password,
    };
  });
}

export function alphaAuthUsersFromEnv(env: NodeJS.ProcessEnv = process.env) {
  const users = parseAlphaAuthUsers(env.ALPHA_AUTH_USERS);

  if (users.length > 0) {
    return users;
  }

  const expectedEmail = env.DEV_AUTH_EMAIL ?? (env.NODE_ENV === "production" ? undefined : "demo@example.com");
  const expectedPassword = env.DEV_AUTH_PASSWORD ?? (env.NODE_ENV === "production" ? undefined : "change-me");

  if (!expectedEmail || !expectedPassword) {
    return [];
  }

  return [
    {
      email: expectedEmail.toLocaleLowerCase(),
      id: "dev-user",
      name: "Demo User",
      password: expectedPassword,
    },
  ];
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    authorized({ auth: session }) {
      return Boolean(session?.user);
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const expectedEmail =
          process.env.DEV_AUTH_EMAIL ?? (process.env.NODE_ENV === "production" ? undefined : "demo@example.com");
        const expectedPassword =
          process.env.DEV_AUTH_PASSWORD ?? (process.env.NODE_ENV === "production" ? undefined : "change-me");

        if (!expectedEmail || !expectedPassword) {
          return null;
        }

        if (parsed.data.email !== expectedEmail || parsed.data.password !== expectedPassword) {
          return null;
        }

        return {
          id: "dev-user",
          email: expectedEmail,
          name: "Demo User",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : "week-2-local-auth-secret"),
  trustHost: true,
});

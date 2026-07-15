import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  AUTH_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.string().default("openai"),
  AI_MODEL: z.string().optional(),
  FILE_STORAGE_PROVIDER: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_URL: process.env.AUTH_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_MODEL: process.env.AI_MODEL,
  FILE_STORAGE_PROVIDER: process.env.FILE_STORAGE_PROVIDER,
});

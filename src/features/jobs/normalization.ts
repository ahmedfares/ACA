import { createHash } from "node:crypto";

export function normalizeText(value?: string | null) {
  return value
    ?.trim()
    .toLocaleLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeUrl(value?: string | null) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    url.hash = "";
    url.searchParams.sort();

    return url.toString();
  } catch {
    return undefined;
  }
}

export function descriptionHash(description: string) {
  return createHash("sha256").update(normalizeText(description) ?? description).digest("hex");
}

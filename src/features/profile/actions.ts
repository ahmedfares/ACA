"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { parseProfileFormData } from "@/features/profile/form-data";
import { profileRepository } from "@/features/profile/repository";

export type ProfileFormState = {
  error?: string;
  success?: string;
};

function humanizeZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function saveProfileForm(_: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to save your profile." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "Profile persistence needs DATABASE_URL. Configure PostgreSQL before saving profile data.",
    };
  }

  try {
    const parsed = parseProfileFormData(formData);

    await profileRepository.ensureUser(session.user);
    await profileRepository.upsertCareerProfile(session.user.id, parsed.careerProfile);
    await profileRepository.upsertPreference(session.user.id, parsed.preference);
    await profileRepository.replaceSkills(session.user.id, parsed.skills);

    revalidatePath("/profile");
    revalidatePath("/onboarding");

    return { success: "Profile saved." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: humanizeZodError(error) };
    }

    return { error: "Profile could not be saved. Check your database connection and try again." };
  }
}

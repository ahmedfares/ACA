"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { parseResumeFormData } from "@/features/resumes/form-data";
import { resumeRepository } from "@/features/resumes/repository";

export type ResumeFormState = {
  error?: string;
  success?: string;
};

function humanizeZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function saveResumeForm(_: ResumeFormState, formData: FormData): Promise<ResumeFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to save a resume." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "Resume persistence needs DATABASE_URL. Configure PostgreSQL before saving resume versions.",
    };
  }

  try {
    const parsed = parseResumeFormData(formData);

    await resumeRepository.ensureUser(session.user);
    await resumeRepository.saveResume(session.user.id, parsed);
    revalidatePath("/resume");

    return { success: "Resume saved." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: humanizeZodError(error) };
    }

    return { error: "Resume could not be saved. Check your database connection and try again." };
  }
}

export async function setDefaultResumeForm(formData: FormData): Promise<void> {
  const session = await auth();
  const resumeId = formData.get("resumeId");

  if (!session?.user?.id || typeof resumeId !== "string" || !process.env.DATABASE_URL) {
    return;
  }

  await resumeRepository.setDefaultResume(session.user.id, resumeId);
  revalidatePath("/resume");
}

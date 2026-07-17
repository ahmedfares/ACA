"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { parseJobFormData } from "@/features/jobs/form-data";
import { jobRepository } from "@/features/jobs/repository";

export type JobFormState = {
  error?: string;
  success?: string;
};

function humanizeZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function createJobForm(_: JobFormState, formData: FormData): Promise<JobFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to add a job." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "Job persistence needs DATABASE_URL. Configure PostgreSQL before saving jobs.",
    };
  }

  let jobId: string;

  try {
    const parsed = parseJobFormData(formData);

    await jobRepository.ensureUser(session.user);
    const job = await jobRepository.createJob(session.user.id, parsed);
    jobId = job.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: humanizeZodError(error) };
    }

    return { error: "Job could not be saved. Check your database connection and try again." };
  }

  revalidatePath("/jobs");
  redirect(`/top-matches?capturedJobId=${jobId}`);
}

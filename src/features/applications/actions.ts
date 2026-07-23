"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { createAiProvider } from "@/features/ai";
import { parseApplicationStatusFormData } from "@/features/applications/form-data";
import { applicationRepository } from "@/features/applications/repository";
import { generateApplicationPackage } from "@/features/applications/service";

export type ApplicationPackageFormState = {
  error?: string;
  success?: string;
};

export type ApplicationStatusFormState = {
  error?: string;
  success?: string;
};

function humanizeZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function generateApplicationPackageForm(
  _: ApplicationPackageFormState,
  formData: FormData,
): Promise<ApplicationPackageFormState> {
  const session = await auth();
  const jobId = formData.get("jobId");

  if (!session?.user?.id) {
    return { error: "You must be signed in to generate an application package." };
  }

  if (typeof jobId !== "string") {
    return { error: "Job is required." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "Application packages need DATABASE_URL. Configure PostgreSQL before generating drafts.",
    };
  }

  try {
    await generateApplicationPackage({
      jobId,
      provider: createAiProvider(),
      userId: session.user.id,
    });
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/review");

    return { success: "Application package generated." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Application package could not be generated." };
  }
}

export async function updateApplicationStatusForm(
  _: ApplicationStatusFormState,
  formData: FormData,
): Promise<ApplicationStatusFormState> {
  const session = await auth();
  const applicationId = formData.get("applicationId");

  if (!session?.user?.id) {
    return { error: "You must be signed in to update an application." };
  }

  if (typeof applicationId !== "string") {
    return { error: "Application is required." };
  }

  if (!process.env.DATABASE_URL) {
    return { error: "Application tracking needs DATABASE_URL." };
  }

  try {
    const parsed = parseApplicationStatusFormData(formData);
    const result = await applicationRepository.updateApplicationStatus(session.user.id, applicationId, parsed);

    if (result.count === 0) {
      return { error: "Application was not found." };
    }

    revalidatePath("/applications");

    return { success: "Application status updated." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: humanizeZodError(error) };
    }

    return { error: "Application could not be updated." };
  }
}

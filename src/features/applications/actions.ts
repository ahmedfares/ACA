"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { createAiProvider } from "@/features/ai";
import { generateApplicationPackage } from "@/features/applications/service";

export type ApplicationPackageFormState = {
  error?: string;
  success?: string;
};

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

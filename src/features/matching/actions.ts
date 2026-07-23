"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { createAiProvider, AiProviderError } from "@/features/ai";
import { scoreJob } from "@/features/matching/service";

export type ScoreJobFormState = {
  error?: string;
};

export async function scoreJobForm(_: ScoreJobFormState, formData: FormData): Promise<ScoreJobFormState> {
  const session = await auth();
  const jobId = formData.get("jobId");

  if (!session?.user?.id) {
    return { error: "You must be signed in to score a job." };
  }

  if (typeof jobId !== "string" || jobId.length === 0) {
    return { error: "Job id is required." };
  }

  try {
    await scoreJob({
      jobId,
      provider: createAiProvider(),
      userId: session.user.id,
    });
  } catch (error) {
    if (error instanceof AiProviderError && error.code === "configuration") {
      return { error: "AI scoring needs OPENAI_API_KEY or AI_PROVIDER=mock before it can run." };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Job could not be scored. Try again after checking AI configuration." };
  }

  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}

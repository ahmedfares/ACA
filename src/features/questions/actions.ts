"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { parseApprovedAnswerFormData } from "@/features/questions/form-data";
import { questionRepository } from "@/features/questions/repository";

export type ApprovedAnswerFormState = {
  error?: string;
  success?: string;
};

function humanizeZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

export async function saveApprovedAnswerForm(
  _: ApprovedAnswerFormState,
  formData: FormData,
): Promise<ApprovedAnswerFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to save an answer." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error: "Question Bank persistence needs DATABASE_URL. Configure PostgreSQL before saving approved answers.",
    };
  }

  try {
    const parsed = parseApprovedAnswerFormData(formData);

    await questionRepository.ensureUser(session.user);
    await questionRepository.saveApprovedAnswer(session.user.id, parsed);
    revalidatePath("/question-bank");

    return { success: "Approved answer saved." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: humanizeZodError(error) };
    }

    return { error: "Approved answer could not be saved. Check your database connection and try again." };
  }
}

export async function deleteApprovedAnswerForm(formData: FormData): Promise<void> {
  const session = await auth();
  const answerId = formData.get("answerId");

  if (!session?.user?.id || typeof answerId !== "string" || !process.env.DATABASE_URL) {
    return;
  }

  await questionRepository.deleteApprovedAnswer(session.user.id, answerId);
  revalidatePath("/question-bank");
}

export async function recordQuestionMatchForm(formData: FormData): Promise<void> {
  const session = await auth();
  const answerId = formData.get("answerId");
  const question = formData.get("question");
  const score = Number(formData.get("score"));
  const strategy = formData.get("strategy");

  if (
    !session?.user?.id ||
    typeof answerId !== "string" ||
    typeof question !== "string" ||
    typeof strategy !== "string" ||
    !Number.isFinite(score) ||
    !process.env.DATABASE_URL
  ) {
    return;
  }

  await questionRepository.recordMatch(session.user.id, {
    answerId,
    question,
    score,
    strategy,
  });
  revalidatePath("/question-bank");
}

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { reviewQueueRepository } from "@/features/review-queue/repository";

export async function resolveReviewItemForm(formData: FormData): Promise<void> {
  const session = await auth();
  const itemId = formData.get("itemId");
  const resolution = formData.get("resolution");

  if (!session?.user?.id || typeof itemId !== "string" || typeof resolution !== "string") {
    return;
  }

  await reviewQueueRepository.resolveItem(session.user.id, itemId, resolution);
  revalidatePath("/review");
  revalidatePath("/dashboard");
}

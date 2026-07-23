import { auth } from "@/auth";
import { ReviewQueueView } from "@/components/review-queue/review-queue-view";
import { reviewQueueRepository } from "@/features/review-queue/repository";

export default async function ReviewPage() {
  const session = await auth();
  const items =
    session?.user?.id && process.env.DATABASE_URL ? await reviewQueueRepository.listOpenItems(session.user.id) : [];

  return <ReviewQueueView items={items} />;
}

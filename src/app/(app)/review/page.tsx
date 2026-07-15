import { ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function ReviewPage() {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Review queue"
      description="Low-confidence answers, duplicate decisions, and missing information will land here once the review queue module is built."
    />
  );
}

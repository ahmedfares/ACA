import { ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function ReviewPage() {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Review queue"
      status="Planned Week 12"
      description="Nothing is broken here: review decisions come after scoring and question memory. For Week 8, use Jobs to capture roles and understand duplicate signals."
      primaryAction={{ href: "/jobs", label: "Review duplicate signals" }}
    />
  );
}

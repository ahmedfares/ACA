import { BriefcaseBusiness } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function JobsPage() {
  return (
    <EmptyState
      icon={BriefcaseBusiness}
      title="Jobs"
      description="Manual job entry, job descriptions, URLs, sources, and duplicate warnings are scheduled for Week 7 and Week 8."
    />
  );
}

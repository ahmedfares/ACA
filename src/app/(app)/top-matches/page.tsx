import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function TopMatchesPage() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Top matches"
      status="Planned Week 11"
      description="This page is intentionally paused during the Week 8 alpha. Add jobs now; ranked Apply / Review / Skip recommendations arrive after the Week 9-10 scoring foundation."
      primaryAction={{ href: "/jobs", label: "Add jobs first" }}
    />
  );
}

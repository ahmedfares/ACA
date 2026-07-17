import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default async function TopMatchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ capturedJobId?: string }>;
}) {
  const params = await searchParams;
  const description = params?.capturedJobId
    ? "Job captured. This page is intentionally paused during the Week 8 alpha; ranked Apply / Review / Skip recommendations arrive after the Week 9-10 scoring foundation."
    : "This page is intentionally paused during the Week 8 alpha. Add jobs now; ranked Apply / Review / Skip recommendations arrive after the Week 9-10 scoring foundation.";

  return (
    <EmptyState
      icon={Sparkles}
      title="Top matches"
      status="Planned Week 11"
      description={description}
      primaryAction={{ href: "/jobs", label: "Add jobs first" }}
    />
  );
}

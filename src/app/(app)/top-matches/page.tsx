import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default async function TopMatchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ capturedJobId?: string }>;
}) {
  const params = await searchParams;
  const description = params?.capturedJobId
    ? "Job captured. This page is intentionally paused during the current alpha; ranked Apply / Review / Skip recommendations arrive after the Week 10 scoring slice."
    : "This page is intentionally paused during the current alpha. Add jobs now; ranked Apply / Review / Skip recommendations arrive after the Week 10 scoring slice.";

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

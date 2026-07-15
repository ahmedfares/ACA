import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function TopMatchesPage() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Top matches"
      description="Ranked matches will appear here after job scoring is implemented. Hard criteria and top-10 ranking come in the matching phase."
    />
  );
}

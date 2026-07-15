import { UserRound } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function ProfilePage() {
  return (
    <EmptyState
      icon={UserRound}
      title="Career profile"
      description="This workspace is ready for the Week 4 profile workflow: structured career facts, preferences, skills, deal-breakers, and user-specific application instructions."
    />
  );
}

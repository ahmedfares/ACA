import { Settings } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function SettingsPage() {
  return (
    <EmptyState
      icon={Settings}
      title="Settings"
      description="Account settings, exports, privacy controls, and deployment-era configuration notes will be added as the MVP matures."
    />
  );
}

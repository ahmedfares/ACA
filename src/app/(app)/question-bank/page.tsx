import { FileQuestion } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function QuestionBankPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Question bank"
      status="Planned Week 13"
      description="Approved reusable answers are not part of the Week 8 alpha. Build your profile and resume first so future answers stay truthful and grounded."
      primaryAction={{ href: "/profile", label: "Strengthen profile context" }}
    />
  );
}

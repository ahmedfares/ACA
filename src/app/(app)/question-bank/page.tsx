import { FileQuestion } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function QuestionBankPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Question bank"
      description="Approved reusable answers will be managed here after the question memory workflow is implemented."
    />
  );
}

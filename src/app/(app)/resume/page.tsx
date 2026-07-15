import { FileText } from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";

export default function ResumePage() {
  return (
    <EmptyState
      icon={FileText}
      title="Resume"
      description="Resume storage begins in Week 6. This page will hold pasted resume text, uploaded files, extracted text, and the default resume version."
    />
  );
}

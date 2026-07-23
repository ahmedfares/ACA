import type { ApplicationPackage } from "@/features/applications/schemas";

function cleanSentence(value: string) {
  return value.trim().replace(/[.?!]+$/g, "");
}

function sentenceList(values: string[]) {
  return values.map(cleanSentence).join("; ");
}

export function applicationPackageReviewDecision(input: { jobId: string; pkg: ApplicationPackage }) {
  const reasons: string[] = [];

  if (input.pkg.confidence < 85) {
    reasons.push(`Package confidence is ${input.pkg.confidence}%, below the direct-submit threshold.`);
  }

  if (input.pkg.reviewNotes.length > 0) {
    reasons.push(`Review notes: ${sentenceList(input.pkg.reviewNotes.slice(0, 3))}.`);
  }

  const questionReviewCount = input.pkg.questions.filter((question) => question.status === "NeedsReview" || question.confidence < 85).length;

  if (questionReviewCount > 0) {
    reasons.push(`${questionReviewCount} application answer${questionReviewCount === 1 ? " needs" : "s need"} review.`);
  }

  return {
    confidence: input.pkg.confidence,
    priority: input.pkg.confidence < 70 || questionReviewCount > 0 ? 1 : 2,
    recommendation: "Review",
    relatedJobId: input.jobId,
    requiredAction: reasons.length > 0 ? reasons.join(" ") : "Application package is ready for final review.",
    shouldCreate: reasons.length > 0,
    type: "ApplicationPackageReview",
  };
}

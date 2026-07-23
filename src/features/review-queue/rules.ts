import type { JobScore } from "@/features/matching";

export type ReviewQueueInput = {
  jobId: string;
  score: JobScore;
  userId: string;
};

export type ReviewQueueDecision = {
  confidence?: number;
  priority: number;
  recommendation?: string;
  relatedJobId: string;
  requiredAction: string;
  shouldCreate: boolean;
  type: string;
};

export function reviewDecisionForJobScore({ jobId, score }: ReviewQueueInput): ReviewQueueDecision {
  const reasons: string[] = [];

  if (score.recommendation === "Review") {
    reasons.push("Score recommendation is Review.");
  }

  if (score.confidence < 85) {
    reasons.push(`Confidence is ${score.confidence}%, below the 85% direct-action threshold.`);
  }

  if (score.missingInformation.length > 0) {
    reasons.push(`Missing information: ${score.missingInformation.slice(0, 3).join("; ")}.`);
  }

  if (score.concerns.length > 0) {
    reasons.push(`Concerns: ${score.concerns.slice(0, 3).join("; ")}.`);
  }

  const priority = score.confidence < 60 || score.recommendation === "Review" ? 1 : score.confidence < 85 ? 2 : 3;

  return {
    confidence: score.confidence,
    priority,
    recommendation: score.recommendation,
    relatedJobId: jobId,
    requiredAction: reasons.length > 0 ? reasons.join(" ") : "No review needed.",
    shouldCreate: reasons.length > 0,
    type: "JobScoreReview",
  };
}

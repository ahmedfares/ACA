export type ScoredJobForRanking = {
  company: string;
  confidence: number;
  createdAt: Date | string;
  hardCriteriaResult: string;
  id: string;
  jobId: string;
  location?: string | null;
  overall: number;
  recommendation: string;
  reasonsToApply: string[];
  title: string;
};

export type RankedJobMatch = ScoredJobForRanking & {
  rank: number;
};

const ineligibleRecommendations = new Set(["Disqualified", "Skip"]);

export function rankTopMatches(scores: ScoredJobForRanking[], limit = 10): RankedJobMatch[] {
  return scores
    .filter((score) => score.hardCriteriaResult !== "Disqualified")
    .filter((score) => !ineligibleRecommendations.has(score.recommendation))
    .sort((left, right) => {
      if (right.overall !== left.overall) return right.overall - left.overall;
      if (right.confidence !== left.confidence) return right.confidence - left.confidence;

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })
    .slice(0, limit)
    .map((score, index) => ({
      ...score,
      rank: index + 1,
    }));
}

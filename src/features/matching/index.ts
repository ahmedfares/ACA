export { evaluateHardCriteria, type HardCriteriaEvaluation } from "@/features/matching/hard-criteria";
export { rankTopMatches, type RankedJobMatch, type ScoredJobForRanking } from "@/features/matching/ranking";
export { createMatchingRepository, matchingRepository } from "@/features/matching/repository";
export {
  hardCriteriaResultSchema,
  jobRecommendationSchema,
  jobScoreJsonSchema,
  jobScoreSchema,
  type JobScore,
} from "@/features/matching/schemas";
export { scoreJob } from "@/features/matching/service";

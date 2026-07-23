import { getPrompt, type AiProvider } from "@/features/ai";
import { applicationPackageReviewDecision } from "@/features/applications/review";
import { applicationRepository, packageContextForPrompt } from "@/features/applications/repository";
import { applicationPackageSchema } from "@/features/applications/schemas";
import { reviewQueueRepository } from "@/features/review-queue/repository";

type GenerateApplicationPackageOptions = {
  jobId: string;
  provider: AiProvider;
  repository?: typeof applicationRepository;
  reviewRepository?: typeof reviewQueueRepository;
  userId: string;
};

export async function generateApplicationPackage({
  jobId,
  provider,
  repository = applicationRepository,
  reviewRepository = reviewQueueRepository,
  userId,
}: GenerateApplicationPackageOptions) {
  const context = await repository.getPackageContext(userId, jobId);

  if (!context.job) {
    throw new Error("Job was not found.");
  }

  if (!context.careerProfile || !context.preference || !context.defaultResume) {
    throw new Error("Complete your profile, preferences, and default resume before generating packages.");
  }

  if (!context.latestScore) {
    throw new Error("Score this job before generating an application package.");
  }

  const promptTemplate = getPrompt("application-package.v1");
  const prompt = {
    ...promptTemplate,
    messages: [
      ...promptTemplate.messages,
      {
        content: [
          "Generate one truthful package for the following job.",
          "Use approved answer memory only when it directly matches. Mark low-confidence answers NeedsReview.",
          "Trusted and untrusted inputs follow as JSON.",
          packageContextForPrompt(context),
        ].join("\n"),
        role: "user" as const,
      },
    ],
  };
  const result = await provider.generateStructured({
    maxOutputTokens: 2800,
    metadata: {
      jobId,
      promptId: prompt.id,
      userId,
    },
    prompt,
    schema: applicationPackageSchema,
  });
  const persisted = await repository.savePackage(userId, jobId, context.defaultResume.id, result.data, {
    model: result.model,
    promptVersion: result.promptVersion,
  });
  const reviewItem = await reviewRepository.createOrUpdateReviewItem(
    userId,
    applicationPackageReviewDecision({ jobId, pkg: result.data }),
  );

  return {
    package: result.data,
    persisted,
    reviewItem,
  };
}

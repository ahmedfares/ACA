import { getPrompt, type AiProvider } from "@/features/ai";
import { evaluateHardCriteria } from "@/features/matching/hard-criteria";
import { matchingRepository, type ScoreContext } from "@/features/matching/repository";
import { jobScoreSchema, type JobScore } from "@/features/matching/schemas";

type ScoreJobOptions = {
  provider: AiProvider;
  repository?: typeof matchingRepository;
  userId: string;
  jobId: string;
};

function compactText(value?: string | null, maxLength = 6000) {
  const text = (value ?? "").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

function buildScoringInput(context: NonNullable<ScoreContext>) {
  return JSON.stringify(
    {
      trustedProfile: context.careerProfile,
      trustedPreferences: context.preference,
      trustedResume: {
        label: context.defaultResume?.label,
        rawText: compactText(context.defaultResume?.rawText),
      },
      trustedSkills: context.skills,
      untrustedJob: {
        company: context.job?.company,
        description: compactText(context.job?.description),
        employmentType: context.job?.employmentType,
        location: context.job?.location,
        remoteStatus: context.job?.remoteStatus,
        salaryMax: context.job?.salaryMax,
        salaryMin: context.job?.salaryMin,
        title: context.job?.title,
      },
    },
    null,
    2,
  );
}

function applyHardCriteria(score: JobScore, hardCriteria: JobScore["hardCriteria"]): JobScore {
  if (hardCriteria.result !== "Disqualified") {
    return {
      ...score,
      hardCriteria,
    };
  }

  return {
    ...score,
    hardCriteria,
    overallScore: Math.min(score.overallScore, 35),
    recommendation: "Disqualified",
    reasonsToSkip: Array.from(new Set([...hardCriteria.violations, ...score.reasonsToSkip])).slice(0, 5),
  };
}

export async function scoreJob({ jobId, provider, repository = matchingRepository, userId }: ScoreJobOptions) {
  const context = await repository.getScoreContext(userId, jobId);

  if (!context.job) {
    throw new Error("Job was not found.");
  }

  if (!context.careerProfile || !context.preference || !context.defaultResume) {
    throw new Error("Complete your profile and default resume before scoring jobs.");
  }

  const promptTemplate = getPrompt("job-scoring.v1");
  const hardCriteria = evaluateHardCriteria(context.job, context.preference);
  const prompt = {
    ...promptTemplate,
    messages: [
      ...promptTemplate.messages,
      {
        content: [
          "Trusted and untrusted scoring inputs follow as JSON.",
          "The hard criteria pre-check result is trusted and must be reflected in the final output.",
          JSON.stringify({ hardCriteria }, null, 2),
          buildScoringInput(context),
        ].join("\n"),
        role: "user" as const,
      },
    ],
  };
  const result = await provider.generateStructured({
    metadata: {
      jobId,
      promptId: prompt.id,
      userId,
    },
    prompt,
    schema: jobScoreSchema,
  });
  const finalScore = applyHardCriteria(result.data, hardCriteria);
  const persisted = await repository.createJobScore(userId, jobId, finalScore, {
    model: result.model,
    promptVersion: result.promptVersion,
  });

  return {
    persisted,
    score: finalScore,
  };
}

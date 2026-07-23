CREATE TABLE "JobScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "hardCriteriaResult" TEXT NOT NULL,
    "hardCriteria" JSONB NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gaps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "concerns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "missingInformation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reasonsToApply" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reasonsToSkip" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "promptVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobScore_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "JobScore_userId_jobId_createdAt_idx" ON "JobScore"("userId", "jobId", "createdAt");

ALTER TABLE "JobScore" ADD CONSTRAINT "JobScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "JobScore" ADD CONSTRAINT "JobScore_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

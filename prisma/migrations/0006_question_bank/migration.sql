CREATE TABLE "ApprovedAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "normalizedQuestion" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reusePolicy" TEXT NOT NULL DEFAULT 'Adapt before use',
    "status" TEXT NOT NULL DEFAULT 'Approved',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovedAnswer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuestionMatch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "approvedAnswerId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "normalizedQuestion" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionMatch_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApprovedAnswer_userId_normalizedQuestion_key" ON "ApprovedAnswer"("userId", "normalizedQuestion");
CREATE INDEX "ApprovedAnswer_userId_category_idx" ON "ApprovedAnswer"("userId", "category");
CREATE INDEX "ApprovedAnswer_userId_updatedAt_idx" ON "ApprovedAnswer"("userId", "updatedAt");
CREATE INDEX "QuestionMatch_userId_normalizedQuestion_idx" ON "QuestionMatch"("userId", "normalizedQuestion");
CREATE INDEX "QuestionMatch_userId_approvedAnswerId_createdAt_idx" ON "QuestionMatch"("userId", "approvedAnswerId", "createdAt");

ALTER TABLE "ApprovedAnswer" ADD CONSTRAINT "ApprovedAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionMatch" ADD CONSTRAINT "QuestionMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuestionMatch" ADD CONSTRAINT "QuestionMatch_approvedAnswerId_fkey" FOREIGN KEY ("approvedAnswerId") REFERENCES "ApprovedAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Week 7 manual job management.
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "remoteStatus" TEXT,
    "employmentType" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "jobUrl" TEXT,
    "canonicalUrl" TEXT,
    "source" TEXT,
    "sourceJobId" TEXT,
    "description" TEXT NOT NULL,
    "dateFound" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datePosted" TIMESTAMP(3),
    "careerPageUrl" TEXT,
    "notes" TEXT,
    "normalizedCompany" TEXT,
    "normalizedTitle" TEXT,
    "normalizedLocation" TEXT,
    "descriptionHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Discovered',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Job_userId_canonicalUrl_idx" ON "Job"("userId", "canonicalUrl");
CREATE INDEX "Job_userId_source_sourceJobId_idx" ON "Job"("userId", "source", "sourceJobId");
CREATE INDEX "Job_userId_normalizedCompany_normalizedTitle_normalizedLocation_idx" ON "Job"("userId", "normalizedCompany", "normalizedTitle", "normalizedLocation");
CREATE INDEX "Job_userId_descriptionHash_idx" ON "Job"("userId", "descriptionHash");
CREATE INDEX "Job_userId_status_updatedAt_idx" ON "Job"("userId", "status", "updatedAt");

ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

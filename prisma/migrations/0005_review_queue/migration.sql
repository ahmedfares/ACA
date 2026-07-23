CREATE TABLE "ReviewQueueItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "relatedJobId" TEXT,
    "recommendation" TEXT,
    "confidence" INTEGER,
    "requiredAction" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewQueueItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReviewQueueItem_userId_status_priority_idx" ON "ReviewQueueItem"("userId", "status", "priority");
CREATE INDEX "ReviewQueueItem_userId_relatedJobId_idx" ON "ReviewQueueItem"("userId", "relatedJobId");

ALTER TABLE "ReviewQueueItem" ADD CONSTRAINT "ReviewQueueItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReviewQueueItem" ADD CONSTRAINT "ReviewQueueItem_relatedJobId_fkey" FOREIGN KEY ("relatedJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

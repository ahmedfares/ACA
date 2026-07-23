# Domain Model and Database Design

## Entity Summary

- `User`: account owner.
- `CareerProfile`: structured career and preference summary.
- `Preference`: target-job criteria and deal-breakers.
- `Skill`: user skills with optional category and proficiency.
- `Resume`: resume versions and extracted text.
- `Job`: manually entered or imported job.
- `JobScore`: structured scoring result for a job.
- `Application`: tracked application lifecycle.
- `ApplicationMaterial`: generated or approved content for a job.
- `ApplicationQuestion`: question encountered for an application.
- `ApprovedAnswer`: reusable user-approved answer.
- `QuestionMatch`: reuse/adaptation record.
- `ReviewQueueItem`: user decision item.
- `DuplicateMatch`: duplicate analysis between jobs/applications.
- `ActivityEvent`: product analytics and audit-style events.

## Implementation Status

Weeks 7, 10, 12, 13, and 14 implement the current product data models: `CareerProfile`, `Preference`, `Skill`, `Resume`, `Job`, `JobScore`, `ReviewQueueItem`, `ApprovedAnswer`, `QuestionMatch`, `Application`, `ApplicationMaterial`, and `ApplicationQuestion`, alongside the Auth.js account/session tables from Week 2. Later weeks will add application status workflows, duplicate match persistence, exports, and activity events.

## Ownership Rules

Every user-owned table includes `userId`. Queries must filter by `userId`; IDs alone are never sufficient. Child records inherit ownership from their parent and still store `userId` for simpler authorization and indexes.

## Important Indexes and Constraints

- `Job(userId, canonicalUrl)`
- `Job(userId, source, sourceJobId)`
- `Job(userId, normalizedCompany, normalizedTitle, normalizedLocation)`
- `Job(userId, descriptionHash)`
- `Application(userId, jobId)` unique
- `Resume(userId, isDefault)`
- `ApprovedAnswer(userId, normalizedQuestion)`
- `ReviewQueueItem(userId, status, priority)`

## Data Retention

Phase 1 should support basic deletion of user jobs, resumes, applications, and answers. Account deletion should hard-delete or anonymize user-owned records. AI logs must not store raw resumes or full job descriptions unless explicitly needed and disclosed.

## Initial Prisma Schema

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  profiles        CareerProfile[]
  preferences     Preference[]
  skills          Skill[]
  resumes         Resume[]
  jobs            Job[]
  jobScores       JobScore[]
  applications    Application[]
  approvedAnswers ApprovedAnswer[]
  reviewItems     ReviewQueueItem[]
  events          ActivityEvent[]
}

model CareerProfile {
  id              String   @id @default(cuid())
  userId          String
  currentTitle    String?
  yearsExperience Int?
  summary         String?
  workHistory     Json?
  education       Json?
  certifications  Json?
  achievements    Json?
  industries      String[]
  leadership      String?
  instructions    String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Preference {
  id                String   @id @default(cuid())
  userId            String
  preferredTitles   String[]
  minCompensation   Int?
  desiredCompensation Int?
  preferredLocations String[]
  remotePreference  String?
  employmentTypes   String[]
  workAuthorization String?
  sponsorship       String?
  relocation        String?
  travel            String?
  dealBreakers      String[]
  targetCompanies   String[]
  excludedCompanies String[]
  preferredSkills   String[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Skill {
  id          String   @id @default(cuid())
  userId      String
  name        String
  category    String?
  proficiency String?
  years       Int?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, name])
}

model Resume {
  id            String   @id @default(cuid())
  userId        String
  label         String
  fileUrl       String?
  fileName      String?
  contentType   String?
  rawText       String?
  extractedJson Json?
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  applications  Application[]
}

model Job {
  id                String   @id @default(cuid())
  userId            String
  company           String
  title             String
  location          String?
  remoteStatus      String?
  employmentType    String?
  salaryMin         Int?
  salaryMax         Int?
  jobUrl            String?
  canonicalUrl      String?
  source            String?
  sourceJobId       String?
  description       String
  dateFound         DateTime @default(now())
  datePosted        DateTime?
  careerPageUrl     String?
  notes             String?
  normalizedCompany String?
  normalizedTitle   String?
  normalizedLocation String?
  descriptionHash   String?
  status            String   @default("Discovered")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  scores            JobScore[]
  applications      Application[]
  duplicateMatches  DuplicateMatch[] @relation("DuplicateJob")
  @@index([userId, canonicalUrl])
  @@index([userId, source, sourceJobId])
  @@index([userId, normalizedCompany, normalizedTitle, normalizedLocation])
  @@index([userId, descriptionHash])
}

model JobScore {
  id                  String   @id @default(cuid())
  userId              String
  jobId               String
  overall             Int
  recommendation      String
  confidence          Int
  hardCriteriaResult  String
  scoreBreakdown      Json
  strengths           String[]
  gaps                String[]
  concerns            String[]
  missingInformation  String[]
  reasonsToApply      String[]
  reasonsToSkip       String[]
  promptVersion       String
  model               String
  createdAt           DateTime @default(now())
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  job                 Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  @@index([userId, jobId])
}

model Application {
  id                String   @id @default(cuid())
  userId            String
  jobId             String
  resumeId          String?
  status            String   @default("Discovered")
  applicationDate   DateTime?
  source            String?
  applicationUrl    String?
  followUpDate      DateTime?
  recruiterName     String?
  recruiterContact  String?
  notes             String?
  lastUpdatedAt     DateTime @updatedAt
  createdAt         DateTime @default(now())
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  job               Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  resume            Resume?  @relation(fields: [resumeId], references: [id])
  materials         ApplicationMaterial[]
  questions         ApplicationQuestion[]
  @@unique([userId, jobId])
  @@index([userId, status])
}

model ApplicationMaterial {
  id            String   @id @default(cuid())
  userId        String
  applicationId String
  type          String
  content       String
  status        String   @default("Draft")
  promptVersion String?
  model         String?
  createdAt     DateTime @default(now())
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
}

model ApplicationQuestion {
  id            String   @id @default(cuid())
  userId        String
  applicationId String
  originalText  String
  normalizedText String
  category      String?
  answerText    String?
  status        String   @default("NeedsReview")
  confidence    Int?
  createdAt     DateTime @default(now())
  application   Application @relation(fields: [applicationId], references: [id], onDelete: Cascade)
}

model ApprovedAnswer {
  id                    String   @id @default(cuid())
  userId                String
  originalQuestion      String
  normalizedQuestion    String
  answer                String
  category              String?
  tags                  String[]
  confidence            Int?
  approvalStatus        String   @default("Approved")
  canAutoReuse          Boolean  @default(false)
  alwaysConfirm         Boolean  @default(true)
  lastUsedAt            DateTime?
  useCount              Int      @default(0)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  matches               QuestionMatch[]
  @@index([userId, normalizedQuestion])
}

model QuestionMatch {
  id               String   @id @default(cuid())
  userId           String
  approvedAnswerId String
  questionText      String
  similarity        Int
  action            String
  createdAt         DateTime @default(now())
  approvedAnswer    ApprovedAnswer @relation(fields: [approvedAnswerId], references: [id], onDelete: Cascade)
}

model ReviewQueueItem {
  id             String   @id @default(cuid())
  userId         String
  type           String
  priority       Int      @default(3)
  relatedJobId   String?
  recommendation String?
  confidence     Int?
  requiredAction String
  status         String   @default("Open")
  resolution     String?
  createdAt      DateTime @default(now())
  resolvedAt     DateTime?
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, status, priority])
}

model DuplicateMatch {
  id           String   @id @default(cuid())
  userId       String
  jobId        String
  matchedJobId String?
  type         String
  confidence   Int
  reasons      String[]
  userDecision String?
  createdAt    DateTime @default(now())
  job          Job      @relation("DuplicateJob", fields: [jobId], references: [id], onDelete: Cascade)
  @@index([userId, jobId])
}

model ActivityEvent {
  id        String   @id @default(cuid())
  userId    String
  type      String
  metadata  Json?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, type, createdAt])
}
```

# Phased Roadmap

## Phase 0: Architecture and Setup

- Goal: establish technical direction and project skeleton.
- Deliverables: docs, ADRs, Next.js scaffold, CI, env validation.
- Risks: overplanning and stack churn.
- Exit criteria: app boots locally, lint/typecheck pass.
- Estimate: 2-3 sessions.
- Do not build: AI workflows, automation, billing.

## Phase 1A: Foundation

- Features: auth, database, layout, navigation, protected routes.
- Dependencies: Phase 0.
- Exit criteria: signed-in user can access dashboard; anonymous users cannot.
- Estimate: 4-6 sessions.
- Do not build: OAuth complexity unless needed.

## Phase 1B: Profile and Resume

- Features: profile form, preferences, skills, paste resume, default resume.
- Exit criteria: user can complete onboarding prerequisites.
- Estimate: 5-7 sessions.
- Do not build: advanced resume rewriting.

## Phase 1C: Jobs and Duplicate Detection

- Features: manual job CRUD, normalization, duplicate warnings.
- Exit criteria: duplicate evidence appears before/after save.
- Estimate: 5-7 sessions.
- Do not build: scraping/importers.

## Phase 1D: AI Scoring and Ranking

- Features: provider abstraction, scoring prompt, validation, top 10.
- Exit criteria: scored jobs rank with explanations.
- Estimate: 5-8 sessions.
- Do not build: background worker unless needed.

## Phase 1E: Question Memory and Review Queue

- Features: approved answers, question matching, central review queue.
- Exit criteria: low-confidence answers enter queue; approved answers reuse.
- Estimate: 5-7 sessions.
- Do not build: vector DB unless deterministic matching fails.

## Phase 1F: Application Packages and Tracking

- Features: tailored materials, application statuses, CSV export.
- Exit criteria: user can move job from ready to applied and export data.
- Estimate: 5-7 sessions.
- Do not build: automatic submission.

## Phase 1G: Testing, Security, Polish, Deployment

- Features: E2E flow, security review, responsive polish, docs, deployment.
- Exit criteria: Phase 1 definition of done met.
- Estimate: 6-10 sessions.
- Do not build: Phase 2 ingestion.

## Phase 2: Job Ingestion and Assisted Workflows

Email imports, job alerts, ATS-specific helpers, browser extension, company intelligence, billing, and admin.

## Phase 3: Browser Automation and Scalable SaaS

Human-approved form assistance, session recovery, CAPTCHA handoff, scalable queues, automation reliability, and compliance workflows.

## Phase 1 Definition of Done

- New user can register and complete onboarding.
- Profile, preferences, and resume persist.
- Jobs can be added manually and scored.
- Hard criteria and duplicate checks work.
- Top 10 ranked jobs display.
- Application package generation works truthfully.
- Low-confidence questions enter review queue.
- Approved answers are saved and reused.
- Applications are tracked.
- CSV exports work.
- Core tests and E2E happy path pass.
- UI is responsive and professional.
- App can be deployed from documented steps.
- No known critical security issues.

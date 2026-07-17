# Week 8 Stabilization Backlog

Date: 2026-07-17

## P0: Blocks Alpha Testing

### P0-1: Configure PostgreSQL for local and alpha environments

- Status: Local setup scripted; hosted alpha database still required.
- Problem: `prisma migrate deploy` failed during the audit because no reachable Postgres database was configured.
- User impact: testers cannot save profile, resume, or job data; refresh/persistence cannot be validated.
- Evidence: `env DATABASE_URL=postgresql://user:password@localhost:5432/aca npx prisma migrate deploy` failed with schema engine error.
- Recommended fix: use `npm run db:up`, `npm run db:migrate`, and `npm run db:seed` locally; provision managed Postgres for hosted alpha.
- Acceptance criteria: `npx prisma migrate deploy` succeeds; app can save and reload profile, resume, and jobs.
- Tests required: migration deploy, manual save/reload, E2E persistence flow.
- Estimated size: M
- Relevant files: `prisma/schema.prisma`, `prisma/migrations`, `.env.example`, `docs/deployment.md`

### P0-2: Provide non-shared alpha tester access

- Status: App support added through `ALPHA_AUTH_USERS`; real tester credentials still need to be configured outside source control.
- Problem: only one demo credential maps to `dev-user` unless alpha credentials are configured.
- User impact: 3-5 testers would share data, making privacy and feedback unreliable.
- Evidence: `src/auth.ts` returns fixed user id `dev-user` for configured credential login.
- Recommended fix: set `ALPHA_AUTH_USERS` to one credential per tester in the hosted environment.
- Acceptance criteria: each tester gets a distinct `session.user.id`; users cannot see each other's saved records.
- Tests required: auth test with at least two users; cross-user data isolation test.
- Estimated size: M
- Relevant files: `src/auth.ts`, `src/types/next-auth.d.ts`, `prisma/schema.prisma`

### P0-3: Deploy authenticated app to a server-capable alpha environment

- Problem: authenticated app deployment is deferred; Week 1 static deployment is not enough for Weeks 2-8 flows.
- User impact: real testers cannot access a stable hosted app.
- Evidence: weekly plan repeatedly defers authenticated deployment until server-capable Next.js plus PostgreSQL is selected.
- Recommended fix: deploy to Vercel, Render, Fly, or equivalent with `AUTH_SECRET`, `AUTH_URL`, `DATABASE_URL`, and tester auth configuration.
- Acceptance criteria: alpha URL supports sign-in, profile, resume, jobs, and duplicate warnings with persisted data.
- Tests required: smoke test deployed URL, E2E against deployed alpha, production build.
- Estimated size: M
- Relevant files: `docs/deployment.md`, `next.config.ts`, `prisma/migrations`, hosting configuration

### P0-4: Verify persistence end to end

- Problem: save actions exist but were not verified against a real database during this audit.
- User impact: alpha testers may lose work or hit untested save failures.
- Evidence: save buttons are disabled in preview mode; no DB was available.
- Recommended fix: after database setup, manually and automatically test profile save, resume save/default, job save/detail, and duplicate warning against saved jobs.
- Acceptance criteria: saved data survives refresh and logout/login; duplicate warning appears for a persisted duplicate job.
- Tests required: Playwright persistence journey; unit tests remain green.
- Estimated size: M
- Relevant files: `src/features/profile/actions.ts`, `src/features/resumes/actions.ts`, `src/features/jobs/actions.ts`, `src/components/jobs/job-manager.tsx`

## P1: Fix Before Alpha

### P1-1: Add seed/demo data script

- Status: Fixed locally with `npm run db:seed`.
- Problem: no seed script existed during the audit.
- User impact: QA and testers cannot quickly create realistic baseline data.
- Evidence: repository search found no seed file or script.
- Recommended fix: add `prisma/seed.ts` or a script that creates a demo user, profile, resume, and several jobs.
- Acceptance criteria: one command creates deterministic fake data in local/test DB.
- Tests required: run seed against empty DB; verify dashboard/profile/resume/jobs render seeded data.
- Estimated size: S
- Relevant files: `package.json`, `prisma`, `src/features/*`

### P1-2: Add database integration tests

- Problem: repository behavior is unit-tested with mocks, but not verified against Prisma/Postgres.
- User impact: schema/repository mismatches can escape into alpha.
- Evidence: existing tests mock repository DB clients.
- Recommended fix: add integration tests using a test database or isolated schema.
- Acceptance criteria: profile, resume, job, and duplicate persisted flows pass against real Prisma client.
- Tests required: new integration suite in CI/local.
- Estimated size: M
- Relevant files: `tests`, `prisma/schema.prisma`, `src/features/profile`, `src/features/resumes`, `src/features/jobs`

### P1-3: Align route protection middleware with app routes

- Status: Fixed in middleware and E2E coverage.
- Problem: middleware matcher only covered `/dashboard/:path*`, while app layout protected all `(app)` routes.
- User impact: current protection works through the layout, but defense-in-depth and audit clarity are weaker.
- Evidence: `middleware.ts` matcher is `["/dashboard/:path*"]`.
- Recommended fix: match all protected app paths or document why layout-only protection is sufficient.
- Acceptance criteria: unauthenticated requests to `/profile`, `/resume`, `/jobs`, and `/jobs/:id` redirect before page render.
- Tests required: E2E unauthenticated redirects for all protected routes.
- Estimated size: XS
- Relevant files: `middleware.ts`, `tests/e2e/auth.spec.ts`

### P1-4: Add mobile E2E coverage

- Status: Fixed with a `mobile-chrome` Playwright project.
- Problem: mobile responsiveness was visually designed but not tested.
- User impact: alpha testers on mobile may hit hidden overflow or unusable controls.
- Evidence: Playwright config only uses Desktop Chrome.
- Recommended fix: add a mobile Chrome or mobile Safari-equivalent Playwright project for core routes.
- Acceptance criteria: landing, dashboard, profile, resume, and jobs pass at mobile viewport.
- Tests required: Playwright mobile project.
- Estimated size: S
- Relevant files: `playwright.config.ts`, `tests/e2e`

### P1-5: Improve alpha-facing placeholder messaging

- Problem: later-week placeholder pages are reachable from navigation.
- User impact: testers may think scoring/top matches/review queue are broken rather than intentionally scheduled later.
- Evidence: Top Matches, Review Queue, and Question Bank routes exist as placeholders.
- Recommended fix: add alpha-safe copy that says these are scheduled for Weeks 9-13 and not part of the Week 8 test.
- Acceptance criteria: each placeholder clearly states status and next planned week.
- Tests required: simple rendering tests or E2E navigation assertion.
- Estimated size: XS
- Relevant files: `src/app/(app)/top-matches/page.tsx`, `src/app/(app)/review/page.tsx`, `src/app/(app)/question-bank/page.tsx`

## P2: Improve During Alpha

### P2-1: Add success state examples after save

- Problem: success states exist in server actions but are hard to experience without DB.
- User impact: users may not feel the payoff after completing forms.
- Evidence: profile/resume actions return success strings; job redirects to detail.
- Recommended fix: after persistence is verified, polish success messages and add saved-state highlights.
- Acceptance criteria: user sees a clear confirmation and next step after each save.
- Tests required: E2E save-state assertions.
- Estimated size: S
- Relevant files: `src/components/profile/profile-form.tsx`, `src/components/resume/resume-manager.tsx`, `src/components/jobs/job-manager.tsx`

### P2-2: Add duplicate warning override UX design notes

- Problem: duplicate warnings are explainable but not actionable beyond continuing manually.
- User impact: testers may want to mark "not a duplicate" or "repost".
- Evidence: `docs/duplicate-detection.md` defers override storage on `DuplicateMatch`.
- Recommended fix: document and prototype override decisions after persistence basics are stable.
- Acceptance criteria: backlog item ready for a future implementation week.
- Tests required: UI tests once implemented.
- Estimated size: S
- Relevant files: `docs/duplicate-detection.md`, `src/features/duplicates`, `src/components/jobs/job-manager.tsx`

### P2-3: Add accessibility pass for rich controls

- Problem: chip buttons and dense controls are tested for labels but not fully audited for keyboard order and screen reader phrasing.
- User impact: some users may struggle to complete profile quickly.
- Evidence: no automated accessibility tooling is configured.
- Recommended fix: run manual keyboard/screen-reader pass and consider axe integration.
- Acceptance criteria: all primary controls are keyboard reachable and have clear accessible names.
- Tests required: manual checklist plus optional automated accessibility test.
- Estimated size: S
- Relevant files: `src/components/profile/profile-form.tsx`, `src/components/resume/resume-manager.tsx`, `src/components/jobs/job-manager.tsx`

## Scheduled for Weeks 9-16

### Week 9: AI provider abstraction

- Problem: AI provider boundary is not implemented yet.
- User impact: no AI scoring can run.
- Evidence: weekly plan schedules this for Week 9.
- Recommended fix: build provider interface, OpenAI adapter, prompt registry, structured output validation with mocked tests.
- Acceptance criteria: mocked provider tests pass and no raw untrusted text controls instructions.
- Tests required: provider mock, schema validation, prompt-injection fixture.
- Estimated size: M
- Relevant files: `src/features/ai`, `docs/ai-prompts.md`

### Week 10: Job scoring

- Problem: users cannot score jobs yet.
- User impact: Week 8 app provides organization and duplicate value, not matching value.
- Evidence: weekly plan schedules scoring for Week 10.
- Recommended fix: implement hard criteria, scoring action, score persistence, score UI.
- Acceptance criteria: one job can be scored with validated structured result and understandable explanation.
- Tests required: hard-filter, AI mock, invalid response, timeout, prompt injection.
- Estimated size: L
- Relevant files: `src/features/matching`, `src/app/(app)/jobs/[id]`

### Week 11: Top matches

- Problem: dashboard does not rank jobs.
- User impact: no ranked list yet.
- Evidence: weekly plan schedules top matches for Week 11.
- Recommended fix: add ranking query/service and dashboard UI.
- Acceptance criteria: eligible scored jobs rank top 10.
- Tests required: ranking tests and E2E display.
- Estimated size: M
- Relevant files: `src/features/matching`, `src/app/(app)/dashboard`

### Weeks 12-15: Review queue, questions, applications, exports

- Problem: downstream application workflow is not implemented yet.
- User impact: alpha testers cannot use ACA as a full application tracker.
- Evidence: weekly plan schedules these after Week 11.
- Recommended fix: execute later weekly plans in order after Week 9-11 foundations.
- Acceptance criteria: each weekly acceptance checklist passes.
- Tests required: module unit/integration/E2E tests.
- Estimated size: L
- Relevant files: future `src/features/review-queue`, `src/features/questions`, `src/features/applications`, export routes

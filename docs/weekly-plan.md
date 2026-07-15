# Weekly and Session-Level Plan

Assumption: about two hours per week, split into one or two focused sessions. Phase 1 is realistically 16 weeks.

## Week 1: Project Skeleton

- Result: app boots with strict TypeScript and basic docs.
- Sessions: create Next.js app, install Tailwind/shadcn baseline; add README and env example; commit, push, deploy, and review the running app.
- Files: `package.json`, `package-lock.json`, `src/app`, `src/components`, `src/lib`, `tests`, `.env.example`, `.gitignore`, config files.
- Tests: `npm audit --audit-level=moderate`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run test:e2e`.
- Acceptance: landing page loads locally and in the simple deployment environment; all Week 1 validation checks pass.
- Push step: commit the Week 1 scaffold and push the branch to GitHub.
- Deploy step: deploy the same committed source state to the simple review environment.
- Review step: open the local URL and deployed URL, confirm the ACA landing page renders, then rerun the validation commands.
- Commit: `chore: scaffold next app`
- Prompt: "Set up the Next.js TypeScript skeleton for this ACA MVP using the documented stack."

### Week 1 Completion Review

Use this checklist to review Week 1:

1. Run `npm install` if dependencies are not installed.
2. Run `npm audit --audit-level=moderate` and confirm there are no reported vulnerabilities.
3. Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, and `npm run test:e2e`.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Confirm the landing page shows the ACA brand, the product message, and the Week 1 scope note.
6. Confirm the GitHub branch contains the same committed source used for deployment.
7. Open the deployed review URL and confirm it matches the local landing page.

Week 1 is complete when the validation commands pass, the local app renders, the code is pushed to GitHub, and the deployed review URL is available.

## Week 2: Database and Auth Foundation

- Result: Prisma, User model, Auth.js configured.
- Sessions: configure Prisma/Postgres; add protected layout and sign-in flow.
- Files: `prisma/schema.prisma`, `src/auth.ts`, `src/app/(auth)`.
- Tests: auth smoke test, typecheck.
- Acceptance: signed-in protected dashboard.
- Commit: `feat: add auth and database foundation`

## Week 3: App Shell

- Result: responsive dashboard shell and navigation.
- Sessions: shadcn components, layout, nav, empty dashboard cards.
- Files: `src/app/(app)`, `src/components`.
- Tests: RTL render smoke tests.
- Acceptance: mobile and desktop layout usable.
- Commit: `feat: add authenticated app shell`

## Week 4: Profile Data Model

- Result: profile/preferences/skills schema and repositories.
- Sessions: Prisma models, migrations, Zod schemas, service layer.
- Files: `prisma/schema.prisma`, `src/features/profile`.
- Tests: unit tests for validation and ownership.
- Commit: `feat: add profile persistence`

## Week 5: Profile UI and Onboarding

- Result: user can complete core profile.
- Sessions: onboarding/profile form, save/load, validation errors.
- Files: `src/app/(app)/profile`, `src/app/(app)/onboarding`.
- Tests: form tests.
- Commit: `feat: add career profile form`

## Week 6: Resume MVP

- Result: paste resume and mark default.
- Sessions: resume schema/service; resume UI text editor.
- Files: `src/features/resumes`, `src/app/(app)/resume`.
- Tests: validation and ownership tests.
- Commit: `feat: add resume management`

## Week 7: Job CRUD

- Result: user can add/list/view jobs.
- Sessions: job schema/service; add job form and list.
- Files: `src/features/jobs`, `src/app/(app)/jobs`.
- Tests: job validation tests.
- Commit: `feat: add manual job management`

## Week 8: Duplicate Detection

- Result: duplicate warnings appear with reasons.
- Sessions: normalization helpers; duplicate service; UI warning.
- Files: `src/features/duplicates`, `src/features/jobs`.
- Tests: duplicate test matrix.
- Commit: `feat: add explainable duplicate detection`

## Week 9: AI Provider and Prompt Foundation

- Result: provider interface, prompt registry, structured output validation.
- Sessions: OpenAI adapter; schemas; mocked provider tests.
- Files: `src/features/ai`, `src/features/matching`.
- Tests: provider mock and schema tests.
- Commit: `feat: add ai provider abstraction`

## Week 10: Job Scoring

- Result: score one job and persist result.
- Sessions: hard criteria logic; scoring action; score UI.
- Files: `src/features/matching`, `src/app/(app)/jobs/[id]`.
- Tests: hard-filter and scoring persistence tests.
- Commit: `feat: add job scoring`

## Week 11: Top Matches Dashboard

- Result: dashboard ranks eligible top 10.
- Sessions: ranking query/service; dashboard UI.
- Files: `src/features/matching`, `src/app/(app)/dashboard`.
- Tests: ranking tests.
- Commit: `feat: add top matches dashboard`

## Week 12: Review Queue

- Result: central queue supports open/resolve.
- Sessions: queue schema/service; list/detail UI.
- Files: `src/features/review-queue`, `src/app/(app)/review`.
- Tests: queue workflow tests.
- Commit: `feat: add review queue`

## Week 13: Question Bank

- Result: approved answers can be saved and matched.
- Sessions: answer schema/service; deterministic matching; UI.
- Files: `src/features/questions`, `src/app/(app)/question-bank`.
- Tests: question matching tests.
- Commit: `feat: add approved answer memory`

## Week 14: Application Packages

- Result: tailored materials generated with review items.
- Sessions: package prompt/service; package UI.
- Files: `src/features/applications`, `src/features/ai/prompts`.
- Tests: mocked AI generation tests.
- Commit: `feat: add application package generation`

## Week 15: Application Tracker and Exports

- Result: application statuses and CSV exports.
- Sessions: tracker UI; CSV route handlers.
- Files: `src/app/(app)/applications`, `src/app/api/export`.
- Tests: status and CSV tests.
- Commit: `feat: add application tracking and exports`

## Week 16: E2E, Security, Deployment

- Result: deployable Phase 1 candidate.
- Sessions: Playwright journey; security checklist; deployment docs.
- Files: `tests/e2e`, `docs/deployment.md`, CI config.
- Tests: full test suite and manual regression.
- Commit: `chore: prepare phase 1 deployment`

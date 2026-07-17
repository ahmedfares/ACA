# Week 8 Milestone Review

Date: 2026-07-17

## Executive Summary

Weeks 1-8 are runnable as a local preview and the automated suite is healthy. The implemented scope covers the app skeleton, Auth.js credential sign-in, authenticated shell, career profile UI and data model, resume paste/default MVP, manual job CRUD, and deterministic duplicate detection warnings.

The product is now locally ready for a controlled alpha rehearsal: local Docker Postgres setup, migrations, seed data, distinct alpha credential support, protected-route coverage, mobile E2E, and database-backed E2E verification are in place. Hosted alpha is still blocked until the same database/auth configuration is deployed to a server-capable environment.

Verdict: Ready for alpha after hosted-environment setup.

## Confirmed Week 1-8 Scope

- Week 1: Next.js TypeScript skeleton, Tailwind/shadcn baseline, docs, tests, build, local landing page.
- Week 2: Prisma/Auth.js foundation, protected dashboard, credential sign-in.
- Week 3: Authenticated app shell, dashboard, responsive navigation, placeholder destinations.
- Week 4: Profile, preference, and skill schema/repository/validation with user ownership.
- Week 5: Profile/onboarding UI, form parsing, validation, save path gated by database configuration.
- Week 6: Resume model/service/UI, paste resume text, mark default, save/list path gated by database configuration.
- Week 7: Job model/service/UI, manual job add/list/view path gated by database configuration.
- Week 8: Deterministic duplicate detection service and live explainable warning panel in Jobs.

## Features Planned for Weeks 9-16

- Week 9: AI provider abstraction and prompt registry.
- Week 10: Job scoring and persistence.
- Week 11: Top matches dashboard.
- Week 12: Review queue.
- Week 13: Question bank and approved answer memory.
- Week 14: Application package generation.
- Week 15: Application tracking and CSV exports.
- Week 16: Full E2E, security, deployment hardening.

These are not Week 8 defects.

## Commands Executed

| Command | Result | Notes |
| --- | --- | --- |
| `npm install` | Passed | Up to date, 0 vulnerabilities. |
| `npx prisma generate` | Passed | Prisma Client generated. |
| `env DATABASE_URL=postgresql://user:password@localhost:5432/aca npx prisma validate` | Passed | Schema valid. |
| `docker compose up -d postgres` | Passed after port adjustment | ACA Postgres runs on host port 5433 to avoid an existing port 5432 container. |
| `env DATABASE_URL=postgresql://aca:aca@127.0.0.1:5433/aca?schema=public npm run db:migrate` | Passed | All three migrations applied. Required unsandboxed execution for Prisma engine/cache access. |
| `env DATABASE_URL=postgresql://aca:aca@127.0.0.1:5433/aca?schema=public npm run db:seed` | Passed | Seeded demo profile, resume, and jobs for `demo@example.com`. |
| `npm audit --audit-level=moderate` | Passed | 0 vulnerabilities. |
| `npm run lint` | Passed | ESLint clean. |
| `npm run typecheck` | Passed | TypeScript clean. |
| `npm run test` | Passed | 13 files, 33 tests passed. |
| `npm run build` | Passed | Next.js production build succeeded. |
| `npm run test:e2e` | Passed | 6 Playwright tests passed across desktop and mobile projects. |
| `DATABASE_URL=... ALPHA_AUTH_USERS=... npm run test:e2e` | Passed | 6 Playwright tests passed against local Postgres with distinct desktop/mobile users. |
| `npm run dev` | Started | Dev server reported ready at `http://localhost:3000`; app browser requests returned 200 in server logs. |
| `curl -I http://127.0.0.1:3000` | Failed from shell | Shell could not connect, while Playwright and dev logs showed the app reachable. Treated as local shell connectivity anomaly. |

## Test Results

Passed:

- Dependency audit, lint, typecheck, unit tests, production build, and E2E happy path.
- E2E covers landing page, protected app-route redirects, demo/alpha sign-in, profile staged progress, resume staged progress, jobs staged progress, the duplicate panel clear state, desktop, mobile, and DB-backed save paths.
- Unit tests cover profile parsing/validation, ownership helpers, resume parsing/repository behavior, job parsing/repository behavior, alpha auth parsing, and duplicate detection matrix.

Failed or not completed:

- Hosted alpha deployment was not completed in this fix pass.
- Production-grade account management is still not implemented; alpha credential support is environment-driven and controlled.

## Complete Features

- Landing page and basic project documentation.
- Authenticated app shell and protected app layout.
- Demo credential sign-in and sign-out.
- Dashboard navigation to planned areas.
- Profile/preference/skill schema, validation, and repository ownership boundaries.
- Profile/onboarding preview UI with fast MCQ-style controls and staged progress.
- Resume schema, paste UI, default checkbox, readiness feedback, and preview save gating.
- Job schema, manual add form, list/detail routes, validation, and preview save gating.
- Duplicate detection normalization and explainable live warnings in the Jobs UI.

## Partial Features

- Hosted deployment is documented but not completed in this local fix pass.
- Alpha tester identity is now supported through `ALPHA_AUTH_USERS`, but real tester credentials must be configured securely outside source control.

## Defective Features

- The shell `curl` check could not connect to the dev server in the sandbox despite server logs and Playwright showing app availability.
- Hosted alpha environment is not provisioned yet.

## Missing Week 1-8 Features

- No production-grade self-service registration; controlled alpha credentials are environment-configured.
- No hosted alpha deployment yet.

## UX Findings

- Strength: Profile, Resume, and Jobs use staged progress and clear next-action language, matching the Ease & Fast direction.
- Strength: Save buttons are disabled in preview mode and pages explain that `DATABASE_URL` is needed.
- Friction: A real alpha tester cannot complete the emotional payoff of saving and returning later without the database environment.
- Friction: Duplicate detection is hard to experience in preview mode because it needs saved jobs.
- Friction: Later pages such as Top Matches and Review Queue are reachable as placeholders; that is acceptable for Week 8 but should be labeled clearly during alpha.

## AI Findings

- AI scoring, prompt execution, invalid AI response handling, prompt-injection tests, and score explanations are planned for Weeks 9-10 and are not implemented yet.
- Duplicate detection is deterministic, not AI-based, which matches Week 8 implementation scope.
- AI safety documentation is strong, but no runtime AI boundary exists yet.

## Security and Data Findings

- Good: server actions check `auth()` and repositories scope reads/writes by `userId`.
- Good: Zod validates profile, resume, and job input.
- Concern: shared demo credential means multiple alpha testers would share the same user identity and data.
- Concern: no production-grade password hashing/account creation exists because Week 2 only implemented demo credentials.
- Concern: no rate limiting, telemetry redaction implementation, backup/deletion process, or production secret review has been done; most are later Phase 1 hardening.
- Concern: persistence was not verified against a live DB, so true IDOR/database isolation is not fully proven.

## Alpha Blockers

1. Deploy the authenticated app to a server-capable environment with required secrets.
2. Configure hosted PostgreSQL and run migrations/seed as needed.
3. Configure `ALPHA_AUTH_USERS` with one credential per tester.
4. Run the DB-backed E2E suite against the hosted alpha URL or repeat the local verification steps before inviting testers.

## Recommended Fixes

1. Deploy the app to the chosen server-capable alpha host.
2. Add hosted environment variables and run migrations.
3. Run DB-backed E2E against hosted alpha.
4. Add richer persisted duplicate-warning E2E assertions after seed data strategy is finalized.
5. Continue with Week 9 AI provider abstraction once hosted alpha is stable.

## Final Alpha Verdict

Ready for alpha after hosted-environment setup.

The Week 8 version is valuable as a local, database-backed alpha rehearsal. It can become ready for 3-5 trusted testers once the same configuration is deployed with managed Postgres and distinct tester credentials.

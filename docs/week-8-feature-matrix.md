# Week 8 Feature Matrix

Date: 2026-07-17

| Feature | Planned week | Frontend status | Backend status | Database status | AI status | Test status | UX status | Evidence | Missing work | Classification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Project skeleton | Week 1 | Complete | Complete | N/A | N/A | Passed | Complete | `npm run build`, `npm run test`, landing E2E | None for Week 8 | Complete |
| Landing page | Week 1 | Complete | N/A | N/A | N/A | E2E passed | Clear | `tests/e2e/home.spec.ts` | Deployed URL not revalidated in this audit | Complete |
| Documentation baseline | Week 1 | Complete | N/A | N/A | N/A | Reviewed | Useful | README and docs reviewed | Keep docs current as scope changes | Complete |
| Prisma/Auth foundation | Week 2 | Complete | Complete for controlled alpha | Local Docker DB migrated | N/A | Generate/validate/E2E passed | N/A | `prisma/schema.prisma`, `src/auth.ts`, `docker-compose.yml` | Hosted DB configuration | Complete locally, partial hosted |
| Demo and alpha credential sign-in | Week 2 | Complete | Complete for controlled alpha | JWT only | N/A | Unit/E2E passed | Simple | `tests/e2e/auth.spec.ts`, `alpha-auth.test.ts` | Configure real tester credentials outside source | Complete |
| Protected dashboard | Week 2 | Complete | Complete | N/A | N/A | E2E passed | Clear | `(app)/layout.tsx`, E2E redirect | Align middleware matcher with all app routes | Complete |
| App shell navigation | Week 3 | Complete | N/A | N/A | N/A | E2E passed | Good desktop/mobile patterns | `src/components/app` | Add mobile E2E coverage | Complete |
| Dashboard metrics/next actions | Week 3 | Complete | Placeholder | N/A | N/A | Unit tested | Clear for milestone | `DashboardOverview` test | Later data-driven metrics | Complete |
| Placeholder destinations | Week 3 | Complete | N/A | N/A | N/A | E2E verifies nav links | Acceptable | app routes for top matches/review/settings/questions | Label later scope carefully in alpha | Complete |
| Profile data model | Week 4 | N/A | Complete | Migrated locally | N/A | Unit/E2E passed | N/A | Prisma `CareerProfile`, `Preference`, `Skill` | Hosted migration | Complete locally |
| Profile repository ownership | Week 4 | N/A | Complete | Verified through DB-backed E2E save path | N/A | Unit/E2E passed | N/A | `profile-ownership.test.ts` | Deeper cross-user DB integration tests | Complete |
| Profile/onboarding UI | Week 5 | Complete | Save action implemented | Verified locally | N/A | Unit/E2E passed | Strong staged UX | Profile E2E 0/4 to save | Hosted alpha verification | Complete locally |
| Job preferences | Week 5 | Complete in profile form | Save action implemented | Verified locally | N/A | Form parsing/E2E tests | Mostly easy via MCQ/chips | Profile form fields | Hosted alpha verification | Complete locally |
| Resume data model | Week 6 | N/A | Complete | Migrated locally | N/A | Unit/E2E passed | N/A | Prisma `Resume`, repo tests | Hosted migration | Complete locally |
| Resume paste UI | Week 6 | Complete | Save action implemented | Verified locally | N/A | Unit/E2E passed | Good staged UX | Resume E2E 0/3 to save | File upload planned later | Complete |
| Default resume | Week 6 | Complete | Implemented | Verified locally | N/A | Repository/E2E tests | Clear | `setDefaultResumeForm`, repo tests | More explicit saved-list E2E assertion | Complete locally |
| Manual job data model | Week 7 | N/A | Complete | Migrated locally | N/A | Unit/E2E passed | N/A | Prisma `Job`, repo tests | Hosted migration | Complete locally |
| Manual job add form | Week 7 | Complete | Create action implemented | Verified locally | N/A | Unit/E2E passed | Strong staged UX | Jobs E2E 0/4 to detail redirect | Hosted alpha verification | Complete locally |
| Job list | Week 7 | Complete | Repository implemented | Verified via seed/local DB | N/A | Unit/E2E passed | Clear empty/saved state | `JobManager`, `listJobs` | More saved-list assertions | Complete locally |
| Job detail page | Week 7 | Complete | User-scoped read implemented | Verified locally | N/A | Build/E2E passed | Clear | `/jobs/[id]` route | Cross-user detail denial integration test | Complete locally |
| Job validation | Week 7 | N/A | Complete | N/A | N/A | Unit tests passed | Error messages present | `job-schemas.test.ts` | Server-action error UX with DB | Complete |
| Duplicate normalization | Week 8 | N/A | Complete | N/A | Deterministic only | Unit matrix passed | N/A | `duplicate-detection.test.ts` | Persisted duplicate integration test | Complete |
| Duplicate warning UI | Week 8 | Complete | Uses detector | Seeded jobs available locally | Deterministic only | Unit/E2E passed | Clear reasons/confidence | `JobManager`, E2E clear-state assertion | Add exact-warning persisted E2E | Complete locally |
| AI provider abstraction | Week 9 | N/A | Complete | N/A | Provider boundary complete | Unit tests passed | N/A | `src/features/ai`, `tests/unit/ai-provider.test.ts` | Real API key/configuration for hosted alpha | Complete locally |
| AI job scoring | Week 10 | Complete on job detail | Scoring service/action complete | `JobScore` migration added | Uses provider boundary | Unit tests passed | Clear score/error panel | `src/features/matching`, `/jobs/[id]` | Real API key/configuration for hosted alpha | Complete locally |
| Score explanation UI | Week 10 | Complete on job detail | Reads latest score | `JobScore` persisted | Displays validated output | Build/E2E passed | Shows recommendation, hard criteria, reasons | `JobScorePanel` | Ranking waits for Week 11 | Complete locally |
| Top matches | Week 11 | Complete | Ranking query/service complete | Reads latest `JobScore` per job | Depends on scored jobs | Unit/E2E passed | Dashboard preview and ranked page | `/dashboard`, `/top-matches`, `rankTopMatches` | Review queue waits for Week 12 | Complete locally |
| Review queue | Week 12 | Complete | Queue service/action complete | `ReviewQueueItem` migration added | Receives review-worthy scores | Unit/E2E passed | Open/resolve workflow | `/review`, `src/features/review-queue` | Question memory waits for Week 13 | Complete locally |
| Question bank | Week 13 | Placeholder only | Not started | Not started | Later | Not tested | Placeholder | `/question-bank` | Build in Week 13 | Planned for Weeks 9-16 |
| Application package generation | Week 14 | Not started | Not started | Not started | Not started | Not tested | N/A | Weekly plan Week 14 | Build in Week 14 | Planned for Weeks 9-16 |
| Application tracking/export | Week 15 | Not started | Not started | Not started | N/A | Not tested | N/A | Weekly plan Week 15 | Build in Week 15 | Planned for Weeks 9-16 |
| Full deployment hardening | Week 16 | Partial static/deferred docs | Partial | Missing alpha DB | N/A | Not fully tested | N/A | Deployment deferrals in weekly plan | Server-capable deployment | Planned for Weeks 9-16 |

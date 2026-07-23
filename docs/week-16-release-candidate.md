# Week 16 Release Candidate

Date: 2026-07-23

## Executive Summary

Phase 1 now has the core job-search loop: profile, resume, jobs, duplicate warning, scoring, top matches, review queue, question memory, application packages, application tracking, and CSV exports. Week 16 adds the release gate needed before inviting alpha testers.

## Automated Gate

- GitHub Actions CI runs on `main` and pull requests.
- CI provisions PostgreSQL, applies migrations, seeds fake data, validates Prisma, lints, typechecks, runs unit tests, builds, and runs Playwright smoke tests.
- Local release check:

```bash
npm run check
env 'DATABASE_URL=postgresql://aca:aca@localhost:5433/aca?schema=public' npm run test:e2e
```

## Security Gate

- Protected app pages are covered by middleware.
- CSV exports require authentication.
- User-owned repository operations scope by `userId`.
- Structured AI output is schema-validated before persistence.
- Known risks before external testers: rate limiting, account/data deletion, backup policy, and production-grade credential provider.

## Manual Regression

1. Sign in as an alpha tester.
2. Complete profile and resume.
3. Add a job and confirm duplicate warning behavior.
4. Score the job and review top matches.
5. Save an approved answer in Question Bank.
6. Generate an application package from the scored job.
7. Resolve any review queue item.
8. Move the application to Applied.
9. Export jobs and applications CSV.

## Release Recommendation

Ready for an internal release-candidate rehearsal with fake data. Invite external alpha testers only after production secrets, backups, rate limiting, and deletion policy are explicitly accepted or implemented.

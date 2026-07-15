# Deployment

## Recommended Early Deployment

- App: Vercel.
- Database: managed PostgreSQL.
- File storage: Vercel Blob, Supabase Storage, or S3-compatible storage.
- Secrets: Vercel environment variables.
- CI/CD: GitHub Actions plus Vercel preview deployments.
- Monitoring: platform logs initially, Sentry before external testers.

## Week 1 Simple Deployment

The Week 1 landing page is static. The build script exports the app and copies the static output to `dist/` so it can be served by a simple static hosting environment.

## Required Environment Variables

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
OPENAI_API_KEY=
AI_PROVIDER=openai
AI_MODEL=
FILE_STORAGE_PROVIDER=
```

## Deployment Checklist

- production database created
- migrations applied
- secrets configured
- Auth.js URL configured
- AI key configured with budget controls
- logging redaction enabled
- test user flow verified
- export routes verified
- data deletion path documented

## CI Checks

- install dependencies
- lint
- typecheck
- unit tests
- integration tests where practical
- Prisma schema validation
- Playwright smoke test before release candidate

# Deployment

## Recommended Early Deployment

- App: Vercel.
- Database: managed PostgreSQL.
- File storage: Vercel Blob, Supabase Storage, or S3-compatible storage.
- Secrets: Vercel environment variables.
- CI/CD: GitHub Actions plus Vercel preview deployments.
- Monitoring: platform logs initially, Sentry before external testers.

## Week 1 Simple Deployment

The Week 1 landing page is static. The build script exports the app, copies the static output to `dist/`, copies hosting metadata, and adds a small Node entrypoint at `dist/server/index.js` for the simple Sites runtime.

Week 2 introduces Auth.js route handlers and protected pages, so the primary `npm run build` command now produces a normal dynamic Next.js build. Static Cloudflare deployment remains available through `npm run deploy:cloudflare` for the public landing shell, but the authenticated MVP should deploy to a server-capable Next.js environment with PostgreSQL.

## Cloudflare Deployment

The repository includes `wrangler.jsonc` for Cloudflare Workers static assets. Cloudflare's Workers assets configuration supports an `assets.directory`, an optional asset binding, HTML handling, and 404 handling.

For direct deployment with Wrangler:

```bash
npm install
npm run build
npx wrangler login
npm run deploy:cloudflare
```

For GitHub-connected Cloudflare deployment:

1. Push this repository to GitHub.
2. In Cloudflare, create a Workers/Pages project from Git.
3. Select the GitHub repository.
4. Use build command `npm run build`.
5. Use output directory `dist`.
6. Add `NODE_VERSION=24` if the Cloudflare build image does not use a compatible Node version by default.

## Required Environment Variables

```bash
DATABASE_URL=postgresql://aca:aca@localhost:5433/aca?schema=public
AUTH_SECRET=
AUTH_URL=
AUTH_TRUST_HOST=true
DEV_AUTH_EMAIL=demo@example.com
DEV_AUTH_PASSWORD=change-me
ALPHA_AUTH_USERS=[{"email":"tester1@example.com","password":"change-me-1","name":"Tester One"}]
OPENAI_API_KEY=
AI_PROVIDER=openai
AI_MODEL=
FILE_STORAGE_PROVIDER=
```

For local alpha rehearsal:

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

For hosted alpha, use a managed PostgreSQL database, set a strong `AUTH_SECRET`, set `AUTH_URL` to the deployed URL, and prefer `ALPHA_AUTH_USERS` with one credential per tester over shared demo credentials.

## Deployment Checklist

- Production database created.
- `npm run db:migrate` applied against the production database.
- Distinct alpha tester credentials configured through `ALPHA_AUTH_USERS`.
- `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `DATABASE_URL`, and AI provider secrets configured.
- `AI_PROVIDER=mock` only for demos; use `AI_PROVIDER=openai` plus budget controls for hosted alpha.
- Authenticated app routes verified: dashboard, profile, resume, jobs, top matches, review queue, question bank, applications.
- Export routes verified while signed in: `/api/export/jobs.csv` and `/api/export/applications.csv`.
- Unauthenticated export requests return `401`.
- Review queue checked for low-confidence scoring/package output.
- Data deletion and backup approach confirmed before inviting external testers.

## CI Checks

- `npm ci`
- `npx prisma generate`
- `npx prisma validate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`

The GitHub Actions workflow at `.github/workflows/ci.yml` runs these checks against PostgreSQL with the mock AI provider.

## Phase 1 Release Candidate Flow

1. Push to `main`.
2. Confirm GitHub Actions passes.
3. Apply migrations in the hosting environment.
4. Seed only fake/demo data for demos; do not seed real personal data.
5. Sign in as an alpha tester.
6. Complete the release regression in `docs/testing.md`.
7. Export jobs and applications CSV.
8. Confirm review queue items are explainable and resolvable.
9. Invite the first tester only after the regression is clean.

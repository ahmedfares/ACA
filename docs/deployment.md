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

- production database created
- migrations applied
- distinct alpha tester credentials configured
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

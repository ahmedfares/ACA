# ACA

AI-powered job search and application assistant.

Phase 1 is a modular-monolith SaaS MVP focused on:

- career profile and resume storage
- manual job entry
- AI job scoring and top-match ranking
- duplicate job and application detection
- truthful tailored application materials
- review queue and reusable approved answers
- application tracking and CSV export

The product principle is quality over volume:

> Find your best-fit jobs, tailor your applications, remember your best answers, and avoid duplicate submissions.

## Documentation

- [Product requirements](docs/product-requirements.md)
- [Architecture](docs/architecture.md)
- [Data model](docs/data-model.md)
- [API design](docs/api-design.md)
- [AI prompts and architecture](docs/ai-prompts.md)
- [Duplicate detection](docs/duplicate-detection.md)
- [UX journeys](docs/ux-journeys.md)
- [Roadmap](docs/roadmap.md)
- [Weekly plan](docs/weekly-plan.md)
- [Testing](docs/testing.md)
- [Security](docs/security.md)
- [Risks and backlog](docs/risks-and-backlog.md)
- [Deployment](docs/deployment.md)

## Recommended Phase 1 Stack

- Next.js App Router, TypeScript, React
- PostgreSQL with Prisma
- Auth.js with Prisma adapter
- Tailwind CSS and shadcn/ui
- Zod for validation
- OpenAI behind a replaceable AI provider interface
- Vitest, React Testing Library, Playwright
- Vercel plus managed Postgres for early deployment

## First Implementation Task

Create the Next.js TypeScript app skeleton with strict linting, Tailwind, shadcn/ui, Prisma, Auth.js dependencies, env validation, and initial documentation links.

See [weekly plan](docs/weekly-plan.md) and [roadmap](docs/roadmap.md).

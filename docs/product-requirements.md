# Product Requirements

## Executive Summary

Phase 1 is a polished, personal-use and early-tester MVP for an AI-powered job search assistant. It helps users create a career profile, save a resume, manually add jobs, score jobs with AI, rank the best opportunities, generate truthful application material, remember approved answers, track applications, and avoid duplicate submissions.

The MVP intentionally avoids browser automation, scraping dependencies, billing, and multi-source ingestion. It uses a modular monolith so one experienced engineer can build steadily in small sessions.

## Confirmed Scope

- Multi-user accounts and user-owned data isolation.
- Career profile, target preferences, and resume storage.
- Manual job entry with pasted job descriptions and URLs.
- Hard-criteria checks before soft scoring.
- AI scoring with validated structured JSON.
- Top 10 ranked jobs after disqualification filtering.
- Explainable duplicate detection.
- Tailored but truthful application package generation.
- Question review queue and approved-answer memory.
- Application tracking and CSV export.
- Responsive SaaS-quality interface.
- Tests, setup docs, deployment docs, and demo data.

## Out of Scope for Phase 1

- LinkedIn Easy Apply automation.
- Browser extension.
- ATS form completion.
- Job scraping.
- Email ingestion.
- Billing and subscriptions.
- Admin dashboard.
- Advanced semantic vector search unless a simple MVP approach proves insufficient.

## Initial Target User

The first user is an employed senior software engineer seeking higher-quality direct-hire roles. The domain model remains generic so later users can come from other professions.

## Product Principles

- Quality over mass applying.
- Never fabricate experience or legal/personal facts.
- Treat resumes and job descriptions as untrusted AI inputs.
- Make duplicate warnings explainable.
- Keep every feature useful without Phase 2 automation.
- Prefer small, reviewable increments.

## Assumptions and Open Questions

### Confirmed Requirements

- Phase 1 is a real MVP, not a prototype.
- Manual job entry is acceptable.
- PostgreSQL and Prisma are preferred.
- The AI provider must be replaceable.
- Structured AI output must be schema-validated.
- User data must be isolated from day one.

### Reasonable Assumptions

- Email/password auth plus optional OAuth later is enough for the MVP.
- One primary resume is sufficient initially, with schema support for multiple versions.
- Files can start in object storage, while pasted resume text is stored in Postgres.
- CSV export is enough for portability in Phase 1.
- AI scoring can be synchronous initially, with an async queue added only if latency becomes painful.

### Open Questions

- Which deployment provider should be used first: Vercel, Render/Fly, or a VPS?
- Should first private users log in with password only, OAuth only, or both?
- Is resume PDF/DOCX parsing needed in the first demo, or is paste-only acceptable for week one?
- What budget cap should be enforced for AI calls per user per month?

### Deferred Decisions

- Billing provider.
- Browser extension framework.
- ATS-specific automation design.
- Vector database.
- Public onboarding and admin tooling.

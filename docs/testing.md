# Testing Strategy

## Test Pyramid

- Unit tests: most domain logic.
- Integration tests: server actions, database workflows, auth boundaries.
- E2E tests: one main happy path and critical duplicate/application paths.

## Unit Tests

- normalization
- fingerprint generation
- duplicate detection
- hard filters
- scoring validation
- status transitions
- question matching
- ownership helper behavior
- Zod schemas

## Integration Tests

- profile creation
- resume creation
- job creation
- duplicate warnings
- job scoring with mocked AI
- approved answer workflow
- review queue resolution
- application creation
- user-data isolation

## E2E Plan

1. Register.
2. Complete profile.
3. Add resume.
4. Add jobs.
5. Score jobs.
6. View top 10.
7. Review a low-confidence question.
8. Approve an answer.
9. Mark a job ready.
10. Mark it applied.
11. Add duplicate job.
12. See duplicate warning.
13. Export applications.

## Test Data

Use realistic but fake career data, companies, job descriptions, and application questions. Avoid real personal data in fixtures.

## AI Output Tests

- Mock provider returns valid structured JSON.
- Invalid JSON triggers retry or failure path.
- Low confidence creates review item.
- Sensitive answers require confirmation.
- Prompt-injection text in job descriptions is ignored.

## Security Checklist

- unauthenticated route denial
- cross-user resource access denial
- file upload type and size limits
- CSRF-sensitive mutation review
- XSS-safe rendering
- no secrets in logs
- AI logs redacted

## Accessibility Checklist

- labels for all inputs
- keyboard navigation
- visible focus states
- color contrast
- semantic headings
- screen-reader friendly validation errors

## Browser Compatibility

Support latest Chrome, Safari, Firefox, and mobile Safari/Chrome for core flows.

## Release Regression

- Auth: unauthenticated protected pages redirect to `/sign-in`.
- Auth: unauthenticated CSV export routes return `401`.
- Onboarding/profile: save profile facts and preferences.
- Resume: save a default resume.
- Jobs: add a job and see duplicate warning behavior while typing.
- Scoring: score a job with mock AI or configured OpenAI provider.
- Top matches: confirm scored jobs rank and skipped/disqualified roles are excluded.
- Question bank: save an approved answer and match a similar question.
- Review queue: confirm low-confidence score/package output creates an item and can be resolved.
- Package generation: generate a package from a scored job.
- Applications: mark a package ready/applied and add follow-up metadata.
- Export: download jobs and applications CSV while signed in.

## Week 16 Automated Gate

Run this locally before pushing a release candidate:

```bash
npm run check
env 'DATABASE_URL=postgresql://aca:aca@localhost:5433/aca?schema=public' npm run test:e2e
```

For CI, `.github/workflows/ci.yml` provisions PostgreSQL, applies migrations, seeds fake data, runs the app checks, and executes the Playwright smoke suite.

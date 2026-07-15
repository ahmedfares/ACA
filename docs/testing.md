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

- auth
- onboarding
- resume save
- job add
- duplicate warning
- scoring
- top 10
- package generation
- review queue
- application status
- export

# Risks and Backlog

## Risks and Mitigations

| Risk | Likelihood | Impact | Phase 1? | Mitigation |
| --- | --- | --- | --- | --- |
| ATS and LinkedIn restrictions | High | High | No | Keep automation out of Phase 1; design for human approval. |
| Browser automation fragility | High | High | No | Defer to Phase 3; use stable product primitives first. |
| AI hallucination | Medium | High | Yes | Structured output, validation, confidence, review queue. |
| Sensitive user data exposure | Medium | High | Yes | User scoping, redaction, secure auth, least logging. |
| Prompt injection | Medium | High | Yes | Mark untrusted content and test adversarial inputs. |
| Duplicate false positives | Medium | Medium | Yes | Explainable warnings and user overrides. |
| Duplicate false negatives | Medium | Medium | Yes | Layered matching and regression tests. |
| Resume parsing complexity | Medium | Medium | Yes | Paste-first, file parsing later. |
| AI cost growth | Medium | Medium | Yes | Rate limits, caching, batch caps. |
| Vendor lock-in | Low | Medium | Yes | AI provider interface and prompt registry. |
| Overbuilding | High | High | Yes | 16-week scoped roadmap and explicit out-of-scope list. |
| Insufficient demand | Medium | High | Yes | Build personal-use value first; demo with early testers. |

## Must Have

- As a user, I can register and sign in so my data is private.
  - Acceptance: unauthenticated users cannot access app data.
- As a user, I can create a career profile and preferences.
  - Acceptance: saved data persists and validates required fields.
- As a user, I can paste a resume.
  - Acceptance: resume can be viewed and used for scoring.
- As a user, I can add jobs manually.
  - Acceptance: job URL, title, company, description, and status persist.
- As a user, I can see duplicate warnings.
  - Acceptance: exact URL and same company/title/location cases are detected.
- As a user, I can score jobs with AI.
  - Acceptance: structured score and explanation save to the job.
- As a user, I can view top 10 matches.
  - Acceptance: disqualified jobs are excluded or clearly marked.
- As a user, I can generate an application package.
  - Acceptance: output is concise, truthful, and linked to a job.
- As a user, I can approve answers.
  - Acceptance: approved answers can be reused for similar questions.
- As a user, I can track application status.
  - Acceptance: duplicate application is blocked or warned.
- As a user, I can export jobs and applications.
  - Acceptance: CSV downloads include key fields.

## Should Have

- Demo data seed.
- File upload for resumes.
- Basic AI usage dashboard.
- Sentry integration.
- More polished dashboard charts.

## Could Have

- OAuth login.
- Resume parsing from PDF/DOCX.
- Basic company notes.
- Saved filter views.
- Answer tags autocomplete.

## Future

- Job ingestion.
- Email imports.
- Browser extension.
- ATS helpers.
- Billing.
- Admin dashboard.
- Vector search.
- Team/coaching accounts.

## Explicitly Out of Scope for Phase 1

- Automatic application submission.
- LinkedIn automation.
- CAPTCHA handling.
- Scraping protected websites.
- Full resume rewrite automation.
- Usage-based billing.
- Public marketplace integrations.

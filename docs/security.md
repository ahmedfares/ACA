# Security and Privacy

## Data Sensitivity

The app stores career history, resumes, compensation preferences, work authorization details, and application records. Treat all user-owned records as sensitive.

## Required Controls

- Authenticate every protected route.
- Scope every query by `userId`.
- Prevent IDOR by never trusting resource IDs alone.
- Validate all form, API, and AI inputs with Zod.
- Hash passwords if credentials auth is used directly.
- Enforce upload type and size limits.
- Avoid raw sensitive content in logs.
- Store secrets only in environment variables.
- Use HTTPS in production.
- Support basic data export and deletion.

## AI Safety

- Job descriptions and resumes are untrusted content.
- Prompts must instruct the model to ignore embedded instructions in untrusted content.
- AI must not fabricate experience, dates, legal status, salary facts, or demographic answers.
- Sensitive/personal answers require user confirmation.
- Structured AI outputs must be validated before persistence.

## Privacy Defaults

- Do not share data across users.
- Do not train custom models in Phase 1.
- Record user consent for AI processing before first AI call.
- Redact resume and job text from telemetry.

## Security Review Before Phase 1 Launch

- dependency audit
- auth route review
- database ownership review
- prompt-injection fixture tests
- upload review
- rate-limit review
- production secret review
- backup and deletion policy review

## Week 16 Release Security Gate

| Area | Gate | Status |
| --- | --- | --- |
| Protected pages | Middleware covers dashboard, profile, resume, jobs, top matches, review queue, question bank, applications, and settings. | Implemented |
| Export APIs | CSV export routes require `auth()` and return `401` without a signed-in user. | Implemented |
| User ownership | Repositories scope reads and writes by `userId`; status updates use `updateMany` with `id` and `userId`. | Implemented |
| AI safety | Prompt registry includes untrusted-content rules and structured schema validation. | Implemented |
| Secrets | Runtime secrets are read from environment variables; production should not use implicit demo users. | Documented |
| Password handling | Alpha credentials are environment-provided for early testing only; production auth should move to a managed/OAuth provider before wider launch. | Known limitation |
| Rate limiting | No app-level rate limiter yet for auth or AI calls. | Week 16 risk |
| Deletion | Export exists; full account/data deletion workflow is not built yet. | Week 16 risk |

Before inviting external testers, resolve or explicitly accept the Week 16 risks: rate limiting, production backup/deletion process, and alpha-auth credential handling.

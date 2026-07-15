# API Design

Use server actions for same-app mutations and route handlers for exports, webhooks, and endpoints that need stable HTTP semantics. All authenticated actions require a session and enforce `userId` ownership.

| Method | Path / Action | Purpose | Input | Output | Validation and Errors |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/*` | Auth.js routes | credentials/provider data | session | invalid credentials, rate limit |
| GET | `getProfile` | Load profile | none | profile/preferences/skills | unauthenticated |
| PUT | `updateProfile` | Save profile | profile fields | profile | Zod validation, ownership |
| PUT | `updatePreferences` | Save target criteria | preference fields | preferences | invalid compensation, invalid enum |
| POST | `createResume` | Add pasted/uploaded resume | label, text/file metadata | resume | file size/type, empty text |
| PUT | `updateResume` | Edit resume text/default | resume fields | resume | ownership, default constraint |
| GET | `listJobs` | List/filter jobs | filters/sort/page | jobs | invalid filters |
| POST | `createJob` | Add manual job | job form | job + duplicate result | duplicate warning, invalid URL |
| GET | `getJob` | Job detail | jobId | job + score + app | not found, forbidden |
| PUT | `updateJob` | Edit job | job fields | job | ownership |
| POST | `scoreJob` | AI score one job | jobId | JobScore | missing profile/resume, AI failure |
| POST | `scoreUnscoredJobs` | Batch score small set | limit | score summary | cost limit, timeout |
| GET | `getTopMatches` | Top 10 ranked jobs | filters | ranked jobs | none |
| POST | `analyzeDuplicate` | Re-check duplicates | jobId | DuplicateMatch[] | ownership |
| GET | `listApprovedAnswers` | Question bank | filters | answers | none |
| POST | `approveAnswer` | Save reusable answer | question, answer, policy | ApprovedAnswer | sensitive category confirmation |
| POST | `matchQuestion` | Find answer reuse | question text | match result | low confidence |
| GET | `listReviewItems` | Review queue | filters | items | none |
| POST | `resolveReviewItem` | Resolve queue item | itemId, resolution | item | forbidden, already resolved |
| POST | `generateApplicationPackage` | Generate tailored materials | jobId, question list | materials + review items | low confidence, AI failure |
| POST | `createApplication` | Start tracking application | jobId, resumeId | application | duplicate application |
| PUT | `updateApplicationStatus` | Move application status | status/date/notes | application | invalid transition |
| GET | `/api/export/jobs.csv` | Export jobs | filters | CSV | unauthenticated |
| GET | `/api/export/applications.csv` | Export applications | filters | CSV | unauthenticated |

## Main Validation Rules

- URLs are parsed and canonicalized before storage.
- Compensation values must be non-negative and ordered.
- Employment type and remote status use controlled enums.
- Job descriptions have max length limits.
- AI-generated JSON must pass schema validation.
- Status transitions are constrained to known states.

## Common Error Cases

- `401`: not signed in.
- `403`: resource does not belong to user.
- `404`: resource not found in user's scope.
- `409`: duplicate job or duplicate application.
- `422`: validation failed.
- `429`: rate or AI cost limit reached.
- `502`: AI provider failed or returned invalid output.

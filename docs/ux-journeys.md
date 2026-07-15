# Product Screens and User Journeys

## Main Journey

Register, complete onboarding, add resume, add jobs, score jobs, review top matches, generate an application package, resolve question-review items, mark application applied, and export records.

## Screens

| Screen | Purpose | Components | Empty / Loading / Error States |
| --- | --- | --- | --- |
| Landing | Explain product and sign in | concise hero, CTA, privacy message | no auth state, auth error |
| Sign-up/Login | Account access | form, OAuth buttons later | invalid credentials, rate limit |
| Onboarding | Collect minimum profile | profile, preferences, resume steps | progress state, save errors |
| Dashboard | Next best action | stats, top jobs, review queue preview | no jobs/profile/resume guidance |
| Profile | Edit career facts | structured form sections | validation and save states |
| Resume | Store resume | paste/upload, text editor, default resume | no resume prompt, parse error |
| Add Job | Manual job entry | job form, URL, description, duplicate warning | duplicate review, validation |
| Job List | Search and filter jobs | table/cards, filters, sort | no jobs, loading, fetch error |
| Job Details | Inspect one job | score, reasons, duplicate info, actions | unscored state, AI failure |
| Top Matches | Show best 10 | ranked list, score details | no scored jobs |
| Application Package | Generate content | summary, cover letter, answers, review items | generating, low confidence |
| Review Queue | Resolve decisions | queue list, item detail, resolve actions | empty queue success state |
| Question Bank | Manage approved answers | answers table, tags, reuse policy | no answers |
| Application Tracker | Track statuses | board/table, notes, dates | no applications |
| Settings | Account, export, deletion | export buttons, privacy controls | export/delete errors |

## Flow Notes

- Add-job flow runs duplicate detection before final save when possible, then stores warnings with the job.
- Score-job flow blocks or flags hard disqualifications before calculating soft fit.
- Review-question flow saves only user-approved sensitive/personal answers.
- Mark-applied flow checks duplicate application uniqueness before updating status.
- Duplicate-warning flow explains evidence and lets the user continue when uncertainty remains.

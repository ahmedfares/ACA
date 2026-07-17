# Week 8 Alpha Test Guide

Date: 2026-07-17

## Recommended Tester Profile

Use 3-5 trusted testers who are actively or recently job searching and comfortable giving direct product feedback. Ideal testers:

- Are senior or mid-level professionals applying to knowledge-work roles.
- Have a resume they are willing to paste into a private alpha environment.
- Can add 3-5 real or realistic job postings manually.
- Understand this is a Week 8 alpha focused on setup, job capture, and duplicate warnings, not AI scoring yet.

Do not invite paid users yet.

## Tester Invitation Message

Subject: Private alpha test for ACA job search assistant

Hi [Name],

I am testing an early private version of ACA, a job search assistant focused on helping people organize their profile, resume, and target jobs before AI matching is added.

This alpha takes about 20-30 minutes. The current version lets you sign in, complete a career profile, paste a resume, add jobs manually, and see duplicate-job warnings. AI scoring, top matches, application generation, and tracking are scheduled for later weeks, so please do not evaluate those as broken.

Please use realistic but non-sensitive information if you prefer. I am mainly looking for feedback on whether the flow feels easy, fast, clear, and worth continuing.

Thanks,
Ahmed

## Preconditions Before Inviting Testers

- Alpha app is deployed to a server-capable environment.
- PostgreSQL is configured and migrations are applied.
- Each tester has a distinct account or allowlisted identity.
- Testers know this is not a paid or production service.
- A simple support channel exists for bug reports.

## Test Tasks

1. Sign in with your assigned tester account.
2. Open Dashboard and describe what you think ACA is for.
3. Open Profile and complete the 4-step review checklist.
4. Save the profile, refresh, and confirm your data remains.
5. Open Resume, paste resume text or use realistic sample text, mark it default, and save.
6. Refresh Resume and confirm the saved version appears.
7. Open Jobs and add a job manually.
8. Save the job and open the job detail page.
9. Add the same job URL again and confirm a duplicate warning appears with a reason.
10. Add a similar job from the same company and describe whether the warning feels useful.
11. Try one job with missing salary and one with missing employment type.
12. Log out and log back in; confirm your data is still there.
13. Visit Top Matches, Review Queue, and Question Bank only to confirm you understand they are scheduled later.

## Feedback Questions

### Overall Value

- What value did ACA provide today, before AI scoring exists?
- Would you use this to organize a real job search?
- What felt most useful?
- What felt unnecessary or confusing?

### Profile

- Were the profile questions easy to answer?
- Did the MCQ/chip controls feel faster than a normal form?
- What important profile information was missing?
- Did the progress/points system motivate you or feel distracting?

### Resume

- Was paste-first resume setup acceptable for alpha?
- Would you need PDF/DOCX upload before using this seriously?
- Was the default resume concept clear?

### Jobs

- Was manual job entry fast enough?
- Which fields felt required but were not obvious?
- Did the staged `0/4` progress feel natural?
- Did the job detail page show enough information?

### Duplicate Detection

- Did the warning appear at the right time?
- Were the reasons understandable?
- Did the confidence score help or confuse you?
- Would you want buttons like "not a duplicate", "repost", or "already applied"?

### Trust and Privacy

- Did you understand what data was being stored?
- Did anything feel too sensitive to enter?
- What privacy reassurance would you need before using real data?

## Bug Report Template

Use this format for tester reports:

```md
## Summary

## Page or feature

## Steps to reproduce
1.
2.
3.

## Expected result

## Actual result

## Screenshot or screen recording

## Device/browser

## Severity
- Blocks task
- Annoying but workaround exists
- Cosmetic

## Notes
```

## Metrics to Collect

- Time to complete profile.
- Time to add first resume.
- Time to add first job.
- Number of jobs added per tester.
- Number of duplicate warnings shown.
- Number of duplicate warnings testers agreed with.
- Number of abandoned tasks.
- Number of validation errors per tester.
- Qualitative ease score from 1-5.
- Qualitative trust score from 1-5.
- Top 3 requested improvements.

## Criteria for Deciding Week 9 Priorities

Prioritize Week 9 work based on:

1. If testers cannot save or return to data, fix persistence/deployment before AI.
2. If testers complete setup but ask "now what?", proceed with AI provider and scoring foundation.
3. If duplicate warnings are confusing, improve duplicate copy and override UX before broad scoring.
4. If profile/resume data quality is weak, refine setup prompts and required fields before scoring.
5. If users hesitate to enter real data, prioritize privacy copy, tester account separation, and data deletion/export basics.

## Alpha Exit Criteria

The Week 8 alpha is successful if:

- 3-5 testers can sign in with separate identities.
- At least 80% complete profile, resume, and first job without help.
- Saved data persists after refresh and logout/login.
- At least one duplicate warning is correctly understood by each tester who creates a duplicate.
- No P0 privacy, auth, or data-loss bugs appear.
- Testers can clearly explain what they expect AI scoring to do next.

# Duplicate Detection Design

## Algorithm

1. Normalize URL.
2. Extract source job ID if present.
3. Normalize company, title, and location.
4. Hash cleaned description.
5. Compare exact identifiers first.
6. Compare normalized tuple.
7. Compare description similarity.
8. Check existing applications for same role.
9. Return explainable duplicate level and confidence.

## Normalization

- URL: lower hostname, remove tracking params, remove fragments, normalize trailing slash, keep meaningful path and job ID params.
- Company: lowercase, trim punctuation, remove legal suffixes like `inc`, `llc`, `corp`, normalize whitespace.
- Title: lowercase, remove punctuation, normalize seniority synonyms cautiously, remove job code suffixes.
- Location: lowercase, normalize remote phrases, city/state abbreviations, and whitespace.
- Description hash: strip HTML, lowercase, collapse whitespace, remove boilerplate where obvious, SHA-256 cleaned text.

## Duplicate Levels

- `Exact duplicate`: canonical URL or source job ID match.
- `Probable duplicate`: same normalized company/title/location plus very similar description.
- `Possible repost`: same company/title with similar description but different date or URL.
- `Different role`: same company but title/location/description differ enough.
- `Previously applied`: matching job has an application.
- `Safe to continue`: no meaningful match.

## Pseudocode

```ts
function detectDuplicate(newJob, existingJobs, applications) {
  const normalized = normalizeJob(newJob);
  const results = [];

  for (const job of existingJobs) {
    const reasons = [];
    let confidence = 0;
    let type = "Safe to continue";

    if (normalized.canonicalUrl && normalized.canonicalUrl === job.canonicalUrl) {
      confidence = 100;
      type = "Exact duplicate";
      reasons.push("Same normalized job URL");
    }

    if (normalized.sourceJobId && normalized.source === job.source && normalized.sourceJobId === job.sourceJobId) {
      confidence = Math.max(confidence, 100);
      type = "Exact duplicate";
      reasons.push("Same source job ID");
    }

    if (sameCompanyTitleLocation(normalized, job)) {
      confidence = Math.max(confidence, 85);
      type = confidence >= 100 ? type : "Probable duplicate";
      reasons.push("Same company, title, and location");
    }

    const similarity = descriptionSimilarity(normalized.cleanedDescription, job.cleanedDescription);
    if (similarity >= 0.9) {
      confidence = Math.max(confidence, 90);
      reasons.push("Highly similar description");
    } else if (similarity >= 0.75) {
      confidence = Math.max(confidence, 70);
      type = type === "Safe to continue" ? "Possible repost" : type;
      reasons.push("Substantially similar description");
    }

    if (applications.some(app => app.jobId === job.id)) {
      confidence = Math.max(confidence, 95);
      type = "Previously applied";
      reasons.push("Existing application found");
    }

    if (confidence >= 60) {
      results.push({ matchedJobId: job.id, type, confidence, reasons });
    }
  }

  return results.length ? sortByConfidence(results) : [{ type: "Safe to continue", confidence: 0, reasons: [] }];
}
```

## MVP Similarity

Start with deterministic matching:

- exact URL
- source job ID
- normalized tuple
- description hash
- token Jaccard similarity

Add embeddings later only if false positives/negatives are high.

## User Overrides

The user can mark a warning as:

- duplicate
- not a duplicate
- repost
- previously applied
- continue anyway

Store the decision on `DuplicateMatch`.

## Test Cases

- Same URL with tracking parameters is exact duplicate.
- Same Greenhouse job ID with different URL is exact duplicate.
- Same company/title/location and 95% description similarity is probable duplicate.
- Same company/title but different level is different role.
- Same role reposted after 60 days is possible repost.
- Existing applied role returns previously applied.
- Missing URL still uses tuple and description checks.

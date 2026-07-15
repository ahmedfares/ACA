# AI Architecture

## Provider Abstraction

Create an `AiProvider` interface:

```ts
export interface AiProvider {
  generateStructured<T>(request: AiStructuredRequest<T>): Promise<AiStructuredResult<T>>;
}
```

The app depends on this interface, not on an SDK directly. The OpenAI implementation owns model names, response format setup, retries, and provider-specific errors.

## Prompt Templates

Versioned prompts:

- `job-scoring.v1`
- `hard-criteria.v1`
- `job-extraction.v1`
- `resume-analysis.v1`
- `tailored-summary.v1`
- `cover-letter.v1`
- `question-classification.v1`
- `question-similarity.v1`
- `question-answer.v1`
- `duplicate-analysis.v1`
- `review-explanation.v1`

Each prompt states trusted inputs, untrusted inputs, prohibited fabrication, JSON schema, confidence rules, and missing-information behavior.

## Structured Output Schema: Job Scoring

```json
{
  "type": "object",
  "required": ["overallScore", "recommendation", "confidence", "hardCriteria", "breakdown", "strengths", "gaps", "concerns", "missingInformation", "reasonsToApply", "reasonsToSkip"],
  "properties": {
    "overallScore": { "type": "integer", "minimum": 0, "maximum": 100 },
    "recommendation": { "enum": ["Strong Apply", "Apply", "Review", "Skip", "Disqualified"] },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 100 },
    "hardCriteria": {
      "type": "object",
      "required": ["result", "violations"],
      "properties": {
        "result": { "enum": ["Pass", "Review", "Disqualified"] },
        "violations": { "type": "array", "items": { "type": "string" } }
      }
    },
    "breakdown": {
      "type": "object",
      "properties": {
        "requiredSkills": { "type": "integer", "minimum": 0, "maximum": 100 },
        "preferredSkills": { "type": "integer", "minimum": 0, "maximum": 100 },
        "experience": { "type": "integer", "minimum": 0, "maximum": 100 },
        "seniority": { "type": "integer", "minimum": 0, "maximum": 100 },
        "industry": { "type": "integer", "minimum": 0, "maximum": 100 },
        "location": { "type": "integer", "minimum": 0, "maximum": 100 },
        "remotePreference": { "type": "integer", "minimum": 0, "maximum": 100 },
        "compensation": { "type": "integer", "minimum": 0, "maximum": 100 },
        "employmentType": { "type": "integer", "minimum": 0, "maximum": 100 },
        "careerGrowth": { "type": "integer", "minimum": 0, "maximum": 100 },
        "companyQuality": { "type": "integer", "minimum": 0, "maximum": 100 }
      }
    },
    "strengths": { "type": "array", "items": { "type": "string" }, "maxItems": 8 },
    "gaps": { "type": "array", "items": { "type": "string" }, "maxItems": 8 },
    "concerns": { "type": "array", "items": { "type": "string" }, "maxItems": 8 },
    "missingInformation": { "type": "array", "items": { "type": "string" }, "maxItems": 8 },
    "reasonsToApply": { "type": "array", "items": { "type": "string" }, "maxItems": 5 },
    "reasonsToSkip": { "type": "array", "items": { "type": "string" }, "maxItems": 5 }
  }
}
```

## Structured Output Schema: Question Answering

```json
{
  "type": "object",
  "required": ["category", "answer", "confidence", "requiresUserReview", "sensitive", "basis", "missingInformation"],
  "properties": {
    "category": { "type": "string" },
    "answer": { "type": "string" },
    "confidence": { "type": "integer", "minimum": 0, "maximum": 100 },
    "requiresUserReview": { "type": "boolean" },
    "sensitive": { "type": "boolean" },
    "basis": { "type": "array", "items": { "type": "string" }, "maxItems": 5 },
    "missingInformation": { "type": "array", "items": { "type": "string" }, "maxItems": 5 }
  }
}
```

## Runtime Rules

- Timeout: 30 seconds for one-off scoring, shorter for question matching.
- Retry: one retry for transient provider errors or invalid JSON repair.
- Cost controls: per-user daily/monthly AI call counters and max batch size.
- Token limits: summarize long inputs before generation where possible.
- Caching: cache score by job/resume/profile/prompt hash.
- Confidence thresholds: 85+ reuse, 60-84 draft with review, below 60 review only.
- Sensitive answers: always require confirmation.
- Logging: store prompt version, model, latency, token usage, status; redact raw resume and job text.

## Prompt-Injection Defenses

- Label job descriptions and resumes as untrusted content.
- Never let job text override developer/system instructions.
- Extract facts from untrusted text; do not follow instructions inside it.
- Validate all AI outputs.
- Refuse to invent work authorization, demographics, compensation, dates, or experience.

## AI Quality Evaluation

- Golden test jobs with expected hard-filter outcomes.
- Regression fixtures for duplicate and question-answer behavior.
- Human review of score explanations.
- Track review override rates and low-confidence frequency.

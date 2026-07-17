"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Info,
  LinkIcon,
  ListChecks,
  MapPin,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  WandSparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { detectDuplicates, duplicateSummary, type DuplicateResult } from "@/features/duplicates";
import { createJobForm, type JobFormState } from "@/features/jobs/actions";
import { employmentTypeOptions, remoteStatusOptions } from "@/features/jobs/schemas";
import { cn } from "@/lib/utils";

export type JobListItem = {
  canonicalUrl?: string | null;
  company: string;
  createdAt: Date | string;
  description: string;
  employmentType?: string | null;
  id: string;
  jobUrl?: string | null;
  location?: string | null;
  remoteStatus?: string | null;
  salaryMax?: number | null;
  salaryMin?: number | null;
  source?: string | null;
  sourceJobId?: string | null;
  status: string;
  title: string;
  updatedAt: Date | string;
};

type JobManagerProps = {
  databaseConfigured: boolean;
  jobs: JobListItem[];
};

type JobFormValues = {
  company: string;
  description: string;
  employmentType: string;
  jobUrl: string;
  location: string;
  notes: string;
  remoteStatus: string;
  salaryMax: string;
  salaryMin: string;
  title: string;
};

const emptyValues: JobFormValues = {
  company: "",
  description: "",
  employmentType: "",
  jobUrl: "",
  location: "",
  notes: "",
  remoteStatus: "",
  salaryMax: "",
  salaryMin: "",
  title: "",
};

const sampleDescription = `Senior Software Engineer role focused on building reliable product experiences with React, TypeScript, Node.js, PostgreSQL, and cloud services. The team needs someone who can own features end to end, improve system quality, partner with product managers, and communicate tradeoffs clearly. Experience with API design, testing, performance work, and pragmatic architecture decisions is valuable.`;

function extractJobHints(description: string): Partial<JobFormValues> {
  const lines = description
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const joined = description.replace(/\s+/g, " ");
  const firstLine = lines[0] ?? "";
  const lineValue = (label: string) => {
    const match = lines.find((line) => new RegExp(`^${label}\\s*:`, "i").test(line));

    return match?.replace(new RegExp(`^${label}\\s*:\\s*`, "i"), "").trim();
  };
  const title =
    lineValue("job") ??
    lineValue("role") ??
    lineValue("position") ??
    firstLine.match(/^([A-Z][A-Za-z0-9 /,+#.&-]{3,80})$/)?.[1]?.trim();
  const salaryMatch = joined.match(/\$?(\d{2,3}),?000\s*(?:-|to|–)\s*\$?(\d{2,3}),?000/i);
  const remoteStatus = /\bremote\b/i.test(joined)
    ? "Remote"
    : /\bhybrid\b/i.test(joined)
      ? "Hybrid"
      : /\bon[- ]?site\b/i.test(joined)
        ? "On-site"
        : "";
  const employmentType = /\bcontract\b/i.test(joined)
    ? "Contract"
    : /\bpart[- ]time\b/i.test(joined)
      ? "Part-time"
      : /\bintern\b/i.test(joined)
        ? "Internship"
        : /\bfull[- ]time\b/i.test(joined)
          ? "Full-time"
          : "";

  return {
    company: lineValue("company") ?? lineValue("employer") ?? lineValue("team"),
    employmentType,
    location: lineValue("location") ?? lineValue("work location") ?? (remoteStatus === "Remote" ? "Remote" : undefined),
    remoteStatus,
    salaryMax: salaryMatch?.[2] ? `${salaryMatch[2]}000` : undefined,
    salaryMin: salaryMatch?.[1] ? `${salaryMatch[1]}000` : undefined,
    title,
  };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

function jobProgress(values: JobFormValues) {
  const items = [
    { complete: hasText(values.company) && hasText(values.title), label: "Add company and role" },
    { complete: hasText(values.location) && hasText(values.remoteStatus), label: "Choose work setup" },
    { complete: hasText(values.jobUrl) || hasText(values.employmentType), label: "Add source or type" },
    { complete: values.description.trim().length >= 80, label: "Paste job description" },
  ];
  const completed = items.filter((item) => item.complete).length;

  return { completed, items, percent: completed * 25 };
}

function salaryLabel(job: JobListItem) {
  if (job.salaryMin && job.salaryMax) return `$${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()}`;
  if (job.salaryMin) return `From $${job.salaryMin.toLocaleString()}`;
  if (job.salaryMax) return `Up to $${job.salaryMax.toLocaleString()}`;

  return "Compensation TBD";
}

function TestGuide({ values }: { values: JobFormValues }) {
  const progress = jobProgress(values);

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
              <MousePointerClick aria-hidden="true" className="size-4" />
            </span>
            <h2 className="text-lg font-semibold tracking-normal">Test this in 60 seconds</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Fill the job in four quick moves. The score should move 0/4, 1/4, 2/4, 3/4, then 4/4 as you work.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {progress.items.map((item) => (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-300",
                  item.complete ? "aca-complete-pop border-primary/30 bg-primary/5" : "bg-background text-muted-foreground",
                )}
                key={item.label}
              >
                <CheckCircle2
                  aria-hidden="true"
                  className={cn("size-4 shrink-0", item.complete ? "text-primary" : "text-muted-foreground")}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Review score</span>
            <span className="text-primary">{progress.completed}/4</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Each saved job becomes the input for duplicate checks, matching, and application review.
          </p>
        </div>
      </div>
    </section>
  );
}

function DuplicateWarning({ results }: { results: DuplicateResult[] }) {
  const summary = duplicateSummary(results);

  if (summary.level === "Safe to continue") {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          Duplicate check is clear
        </div>
        <p className="mt-1 text-muted-foreground">No saved job looks like the one you are entering yet.</p>
      </div>
    );
  }

  return (
    <div className="aca-complete-pop rounded-lg border border-amber-500/40 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <div className="flex items-center gap-2 font-semibold">
        <TriangleAlert aria-hidden="true" className="size-4" />
        {summary.level}: {summary.confidence}% confidence
      </div>
      {summary.matchedJobLabel ? <p className="mt-1">Closest match: {summary.matchedJobLabel}</p> : null}
      <ul className="mt-2 list-inside list-disc space-y-1">
        {summary.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      {results.some((result) => result.level === "Different role") ? (
        <p className="mt-2 text-amber-900">Other saved jobs from the same company look different enough to continue.</p>
      ) : null}
      <div className="mt-4 border-t border-amber-500/30 pt-3">
        <p className="text-xs font-semibold uppercase tracking-normal text-amber-900">Decision language coming next</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Duplicate", "Not duplicate", "Repost", "Already applied"].map((action) => (
            <button
              className="inline-flex h-8 items-center rounded-md border border-amber-500/40 bg-white/70 px-3 text-xs font-semibold text-amber-950"
              disabled
              key={action}
              type="button"
            >
              {action}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs leading-5 text-amber-900">
          Week 8 warns you before saving. A later persistence slice will remember your override decision.
        </p>
      </div>
    </div>
  );
}

export function JobManager({ databaseConfigured, jobs }: JobManagerProps) {
  const [state, formAction, isPending] = useActionState<JobFormState, FormData>(createJobForm, {});
  const errorRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<JobFormValues>(emptyValues);
  const progress = useMemo(() => jobProgress(values), [values]);
  const duplicateResults = useMemo(
    () =>
      detectDuplicates(
        {
          company: values.company,
          description: values.description,
          jobUrl: values.jobUrl,
          location: values.location,
          title: values.title,
        },
        jobs,
      ),
    [jobs, values],
  );
  const hasEnoughForDuplicateCheck = hasText(values.company) || hasText(values.title) || hasText(values.jobUrl);

  useEffect(() => {
    if (!state.error) {
      return;
    }

    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    errorRef.current?.focus({ preventScroll: true });
  }, [state.error]);

  function updateValue(key: keyof JobFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function applyDescriptionHints() {
    const hints = extractJobHints(values.description);

    setValues((current) => ({
      ...current,
      company: current.company || hints.company || "",
      employmentType: current.employmentType || hints.employmentType || "",
      location: current.location || hints.location || "",
      remoteStatus: current.remoteStatus || hints.remoteStatus || "",
      salaryMax: current.salaryMax || hints.salaryMax || "",
      salaryMin: current.salaryMin || hints.salaryMin || "",
      title: current.title || hints.title || "",
    }));
  }

  return (
    <div className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground">
          Preview mode: test the job entry flow here, then enable `DATABASE_URL` to save jobs.
        </div>
      ) : null}

      {state.error ? (
        <div
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="rounded-lg border border-primary/30 bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
          <span className="font-semibold">{state.success}</span> Job captured with {progress.completed}/4 setup steps.
          Next: open it from Saved jobs or test a similar posting for duplicate risk.
        </div>
      ) : null}

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Zap aria-hidden="true" className="size-4" />
                {progress.completed * 25} job pts
              </span>
              <span className="inline-flex h-8 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium">
                <BriefcaseBusiness aria-hidden="true" className="size-4 text-primary" />
                {jobs.length} saved
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Capture jobs while your energy is fresh. Short, structured entries make matching feel lighter later.
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles aria-hidden="true" className="size-4 text-primary" />
              Next quick win
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {progress.completed === 4 ? "Save when the database is connected." : progress.items.find((item) => !item.complete)?.label}
            </p>
          </div>
        </div>
      </section>

      <TestGuide values={values} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form action={formAction} className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-normal">Add a job</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep it fast: company, role, setup, source, and enough description for future scoring.
              </p>
            </div>
            <button
              className="inline-flex h-9 w-fit items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-secondary"
              onClick={() =>
                setValues((current) => ({
                  ...current,
                  description: sampleDescription,
                }))
              }
              type="button"
            >
              Use sample description
            </button>
          </div>

          <div className="mt-5">
            {hasEnoughForDuplicateCheck ? (
              <DuplicateWarning results={duplicateResults} />
            ) : (
              <div className="rounded-lg border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Info aria-hidden="true" className="size-4 text-primary" />
                  Duplicate check starts as you type
                </div>
                <p className="mt-1">Add a company, role, or URL and ACA will compare it with saved jobs.</p>
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="company">
                Company
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="company"
                name="company"
                onChange={(event) => updateValue("company", event.target.value)}
                placeholder="Acme Cloud"
                value={values.company}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="title">
                Job title
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="title"
                name="title"
                onChange={(event) => updateValue("title", event.target.value)}
                placeholder="Senior Software Engineer"
                value={values.title}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="location">
                Location
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="location"
                name="location"
                onChange={(event) => updateValue("location", event.target.value)}
                placeholder="Remote US"
                value={values.location}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="remoteStatus">
                Remote setup
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="remoteStatus"
                name="remoteStatus"
                onChange={(event) => updateValue("remoteStatus", event.target.value)}
                value={values.remoteStatus}
              >
                <option value="">Choose setup</option>
                {remoteStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="employmentType">
                Employment type
              </label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="employmentType"
                name="employmentType"
                onChange={(event) => updateValue("employmentType", event.target.value)}
                value={values.employmentType}
              >
                <option value="">Choose type</option>
                {employmentTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="jobUrl">
                Job URL
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="jobUrl"
                name="jobUrl"
                onChange={(event) => updateValue("jobUrl", event.target.value)}
                placeholder="https://company.com/jobs/123"
                type="url"
                value={values.jobUrl}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salaryMin">
                Salary min
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="salaryMin"
                min="0"
                name="salaryMin"
                onChange={(event) => updateValue("salaryMin", event.target.value)}
                placeholder="140000"
                type="number"
                value={values.salaryMin}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="salaryMax">
                Salary max
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="salaryMax"
                min="0"
                name="salaryMax"
                onChange={(event) => updateValue("salaryMax", event.target.value)}
                placeholder="190000"
                type="number"
                value={values.salaryMax}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-medium" htmlFor="description">
                Job description
              </label>
              <button
                className="inline-flex h-8 w-fit items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-secondary disabled:opacity-50"
                disabled={values.description.trim().length < 40}
                onClick={applyDescriptionHints}
                type="button"
              >
                <WandSparkles aria-hidden="true" className="size-3.5" />
                Extract obvious details
              </button>
            </div>
            <textarea
              className="min-h-44 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="description"
              name="description"
              onChange={(event) => updateValue("description", event.target.value)}
              placeholder="Paste the core job description here."
              value={values.description}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium" htmlFor="notes">
              Notes
            </label>
            <textarea
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="notes"
              name="notes"
              onChange={(event) => updateValue("notes", event.target.value)}
              placeholder="Anything you want to remember before applying."
              value={values.notes}
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <Button disabled={isPending || !databaseConfigured} type="submit">
              {isPending ? "Saving..." : "Save job"}
            </Button>
          </div>
        </form>

        <aside className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
              <ListChecks aria-hidden="true" className="size-4" />
            </span>
            <h2 className="text-lg font-semibold tracking-normal">Saved jobs</h2>
          </div>
          <div className="mt-5 space-y-3">
            {jobs.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
                No saved jobs yet. Add one manually when persistence is connected. A strong first test job includes a
                company, role, location, work setup, URL or employment type, and at least one paragraph of description.
              </div>
            ) : (
              jobs.map((job) => (
                <Link
                  className="block rounded-lg border bg-background p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={`/jobs/${job.id}`}
                  key={job.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{job.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <ExternalLink aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {job.location ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                        <MapPin aria-hidden="true" className="size-3" />
                        {job.location}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                      <LinkIcon aria-hidden="true" className="size-3" />
                      {salaryLabel(job)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

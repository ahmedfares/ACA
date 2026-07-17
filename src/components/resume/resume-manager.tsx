"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, FileText, MousePointerClick, Star, Trophy, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveResumeForm, setDefaultResumeForm, type ResumeFormState } from "@/features/resumes/actions";
import { countResumeWords } from "@/features/resumes/form-data";
import { cn } from "@/lib/utils";

export type ResumeListItem = {
  createdAt: Date | string;
  id: string;
  isDefault: boolean;
  label: string;
  rawText?: string | null;
  updatedAt: Date | string;
};

type ResumeManagerProps = {
  databaseConfigured: boolean;
  resumes: ResumeListItem[];
};

const sampleResumeText = `Senior Software Engineer with 10 years of experience building reliable backend systems, cloud platforms, and product-focused web applications.

Experience includes Java, Spring Boot, React, TypeScript, PostgreSQL, AWS, system design, mentoring, and cross-functional delivery.

Led architecture improvements, improved service reliability, partnered with product teams, and shipped features used by customers in production.`;

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function resumeReadiness(rawText: string) {
  const words = countResumeWords(rawText);
  const sections = [
    /experience|work history|employment/i.test(rawText),
    /skill|technology|tools/i.test(rawText),
    /education|certification|degree/i.test(rawText),
    /led|built|improved|launched|delivered|owned/i.test(rawText),
  ];
  const sectionPoints = sections.filter(Boolean).length * 15;
  const wordPoints = Math.min(40, Math.floor(words / 12) * 5);

  return {
    percent: Math.min(100, sectionPoints + wordPoints),
    points: Math.min(100, sectionPoints + wordPoints),
    sectionsFound: sections.filter(Boolean).length,
    words,
  };
}

function TestGuide({ hasLabel, hasText, isDefault }: { hasLabel: boolean; hasText: boolean; isDefault: boolean }) {
  const items = [
    { complete: hasLabel, label: "Name this resume version" },
    { complete: hasText, label: "Paste resume text" },
    { complete: isDefault, label: "Mark it as default" },
  ];
  const completed = items.filter((item) => item.complete).length;

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
            Do these one by one: name the version, paste text, then mark it default. The score should advance one step at a time.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {items.map((item) => (
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
            <span className="text-primary">{completed}/3</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${completed * 33.3}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Upload parsing is planned later; Week 6 keeps resume setup fast with pasted text.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ResumeManager({ databaseConfigured, resumes }: ResumeManagerProps) {
  const [state, formAction, isPending] = useActionState<ResumeFormState, FormData>(saveResumeForm, {});
  const [label, setLabel] = useState("");
  const [rawText, setRawText] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const readiness = useMemo(() => resumeReadiness(rawText), [rawText]);
  const hasResumeText = rawText.trim().length >= 120;

  function useSample() {
    setRawText(sampleResumeText);
  }

  return (
    <div className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground">
          Preview mode: you can test the resume flow here, then enable `DATABASE_URL` to save versions.
        </div>
      ) : null}

      {state.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="rounded-lg border border-primary/30 bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
          {state.success}
        </div>
      ) : null}

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Trophy aria-hidden="true" className="size-4" />
                {readiness.points} resume pts
              </span>
              <span className="inline-flex h-8 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium">
                <FileText aria-hidden="true" className="size-4 text-primary" />
                {readiness.words} words
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${readiness.percent}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Stronger resume context means faster matching and fewer application rewrites later.
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Zap aria-hidden="true" className="size-4 text-primary" />
              Next quick win
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {hasResumeText ? "Mark it default and save when the database is ready." : "Paste your resume or load the sample."}
            </p>
          </div>
        </div>
      </section>

      <TestGuide hasLabel={label.trim().length > 0} hasText={hasResumeText} isDefault={isDefault} />

      <form action={formAction} className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                <Star aria-hidden="true" className="size-4" />
              </span>
              <h2 className="text-lg font-semibold tracking-normal">Default resume editor</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Paste the resume you want ACA to use first for job matching and application drafts.
            </p>
          </div>
          <button
            className="inline-flex h-9 w-fit items-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-secondary"
            onClick={useSample}
            type="button"
          >
            Use sample
          </button>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[260px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="label">
                Version label
              </label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="label"
                name="label"
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Primary resume"
                value={label}
              />
            </div>
            <div className="rounded-lg border border-dashed bg-secondary/60 p-3 text-sm leading-6">
              <div className="font-medium">Upload resume file</div>
              <p className="mt-1 text-muted-foreground">
                Planned after the paste MVP. For now, paste text so matching has clean, reviewable context.
              </p>
              <button
                className="mt-3 inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium text-muted-foreground opacity-70"
                disabled
                type="button"
              >
                Upload PDF/DOCX later
              </button>
            </div>
            <label className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm leading-6">
              <input
                aria-label="Use as default"
                checked={isDefault}
                className="mt-1"
                name="isDefault"
                onChange={(event) => setIsDefault(event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block font-medium">Use as default</span>
                <span className="text-muted-foreground">Future job scoring will start with this version.</span>
              </span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="rawText">
              Resume text
            </label>
            <textarea
              className="min-h-80 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="rawText"
              name="rawText"
              onChange={(event) => setRawText(event.target.value)}
              placeholder="Paste resume text here. PDF/DOCX parsing is intentionally deferred; pasted text keeps Week 6 fast and reliable."
              value={rawText}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <Button disabled={isPending || !databaseConfigured} type="submit">
            {isPending ? "Saving..." : "Save resume"}
          </Button>
        </div>
      </form>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-normal">Saved resume versions</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep one default resume ready for matching, then add targeted versions later.
            </p>
          </div>
          <span className="rounded-md border bg-background px-3 py-2 text-sm font-medium text-primary">
            {resumes.length} saved
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {resumes.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-background p-5 text-sm leading-6 text-muted-foreground">
              No saved resumes yet. Paste a resume above when the database is configured.
            </div>
          ) : (
            resumes.map((resume) => (
              <article className="rounded-lg border bg-background p-4" key={resume.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold">{resume.label}</h3>
                      {resume.isDefault ? (
                        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {countResumeWords(resume.rawText)} words · Updated {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  {!resume.isDefault && databaseConfigured ? (
                    <form action={setDefaultResumeForm}>
                      <input name="resumeId" type="hidden" value={resume.id} />
                      <Button size="sm" type="submit" variant="outline">
                        Make default
                      </Button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

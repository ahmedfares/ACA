"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, FileText, Mail, MessageSquareText, PackageCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  generateApplicationPackageForm,
  type ApplicationPackageFormState,
} from "@/features/applications/actions";

type Material = {
  content: string;
  id: string;
  type: string;
};

type Question = {
  answerText?: string | null;
  confidence?: number | null;
  id: string;
  originalText: string;
  status: string;
};

type PersistedPackage = {
  createdAt: Date | string;
  materials: Material[];
  questions: Question[];
  resume?: {
    label: string;
  } | null;
  status: string;
  updatedAt: Date | string;
} | null;

type ApplicationPackagePanelProps = {
  jobId: string;
  latestPackage?: PersistedPackage;
};

function materialTitle(type: string) {
  if (type === "TailoredSummary") return "Tailored summary";
  if (type === "CoverLetter") return "Cover letter";
  if (type === "RecruiterMessage") return "Recruiter message";

  return type;
}

function materialIcon(type: string) {
  if (type === "CoverLetter") return FileText;
  if (type === "RecruiterMessage") return Mail;

  return Sparkles;
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function ApplicationPackagePanel({ jobId, latestPackage }: ApplicationPackagePanelProps) {
  const [state, formAction, isPending] = useActionState<ApplicationPackageFormState, FormData>(
    generateApplicationPackageForm,
    {},
  );
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.error) {
      return;
    }

    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    errorRef.current?.focus({ preventScroll: true });
  }, [state.error]);

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PackageCheck aria-hidden="true" className="size-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-normal">Application package</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Generate truthful draft materials from your profile, default resume, score, and approved answer memory.
          </p>
        </div>
        <form action={formAction}>
          <input name="jobId" type="hidden" value={jobId} />
          <Button disabled={isPending} type="submit">
            {isPending ? "Generating..." : latestPackage ? "Regenerate package" : "Generate package"}
          </Button>
        </form>
      </div>

      {state.error ? (
        <div
          className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
          ref={errorRef}
          role="alert"
          tabIndex={-1}
        >
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-4 rounded-lg border border-primary/30 bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
          <span className="font-semibold">{state.success}</span> Review every line before submitting.
        </div>
      ) : null}

      {!latestPackage ? (
        <div className="mt-5 rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
          No package yet. Generate materials after the fit score looks worth your attention.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 font-medium text-primary-foreground">
              <CheckCircle2 aria-hidden="true" className="size-4" />
              {latestPackage.status}
            </span>
            {latestPackage.resume ? (
              <span className="rounded-md border bg-background px-3 py-2 font-medium">{latestPackage.resume.label}</span>
            ) : null}
            <span className="rounded-md border bg-background px-3 py-2 text-muted-foreground">
              Updated {formatDate(latestPackage.updatedAt)}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {latestPackage.materials.map((material) => {
              const Icon = materialIcon(material.type);

              return (
                <article className="rounded-lg border bg-background p-4" key={material.id}>
                  <div className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">{materialTitle(material.type)}</h3>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{material.content}</p>
                </article>
              );
            })}
          </div>

          {latestPackage.questions.length > 0 ? (
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center gap-2">
                <MessageSquareText aria-hidden="true" className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Question drafts</h3>
              </div>
              <div className="mt-3 space-y-3">
                {latestPackage.questions.map((question) => (
                  <article className="rounded-md border bg-card p-3" key={question.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{question.originalText}</p>
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                        {question.status}
                        {question.confidence !== null && question.confidence !== undefined ? ` · ${question.confidence}%` : ""}
                      </span>
                    </div>
                    {question.answerText ? (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{question.answerText}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-amber-500/30 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle aria-hidden="true" className="size-4" />
              Human review required
            </div>
            <p className="mt-1">
              Treat this as a draft package. Week 14 intentionally generates reviewable materials, not auto-submit content.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Gauge, Sparkles, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { scoreJobForm, type ScoreJobFormState } from "@/features/matching/actions";

type PersistedJobScore = {
  confidence: number;
  concerns: string[];
  createdAt: Date | string;
  gaps: string[];
  hardCriteriaResult: string;
  missingInformation: string[];
  overall: number;
  reasonsToApply: string[];
  reasonsToSkip: string[];
  recommendation: string;
  strengths: string[];
};

type JobScorePanelProps = {
  jobId: string;
  score?: PersistedJobScore | null;
};

function scoreTone(recommendation?: string) {
  if (recommendation === "Disqualified" || recommendation === "Skip") return "text-destructive";
  if (recommendation === "Review") return "text-amber-700";

  return "text-primary";
}

function ListBlock({ items, title }: { items: string[]; title: string }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function JobScorePanel({ jobId, score }: JobScorePanelProps) {
  const [state, formAction, isPending] = useActionState<ScoreJobFormState, FormData>(scoreJobForm, {});
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
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-normal">Fit score</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Week 10 scores one saved job against your profile, default resume, preferences, and hard criteria.
          </p>
        </div>
        <form action={formAction}>
          <input name="jobId" type="hidden" value={jobId} />
          <Button disabled={isPending} type="submit">
            {score ? "Rescore job" : "Score this job"}
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

      {!score ? (
        <div className="mt-5 rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
          No score yet. Complete your profile and default resume, then run scoring to get an Apply / Review / Skip signal.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Gauge aria-hidden="true" className="size-4" />
                Overall
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-normal">{score.overall}/100</p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Recommendation
              </div>
              <p className={`mt-3 text-2xl font-semibold tracking-normal ${scoreTone(score.recommendation)}`}>
                {score.recommendation}
              </p>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TriangleAlert aria-hidden="true" className="size-4" />
                Hard criteria
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-normal">{score.hardCriteriaResult}</p>
              <p className="mt-1 text-sm text-muted-foreground">{score.confidence}% confidence</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ListBlock items={score.strengths} title="Strengths" />
            <ListBlock items={score.gaps} title="Gaps" />
            <ListBlock items={score.concerns} title="Concerns" />
            <ListBlock items={score.missingInformation} title="Missing information" />
            <ListBlock items={score.reasonsToApply} title="Reasons to apply" />
            <ListBlock items={score.reasonsToSkip} title="Reasons to skip" />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-secondary p-4 text-sm leading-6 text-muted-foreground">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            Treat scores as decision support, not truth. Review sensitive facts before applying.
          </div>
        </div>
      )}
    </section>
  );
}

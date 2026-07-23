"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { BookOpenCheck, CheckCircle2, FileQuestion, Lightbulb, MousePointerClick, Save, Search, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteApprovedAnswerForm,
  recordQuestionMatchForm,
  saveApprovedAnswerForm,
  type ApprovedAnswerFormState,
} from "@/features/questions/actions";
import { matchApprovedAnswers } from "@/features/questions/matching";
import { reusePolicyOptions } from "@/features/questions/schemas";
import { cn } from "@/lib/utils";

export type ApprovedAnswerListItem = {
  answer: string;
  category?: string | null;
  createdAt: Date | string;
  id: string;
  normalizedQuestion: string;
  question: string;
  reusePolicy: string;
  tags: string[];
  updatedAt: Date | string;
};

type QuestionBankManagerProps = {
  answers: ApprovedAnswerListItem[];
  databaseConfigured: boolean;
};

type AnswerFormValues = {
  answer: string;
  category: string;
  question: string;
  reusePolicy: string;
  tags: string;
};

const emptyValues: AnswerFormValues = {
  answer: "",
  category: "",
  question: "",
  reusePolicy: "",
  tags: "",
};

const sampleQuestion = "Tell us about a time you improved reliability in a production system.";
const sampleAnswer =
  "In my last role, I led a reliability improvement for a customer-facing service by tracing recurring incidents, tightening alerts, adding regression tests, and simplifying an unsafe deployment step. The work reduced repeat incidents and gave the team a clearer operating playbook without overstating my ownership.";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function answerProgress(values: AnswerFormValues) {
  const items = [
    { complete: values.question.trim().length >= 10, label: "Capture question" },
    { complete: values.answer.trim().length >= 20, label: "Save truthful answer" },
    { complete: values.category.trim().length > 0 || values.tags.trim().length > 0, label: "Tag for reuse" },
    { complete: values.reusePolicy.trim().length > 0, label: "Choose reuse rule" },
  ];
  const completed = items.filter((item) => item.complete).length;

  return { completed, items, percent: completed * 25 };
}

function TestGuide({ values }: { values: AnswerFormValues }) {
  const progress = answerProgress(values);

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
            Add an approved answer in four small moves. The score advances as the answer becomes reusable.
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
            <span>Memory score</span>
            <span className="text-primary">{progress.completed}/4</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Approved memory helps future application packages stay fast and truthful.
          </p>
        </div>
      </div>
    </section>
  );
}

export function QuestionBankManager({ answers, databaseConfigured }: QuestionBankManagerProps) {
  const [state, formAction, isPending] = useActionState<ApprovedAnswerFormState, FormData>(saveApprovedAnswerForm, {});
  const errorRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<AnswerFormValues>(emptyValues);
  const [matchQuestion, setMatchQuestion] = useState("");
  const progress = useMemo(() => answerProgress(values), [values]);
  const matches = useMemo(() => matchApprovedAnswers(matchQuestion, answers), [answers, matchQuestion]);

  useEffect(() => {
    if (!state.error) {
      return;
    }

    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    errorRef.current?.focus({ preventScroll: true });
  }, [state.error]);

  function updateValue(key: keyof AnswerFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function useSample() {
    setValues({
      answer: sampleAnswer,
      category: "Behavioral",
      question: sampleQuestion,
      reusePolicy: "Adapt before use",
      tags: "reliability, leadership, production",
    });
    setMatchQuestion("Describe a time you improved production reliability.");
  }

  return (
    <div className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground">
          Preview mode: test the Question Bank interaction here, then enable `DATABASE_URL` to save approved answers.
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
          <span className="font-semibold">{state.success}</span> Ask a similar question below to confirm ACA can find it.
        </div>
      ) : null}

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <Sparkles aria-hidden="true" className="size-4" />
                {progress.completed * 25} memory pts
              </span>
              <span className="inline-flex h-8 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium">
                <BookOpenCheck aria-hidden="true" className="size-4 text-primary" />
                {answers.length} approved
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="aca-progress-fill h-full rounded-full transition-all duration-700" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Save answers only after you approve the wording. Future drafts can reuse facts, but should still adapt tone and context.
            </p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Lightbulb aria-hidden="true" className="size-4 text-primary" />
              Next quick win
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {progress.completed === 4 ? "Save this answer, then test a similar question." : progress.items.find((item) => !item.complete)?.label}
            </p>
          </div>
        </div>
      </section>

      <TestGuide values={values} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form action={formAction} className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                  <Save aria-hidden="true" className="size-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-normal">Save an approved answer</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Store answers you would be comfortable reusing in applications, questionnaires, or recruiter replies.
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

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="question">
                Application question
              </label>
              <textarea
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="question"
                name="question"
                onChange={(event) => updateValue("question", event.target.value)}
                placeholder="Tell us about a time you led a cross-functional project."
                value={values.question}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="answer">
                Approved answer
              </label>
              <textarea
                className="min-h-44 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="answer"
                name="answer"
                onChange={(event) => updateValue("answer", event.target.value)}
                placeholder="Write the answer in your own words. Keep it truthful, specific, and reusable."
                value={values.answer}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="category"
                  name="category"
                  onChange={(event) => updateValue("category", event.target.value)}
                  placeholder="Behavioral"
                  value={values.category}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="tags">
                  Tags
                </label>
                <input
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="tags"
                  name="tags"
                  onChange={(event) => updateValue("tags", event.target.value)}
                  placeholder="leadership, reliability"
                  value={values.tags}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reusePolicy">
                  Reuse rule
                </label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="reusePolicy"
                  name="reusePolicy"
                  onChange={(event) => updateValue("reusePolicy", event.target.value)}
                  value={values.reusePolicy}
                >
                  <option value="">Choose reuse rule</option>
                  {reusePolicyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <Button disabled={isPending || !databaseConfigured} type="submit">
              {isPending ? "Saving..." : "Save approved answer"}
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                <Search aria-hidden="true" className="size-4" />
              </span>
              <h2 className="text-lg font-semibold tracking-normal">Match a new question</h2>
            </div>
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium" htmlFor="matchQuestion">
                New question
              </label>
              <textarea
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id="matchQuestion"
                onChange={(event) => setMatchQuestion(event.target.value)}
                placeholder="Paste a similar application question here."
                value={matchQuestion}
              />
            </div>

            <div className="mt-4 space-y-3">
              {matches.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
                  {answers.length === 0 ? "Save one approved answer first." : "No strong reusable answer found yet."}
                </div>
              ) : (
                matches.map((match) => (
                  <article className="rounded-lg border bg-background p-4" key={match.answer.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{match.answer.question}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{match.strategy}</p>
                      </div>
                      <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                        {match.score}%
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">{match.answer.answer}</p>
                    <form action={recordQuestionMatchForm} className="mt-4">
                      <input name="answerId" type="hidden" value={match.answer.id} />
                      <input name="question" type="hidden" value={matchQuestion} />
                      <input name="score" type="hidden" value={match.score} />
                      <input name="strategy" type="hidden" value={match.strategy} />
                      <Button disabled={!databaseConfigured} size="sm" type="submit" variant="outline">
                        Use this answer
                      </Button>
                    </form>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-md bg-secondary text-primary">
                <FileQuestion aria-hidden="true" className="size-4" />
              </span>
              <h2 className="text-lg font-semibold tracking-normal">Approved answers</h2>
            </div>
            <div className="mt-5 space-y-3">
              {answers.length === 0 ? (
                <div className="rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
                  No approved answers yet. Save one answer above, then ask a similar question to test deterministic matching.
                </div>
              ) : (
                answers.map((answer) => (
                  <article className="rounded-lg border bg-background p-4" key={answer.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{answer.question}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {answer.category ?? "General"} · {answer.reusePolicy} · Updated {formatDate(answer.updatedAt)}
                        </p>
                      </div>
                      <form action={deleteApprovedAnswerForm}>
                        <input name="answerId" type="hidden" value={answer.id} />
                        <Button aria-label={`Delete ${answer.question}`} size="sm" type="submit" variant="outline">
                          <Trash2 aria-hidden="true" className="size-4" />
                        </Button>
                      </form>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{answer.answer}</p>
                    {answer.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {answer.tags.map((tag) => (
                          <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

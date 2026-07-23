import { CheckCircle2, ClipboardList, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { resolveReviewItemForm } from "@/features/review-queue/actions";

type ReviewQueueItemView = {
  confidence?: number | null;
  createdAt: Date | string;
  id: string;
  job?: {
    company: string;
    id: string;
    title: string;
  } | null;
  priority: number;
  recommendation?: string | null;
  requiredAction: string;
  type: string;
};

type ReviewQueueViewProps = {
  items: ReviewQueueItemView[];
};

function priorityLabel(priority: number) {
  if (priority === 1) return "High";
  if (priority === 2) return "Medium";

  return "Low";
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function formatRequiredAction(value: string) {
  return value
    .replace(/\.\.+/g, ".")
    .replace(/\b1 application answer need review\b/g, "1 application answer needs review");
}

export function ReviewQueueView({ items }: ReviewQueueViewProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Week 12 review workflow</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Review queue</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Low-confidence scores, missing information, and review recommendations land here so decisions do not get lost.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
              <CheckCircle2 aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Nothing needs review</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Score jobs to route uncertain recommendations here. Clear queue, clear head.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article className="rounded-lg border bg-card p-5 shadow-sm" key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-xs font-semibold text-primary-foreground">
                      {priorityLabel(item.priority)}
                    </span>
                    <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-semibold text-primary">
                      {item.type}
                    </span>
                    {item.recommendation ? (
                      <span className="inline-flex h-7 items-center rounded-md bg-secondary px-2.5 text-xs font-semibold">
                        {item.recommendation}
                      </span>
                    ) : null}
                    {item.confidence !== null && item.confidence !== undefined ? (
                      <span className="inline-flex h-7 items-center rounded-md bg-secondary px-2.5 text-xs font-semibold">
                        {item.confidence}% confidence
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-lg font-semibold tracking-normal">
                    {item.job ? `${item.job.company} - ${item.job.title}` : "Review item"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{formatRequiredAction(item.requiredAction)}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Opened {formatDate(item.createdAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {item.job ? (
                    <Button asChild variant="outline">
                      <Link href={`/jobs/${item.job.id}`}>
                        Open job
                        <ExternalLink aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  ) : null}
                  {["Resolved", "Needs follow-up", "Ignored"].map((resolution) => (
                    <form action={resolveReviewItemForm} key={resolution}>
                      <input name="itemId" type="hidden" value={item.id} />
                      <input name="resolution" type="hidden" value={resolution} />
                      <Button type="submit" variant={resolution === "Resolved" ? "default" : "outline"}>
                        {resolution}
                      </Button>
                    </form>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <ClipboardList aria-hidden="true" className="mt-0.5 size-5 text-primary" />
          <p className="text-sm leading-6 text-muted-foreground">
            The queue now catches low-confidence job scores and application packages so you can resolve decisions before
            applying.
          </p>
        </div>
      </div>
    </section>
  );
}

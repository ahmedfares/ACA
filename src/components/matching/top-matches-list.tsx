import { ArrowRight, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { RankedJobMatch } from "@/features/matching/ranking";

type TopMatchesListProps = {
  emptyDescription?: string;
  matches: RankedJobMatch[];
  showViewAll?: boolean;
  title?: string;
};

function recommendationTone(recommendation: string) {
  if (recommendation === "Review") return "text-amber-700";

  return "text-primary";
}

export function TopMatchesList({
  emptyDescription = "Score jobs first to build a ranked list of roles worth your energy.",
  matches,
  showViewAll = false,
  title = "Top matches",
}: TopMatchesListProps) {
  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ranked by latest eligible score, confidence, and hard-criteria result.
          </p>
        </div>
        {showViewAll ? (
          <Button asChild variant="outline">
            <Link href="/top-matches">
              View all
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      {matches.length === 0 ? (
        <div className="mt-5 rounded-lg border border-dashed bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
          {emptyDescription}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {matches.map((match) => (
            <Link
              className="block rounded-lg border bg-background p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={`/jobs/${match.jobId}`}
              key={match.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                      {match.rank}
                    </span>
                    <h3 className="text-sm font-semibold">{match.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {match.company}
                    {match.location ? ` · ${match.location}` : ""}
                  </p>
                  {match.reasonsToApply[0] ? (
                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{match.reasonsToApply[0]}</p>
                  ) : null}
                </div>
                <div className="shrink-0 rounded-lg bg-secondary p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Target aria-hidden="true" className="size-4 text-primary" />
                    <span className="text-2xl font-semibold tracking-normal">{match.overall}</span>
                  </div>
                  <p className={`mt-1 text-xs font-semibold ${recommendationTone(match.recommendation)}`}>
                    {match.recommendation}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{match.confidence}% confidence</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

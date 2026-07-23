import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TopMatchesList } from "@/components/matching/top-matches-list";
import type { RankedJobMatch } from "@/features/matching/ranking";

const metrics = [
  { label: "Setup focus", value: "3", detail: "Profile, resume, and first job" },
  { label: "Jobs ready", value: "0", detail: "Add roles for duplicate checks" },
  { label: "Next AI step", value: "W12", detail: "Review queue and decisions" },
  { label: "Alpha goal", value: "5", detail: "Trusted testers after hosted setup" },
];

const nextActions = [
  {
    title: "Career profile",
    description: "Tell ACA what jobs are worth your limited energy.",
    href: "/profile",
    icon: UserRound,
    status: "Week 4",
  },
  {
    title: "Resume",
    description: "Paste the source of truth future scoring should respect.",
    href: "/resume",
    icon: FileText,
    status: "Week 6",
  },
  {
    title: "Jobs",
    description: "Capture roles and catch duplicate postings before they drain attention.",
    href: "/jobs",
    icon: BriefcaseBusiness,
    status: "Week 7",
  },
];

const alphaChecklist = [
  {
    detail: "Use chips and dropdowns, then save when the database is connected.",
    href: "/profile",
    title: "Complete the must-have profile fields",
  },
  {
    detail: "Paste text first; upload parsing is intentionally later.",
    href: "/resume",
    title: "Save a default resume",
  },
  {
    detail: "Paste a role and use Extract obvious details.",
    href: "/jobs",
    title: "Capture one job",
  },
  {
    detail: "Re-enter a similar Acme role and confirm the warning is explainable.",
    href: "/jobs",
    title: "Test duplicate detection",
  },
];

type DashboardOverviewProps = {
  topMatches?: RankedJobMatch[];
};

export function DashboardOverview({ topMatches = [] }: DashboardOverviewProps) {
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Today&apos;s job-search focus</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Build the source of truth</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Finish the three inputs that make ACA better than a one-off chat: your profile, your resume, and the roles you are considering.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile">
            Start with profile
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <section className="mt-8 rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Target className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-normal">First value loop</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {["Complete profile", "Paste resume", "Add first job", "Check duplicate signals"].map((step, index) => (
            <div className="rounded-lg border bg-background p-4" key={step}>
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <p className="mt-3 text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Scored jobs now become ranked top matches, so the next best role is easier to spot.
        </p>
      </section>

      <section className="mt-8 rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <ClipboardList className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-normal">Alpha test checklist</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use these four steps to review the setup loop, then score saved jobs to populate top matches.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {alphaChecklist.map((item, index) => (
            <Link
              className="rounded-lg border bg-background p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={item.href}
              key={item.title}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="text-sm font-semibold">{item.title}</h3>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-normal">{metric.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold tracking-normal">Next actions</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {nextActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  className="rounded-lg border p-4 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={action.href}
                  key={action.title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <span className="text-xs font-medium text-muted-foreground">{action.status}</span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{action.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <aside className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardList className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold tracking-normal">Readiness</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-6">Authentication and protected routing are in place.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-6">The shell is responsive across mobile and desktop.</p>
            </div>
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
              <p className="text-sm leading-6 text-muted-foreground">
                Scoring, review queues, and applications remain planned for later slices.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <TopMatchesList
          emptyDescription="No ranked matches yet. Open a saved job, click Score this job, then return here."
          matches={topMatches.slice(0, 3)}
          showViewAll={topMatches.length > 3}
          title="Top matches preview"
        />
      </div>
    </section>
  );
}

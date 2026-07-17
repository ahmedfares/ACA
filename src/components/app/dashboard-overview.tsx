import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const metrics = [
  { label: "Jobs added", value: "0", detail: "Entry and duplicate checks are ready" },
  { label: "Scored jobs", value: "0", detail: "AI scoring starts in Week 10" },
  { label: "Review items", value: "0", detail: "Review queue starts in Week 12" },
  { label: "Applications", value: "0", detail: "Tracking starts in Week 15" },
];

const nextActions = [
  {
    title: "Career profile",
    description: "The first real product workflow after the app shell.",
    href: "/profile",
    icon: UserRound,
    status: "Week 4",
  },
  {
    title: "Resume",
    description: "Paste resume text, mark the default, and prepare for matching.",
    href: "/resume",
    icon: FileText,
    status: "Week 6",
  },
  {
    title: "Jobs",
    description: "Add roles manually and catch duplicate postings before they drain attention.",
    href: "/jobs",
    icon: BriefcaseBusiness,
    status: "Week 7",
  },
];

export function DashboardOverview() {
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Week 3 app shell</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            The authenticated workspace is ready. Profile, resume, and manual job capture now build the first source of truth for matching.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile">
            Next setup step
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

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
    </section>
  );
}

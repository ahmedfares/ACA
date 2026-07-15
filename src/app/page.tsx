import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const productPillars = [
  "Rank your best-fit jobs",
  "Tailor truthful applications",
  "Reuse approved answers",
  "Avoid duplicate submissions",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold tracking-normal">ACA</span>
          </div>
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-primary">Phase 1 MVP foundation</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
              Find better-fit jobs and apply with more care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              ACA helps you compare roles against your real career profile, generate credible
              application material, remember your best answers, and prevent duplicate applications.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                Start setup
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg">
                View architecture
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s focus</p>
                <h2 className="text-xl font-semibold tracking-normal">Quality over volume</h2>
              </div>
              <ShieldCheck className="size-7 text-primary" aria-hidden="true" />
            </div>

            <div className="mt-5 space-y-4">
              {productPillars.map((pillar) => (
                <div key={pillar} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm leading-6 text-card-foreground">{pillar}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-md bg-secondary p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
                <p className="text-sm leading-6 text-secondary-foreground">
                  Week 1 creates the application shell and tooling. Profile, resume, jobs, AI
                  scoring, and tracking arrive in later scoped sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

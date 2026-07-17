import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const productPillars = [
  "Paste a job from anywhere",
  "Keep your profile and resume context ready",
  "Catch duplicate roles before you waste effort",
  "Prepare for fit scoring and truthful tailoring",
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
          <Button asChild variant="outline" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-primary">Quality-first job search assistant</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl">
              Know which jobs deserve your energy.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              ACA helps you turn profile, resume, and job posts into a calmer workflow: capture the role,
              avoid duplicates, then move toward fit scoring and truthful applications.
            </p>
            <div className="mt-6 rounded-lg border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium">Example outcome</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Job: Senior Backend Engineer {"->"} ACA keeps the role, checks for duplicates, and prepares it for
                the Apply / Review / Skip recommendation coming in the scoring phase.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Start setup
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
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
                  Week 8 alpha scope: profile, resume, manual jobs, and duplicate checks. AI fit
                  recommendations come next, after the source of truth is clean.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { ArrowLeft, BriefcaseBusiness, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { ApplicationPackagePanel } from "@/components/applications/application-package-panel";
import { JobScorePanel } from "@/components/jobs/job-score-panel";
import { Button } from "@/components/ui/button";
import { applicationRepository } from "@/features/applications/repository";
import { jobRepository } from "@/features/jobs/repository";
import { matchingRepository } from "@/features/matching/repository";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

function salaryLabel(job: { salaryMax?: number | null; salaryMin?: number | null }) {
  if (job.salaryMin && job.salaryMax) return `$${job.salaryMin.toLocaleString()}-${job.salaryMax.toLocaleString()}`;
  if (job.salaryMin) return `From $${job.salaryMin.toLocaleString()}`;
  if (job.salaryMax) return `Up to $${job.salaryMax.toLocaleString()}`;

  return "Compensation TBD";
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id || !process.env.DATABASE_URL) {
    notFound();
  }

  const [job, latestScore, latestPackage] = await Promise.all([
    jobRepository.getJob(session.user.id, id),
    matchingRepository.getLatestScore(session.user.id, id),
    applicationRepository.getLatestPackage(session.user.id, id),
  ]);

  if (!job) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <Button asChild variant="outline">
        <Link href="/jobs">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to jobs
        </Link>
      </Button>

      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">{job.company}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">{job.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {job.location ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                  <MapPin aria-hidden="true" className="size-4" />
                  {job.location}
                </span>
              ) : null}
              {job.remoteStatus ? <span className="rounded-md bg-secondary px-2 py-1">{job.remoteStatus}</span> : null}
              {job.employmentType ? <span className="rounded-md bg-secondary px-2 py-1">{job.employmentType}</span> : null}
              <span className="rounded-md bg-secondary px-2 py-1">{salaryLabel(job)}</span>
              <span className="rounded-md bg-secondary px-2 py-1">{job.status}</span>
            </div>
          </div>
          {job.jobUrl ? (
            <Button asChild>
              <a href={job.jobUrl} rel="noreferrer" target="_blank">
                Open job
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <JobScorePanel jobId={job.id} score={latestScore} />

      <ApplicationPackagePanel jobId={job.id} latestPackage={latestPackage} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness aria-hidden="true" className="size-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-normal">Description</h2>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">{job.description}</p>
        </article>

        <aside className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-normal">Job details</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-medium">Added</dt>
              <dd className="mt-1 text-muted-foreground">{formatDate(job.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium">Updated</dt>
              <dd className="mt-1 text-muted-foreground">{formatDate(job.updatedAt)}</dd>
            </div>
            {job.datePosted ? (
              <div>
                <dt className="font-medium">Posted</dt>
                <dd className="mt-1 text-muted-foreground">{formatDate(job.datePosted)}</dd>
              </div>
            ) : null}
            {job.notes ? (
              <div>
                <dt className="font-medium">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap text-muted-foreground">{job.notes}</dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>
    </section>
  );
}

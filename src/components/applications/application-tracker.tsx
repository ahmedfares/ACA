"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarClock, Download, FileText, Send, UserRoundCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  updateApplicationStatusForm,
  type ApplicationStatusFormState,
} from "@/features/applications/actions";
import { applicationStatusOptions } from "@/features/applications/schemas";

export type ApplicationTrackerItem = {
  applicationDate?: Date | string | null;
  applicationUrl?: string | null;
  createdAt: Date | string;
  followUpDate?: Date | string | null;
  id: string;
  job: {
    company: string;
    id: string;
    jobUrl?: string | null;
    location?: string | null;
    title: string;
  };
  materials: { id: string; type: string }[];
  notes?: string | null;
  recruiterContact?: string | null;
  recruiterName?: string | null;
  resume?: {
    label: string;
  } | null;
  questions: { id: string; status: string }[];
  source?: string | null;
  status: string;
  updatedAt: Date | string;
};

type ApplicationTrackerProps = {
  applications: ApplicationTrackerItem[];
  databaseConfigured: boolean;
};

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function dateInputValue(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function statusTone(status: string) {
  if (status === "Applied" || status === "Interviewing" || status === "Offer") return "bg-primary text-primary-foreground";
  if (status === "Rejected" || status === "Archived") return "bg-secondary text-muted-foreground";

  return "bg-secondary text-foreground";
}

function TrackerCard({ application }: { application: ApplicationTrackerItem }) {
  const [state, formAction, isPending] = useActionState<ApplicationStatusFormState, FormData>(
    updateApplicationStatusForm,
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

  const needsReviewCount = application.questions.filter((question) => question.status !== "Ready").length;
  const statusId = `${application.id}-status`;
  const applicationDateId = `${application.id}-applicationDate`;
  const followUpDateId = `${application.id}-followUpDate`;
  const sourceId = `${application.id}-source`;
  const applicationUrlId = `${application.id}-applicationUrl`;
  const recruiterNameId = `${application.id}-recruiterName`;
  const recruiterContactId = `${application.id}-recruiterContact`;
  const notesId = `${application.id}-notes`;

  return (
    <article className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold ${statusTone(application.status)}`}>
              {application.status}
            </span>
            {application.resume ? (
              <span className="inline-flex h-7 items-center rounded-md border bg-background px-2.5 text-xs font-semibold">
                {application.resume.label}
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-lg font-semibold tracking-normal">{application.job.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {application.job.company}
            {application.job.location ? ` · ${application.job.location}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
              <FileText aria-hidden="true" className="size-3" />
              {application.materials.length} materials
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
              <UserRoundCheck aria-hidden="true" className="size-3" />
              {application.questions.length - needsReviewCount}/{application.questions.length} answers ready
            </span>
            {application.applicationDate ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                <Send aria-hidden="true" className="size-3" />
                Applied {formatDate(application.applicationDate)}
              </span>
            ) : null}
            {application.followUpDate ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                <CalendarClock aria-hidden="true" className="size-3" />
                Follow up {formatDate(application.followUpDate)}
              </span>
            ) : null}
          </div>
          {application.notes ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{application.notes}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/jobs/${application.job.id}`}>
                Open package
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            {application.applicationUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={application.applicationUrl} rel="noreferrer" target="_blank">
                  Application link
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <form action={formAction} className="w-full rounded-lg border bg-background p-4 xl:max-w-sm">
          <input name="applicationId" type="hidden" value={application.id} />
          {state.error ? (
            <div
              className="mb-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm leading-6 text-destructive"
              ref={errorRef}
              role="alert"
              tabIndex={-1}
            >
              {state.error}
            </div>
          ) : null}
          {state.success ? (
            <div className="mb-3 rounded-md border border-primary/30 bg-secondary p-3 text-sm leading-6">
              {state.success}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={statusId}>Status</label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.status}
                id={statusId}
                name="status"
              >
                {applicationStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={applicationDateId}>Applied date</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={dateInputValue(application.applicationDate)}
                id={applicationDateId}
                name="applicationDate"
                type="date"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={followUpDateId}>Follow-up date</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={dateInputValue(application.followUpDate)}
                id={followUpDateId}
                name="followUpDate"
                type="date"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={sourceId}>Source</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.source ?? ""}
                id={sourceId}
                name="source"
                placeholder="Company site"
              />
            </div>
            <div className="space-y-1 sm:col-span-2 xl:col-span-1">
              <label className="text-sm font-medium" htmlFor={applicationUrlId}>Application URL</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.applicationUrl ?? ""}
                id={applicationUrlId}
                name="applicationUrl"
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={recruiterNameId}>Recruiter</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.recruiterName ?? ""}
                id={recruiterNameId}
                name="recruiterName"
                placeholder="Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor={recruiterContactId}>Recruiter contact</label>
              <input
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.recruiterContact ?? ""}
                id={recruiterContactId}
                name="recruiterContact"
                placeholder="email or LinkedIn"
              />
            </div>
            <div className="space-y-1 sm:col-span-2 xl:col-span-1">
              <label className="text-sm font-medium" htmlFor={notesId}>Notes</label>
              <textarea
                className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={application.notes ?? ""}
                id={notesId}
                name="notes"
                placeholder="What happened, what to do next."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={isPending} size="sm" type="submit">
              {isPending ? "Saving..." : "Save status"}
            </Button>
          </div>
        </form>
      </div>
    </article>
  );
}

export function ApplicationTracker({ applications, databaseConfigured }: ApplicationTrackerProps) {
  const activeCount = applications.filter((application) => !["Rejected", "Archived"].includes(application.status)).length;
  const appliedCount = applications.filter((application) => application.status === "Applied").length;

  return (
    <div className="space-y-6">
      {!databaseConfigured ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground">
          Preview mode: application tracking needs `DATABASE_URL` and generated packages.
        </div>
      ) : null}

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                <BriefcaseBusiness aria-hidden="true" className="size-4" />
                {applications.length} tracked
              </span>
              <span className="inline-flex h-8 items-center rounded-md border bg-background px-3 text-sm font-medium">
                {activeCount} active
              </span>
              <span className="inline-flex h-8 items-center rounded-md border bg-background px-3 text-sm font-medium">
                {appliedCount} applied
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Move each generated package from draft to applied, keep follow-ups visible, and export records when needed.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <a href="/api/export/applications.csv">
                <Download aria-hidden="true" className="size-4" />
                Export applications
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/api/export/jobs.csv">
                <Download aria-hidden="true" className="size-4" />
                Export jobs
              </a>
            </Button>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-6 text-sm leading-6 text-muted-foreground">
          No applications yet. Open a scored job and generate an application package to start tracking.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <TrackerCard application={application} key={application.id} />
          ))}
        </div>
      )}
    </div>
  );
}

import { auth } from "@/auth";
import { JobManager, type JobListItem } from "@/components/jobs/job-manager";
import { jobRepository } from "@/features/jobs/repository";

async function loadJobs(userId: string): Promise<JobListItem[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await jobRepository.listJobs(userId);
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const session = await auth();
  const jobs = session?.user?.id ? await loadJobs(session.user.id) : [];

  return (
    <section>
      <div className="-mx-4 mb-6 bg-secondary/60 px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="text-sm font-medium text-primary">Job sprint</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Capture roles before they blur</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Add jobs manually, keep the form light, and build the source list that matching and duplicate detection will use next.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Week 7 goal</span>
              <span className="text-primary">Job CRUD ready</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="aca-progress-fill h-full w-3/4 rounded-full" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Save company, title, location, URL, compensation, notes, and description.
            </p>
          </div>
        </div>
      </div>
      <JobManager databaseConfigured={Boolean(process.env.DATABASE_URL)} jobs={jobs} />
    </section>
  );
}

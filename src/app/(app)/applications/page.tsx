import { auth } from "@/auth";
import { ApplicationTracker } from "@/components/applications/application-tracker";
import { applicationRepository } from "@/features/applications/repository";

export default async function ApplicationsPage() {
  const session = await auth();
  const applications =
    session?.user?.id && process.env.DATABASE_URL ? await applicationRepository.listApplications(session.user.id) : [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Week 15 tracker</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Applications</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track generated packages from draft to applied, keep follow-ups visible, and export your job-search records.
        </p>
      </div>

      <ApplicationTracker applications={applications} databaseConfigured={Boolean(process.env.DATABASE_URL)} />
    </section>
  );
}

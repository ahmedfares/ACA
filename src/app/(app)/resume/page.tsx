import { auth } from "@/auth";
import { ResumeManager, type ResumeListItem } from "@/components/resume/resume-manager";
import { resumeRepository } from "@/features/resumes/repository";

async function loadResumes(userId: string): Promise<ResumeListItem[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await resumeRepository.listResumes(userId);
  } catch {
    return [];
  }
}

export default async function ResumePage() {
  const session = await auth();
  const resumes = session?.user?.id ? await loadResumes(session.user.id) : [];

  return (
    <section>
      <div className="-mx-4 mb-6 bg-secondary/60 px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="text-sm font-medium text-primary">Resume sprint</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Create your matching base</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Paste one strong resume, mark it default, and give future job scoring a reliable source of truth.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Week 6 goal</span>
              <span className="text-primary">Resume ready</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-2 w-1/2 rounded-full bg-primary" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Paste text first. Upload parsing and tailored resume rewriting come later.
            </p>
          </div>
        </div>
      </div>
      <ResumeManager databaseConfigured={Boolean(process.env.DATABASE_URL)} resumes={resumes} />
    </section>
  );
}

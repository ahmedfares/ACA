import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { profileRepository } from "@/features/profile/repository";
import { emptyProfileDefaults, profileDefaultsFromBundle } from "@/features/profile/view-model";

async function loadDefaults(userId: string) {
  if (!process.env.DATABASE_URL) {
    return emptyProfileDefaults;
  }

  try {
    const bundle = await profileRepository.getProfileBundle(userId);

    return profileDefaultsFromBundle(bundle);
  } catch {
    return emptyProfileDefaults;
  }
}

export default async function ProfilePage() {
  const session = await auth();
  const defaults = session?.user?.id ? await loadDefaults(session.user.id) : emptyProfileDefaults;

  return (
    <section>
      <div className="-mx-4 mb-6 bg-secondary/60 px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <p className="text-sm font-medium text-primary">Profile sprint</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Build momentum in minutes</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Pick a few fast answers, earn readiness points, and turn a blank job search into a clear action plan.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Today&apos;s win</span>
              <span className="text-primary">+40 pts available</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-2 w-2/5 rounded-full bg-primary" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Finish your profile basics and ACA can start matching roles with more confidence.
            </p>
          </div>
        </div>
      </div>
      <ProfileForm databaseConfigured={Boolean(process.env.DATABASE_URL)} defaults={defaults} />
    </section>
  );
}

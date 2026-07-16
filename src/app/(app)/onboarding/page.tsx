import { auth } from "@/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import { emptyProfileDefaults, profileDefaultsFromBundle } from "@/features/profile/view-model";
import { profileRepository } from "@/features/profile/repository";

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

export default async function OnboardingPage() {
  const session = await auth();
  const defaults = session?.user?.id ? await loadDefaults(session.user.id) : emptyProfileDefaults;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Start with your career profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          This is the minimum foundation the assistant needs before resume, job, and scoring workflows
          can be useful.
        </p>
      </div>
      <ProfileForm databaseConfigured={Boolean(process.env.DATABASE_URL)} defaults={defaults} mode="onboarding" />
    </section>
  );
}

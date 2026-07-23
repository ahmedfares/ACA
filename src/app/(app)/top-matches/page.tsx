import { auth } from "@/auth";
import { TopMatchesList } from "@/components/matching/top-matches-list";
import { matchingRepository } from "@/features/matching/repository";

export default async function TopMatchesPage() {
  const session = await auth();
  const matches =
    session?.user?.id && process.env.DATABASE_URL ? await matchingRepository.listRankedMatches(session.user.id, 10) : [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Week 11 ranking</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Top matches</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          ACA ranks scored jobs so you can spend attention on the strongest eligible roles first. Disqualified and
          skipped jobs stay out of this list.
        </p>
      </div>

      <TopMatchesList
        emptyDescription="No ranked matches yet. Open a saved job, run Score this job, then return here for your ranked top 10."
        matches={matches}
      />
    </section>
  );
}

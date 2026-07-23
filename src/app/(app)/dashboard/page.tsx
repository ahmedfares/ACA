import { auth } from "@/auth";
import { DashboardOverview } from "@/components/app/dashboard-overview";
import { matchingRepository } from "@/features/matching/repository";

export default async function DashboardPage() {
  const session = await auth();
  const topMatches =
    session?.user?.id && process.env.DATABASE_URL ? await matchingRepository.listRankedMatches(session.user.id, 10) : [];

  return <DashboardOverview topMatches={topMatches} />;
}

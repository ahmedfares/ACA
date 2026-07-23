import { auth } from "@/auth";
import { QuestionBankManager } from "@/components/question-bank/question-bank-manager";
import { questionRepository } from "@/features/questions/repository";

export default async function QuestionBankPage() {
  const session = await auth();
  const answers =
    session?.user?.id && process.env.DATABASE_URL ? await questionRepository.listApprovedAnswers(session.user.id) : [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Week 13 answer memory</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Question bank</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Save approved answers and match similar questions without inventing facts. This is the source of truth for
          later application packages.
        </p>
      </div>

      <QuestionBankManager answers={answers} databaseConfigured={Boolean(process.env.DATABASE_URL)} />
    </section>
  );
}

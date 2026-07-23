import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { applicationRepository } from "@/features/applications/repository";
import { rowsToCsv } from "@/features/applications";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !process.env.DATABASE_URL) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const applications = await applicationRepository.listApplicationsForExport(session.user.id);
  const csv = rowsToCsv(
    [
      "company",
      "title",
      "status",
      "application_date",
      "follow_up_date",
      "source",
      "application_url",
      "recruiter_name",
      "recruiter_contact",
      "resume",
      "notes",
      "job_url",
      "updated_at",
    ],
    applications.map((application) => [
      application.job.company,
      application.job.title,
      application.status,
      application.applicationDate,
      application.followUpDate,
      application.source,
      application.applicationUrl,
      application.recruiterName,
      application.recruiterContact,
      application.resume?.label,
      application.notes,
      application.job.jobUrl,
      application.updatedAt,
    ]),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": 'attachment; filename="applications.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

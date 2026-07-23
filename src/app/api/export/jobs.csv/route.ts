import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { applicationRepository } from "@/features/applications/repository";
import { rowsToCsv } from "@/features/applications";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !process.env.DATABASE_URL) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const jobs = await applicationRepository.listJobsForExport(session.user.id);
  const csv = rowsToCsv(
    [
      "company",
      "title",
      "status",
      "location",
      "remote_status",
      "employment_type",
      "salary_min",
      "salary_max",
      "job_url",
      "source",
      "notes",
      "created_at",
      "updated_at",
    ],
    jobs.map((job) => [
      job.company,
      job.title,
      job.status,
      job.location,
      job.remoteStatus,
      job.employmentType,
      job.salaryMin,
      job.salaryMax,
      job.jobUrl,
      job.source,
      job.notes,
      job.createdAt,
      job.updatedAt,
    ]),
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Disposition": 'attachment; filename="jobs.csv"',
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

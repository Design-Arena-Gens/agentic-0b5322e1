import { NextResponse } from "next/server";
import { z } from "zod";
import { createJob, listRecentJobs } from "@/lib/jobs";
import { runAnalysis } from "@/lib/analyzer";

const requestSchema = z.object({
  url: z
    .string()
    .url()
    .refine(
      (value) => value.includes("meesho.com"),
      "Provide a valid Meesho product URL.",
    ),
});

export async function POST(request: Request) {
  const useSampleHeader = request.headers.get("x-meesholens-use-sample");
  const allowSampleFallback = useSampleHeader !== "0";

  const payload = await request.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { url } = parsed.data;

  const recentJobs = await listRecentJobs(12);
  const reusableJob = recentJobs.find(
    (job) =>
      job.url === url &&
      job.status === "complete" &&
      new Date(job.updatedAt).getTime() > Date.now() - 15 * 60 * 1000,
  );

  if (reusableJob) {
    return NextResponse.json({
      jobId: reusableJob.id,
      status: reusableJob.status,
      result: reusableJob.result,
    });
  }

  const job = await createJob(url, "Job accepted and queued.");

  runAnalysis(job.id, url, { allowSampleFallback }).catch((error) => {
    console.error("Background analysis failed", error);
  });

  return NextResponse.json(
    {
      jobId: job.id,
      status: job.status,
      submittedAt: job.createdAt,
    },
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

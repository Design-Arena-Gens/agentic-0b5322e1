import { NextResponse } from "next/server";
import { listRecentJobs } from "@/lib/jobs";

export async function GET() {
  const jobs = await listRecentJobs(12);
  return NextResponse.json(jobs, { headers: { "Cache-Control": "no-store" } });
}

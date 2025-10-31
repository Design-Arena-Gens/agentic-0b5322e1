import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";
import type { RangeKey } from "@/types";

const rangeDurations: Record<RangeKey, number> = {
  "1m": 30,
  "6m": 180,
  life: Number.POSITIVE_INFINITY,
};

export async function GET(request: Request, context: any) {
  const jobId = (context.params?.jobId ?? "") as string;
  const job = await getJob(jobId);

  if (!job || !job.result) {
    return NextResponse.json(
      { error: "Result not ready" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const url = new URL(request.url);
  const range = (url.searchParams.get("range") ?? "life") as RangeKey;
  const days = rangeDurations[range] ?? rangeDurations.life;

  const cutoff =
    days === Number.POSITIVE_INFINITY
      ? 0
      : Date.now() - days * 24 * 60 * 60 * 1000;

  const filteredHistory = job.result.pricing.history.filter((point) => {
    const timestamp = new Date(point.timestamp).getTime();
    return days === Number.POSITIVE_INFINITY || timestamp >= cutoff;
  });

  return NextResponse.json(
    {
      ...job.result,
      pricing: {
        ...job.result.pricing,
        history: filteredHistory,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import { NextResponse } from "next/server";
import { getJob } from "@/lib/jobs";

export async function GET(request: Request, context: any) {
  const jobId = (context.params?.jobId ?? "") as string;
  const job = await getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: "Job not found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const url = new URL(request.url);
  const wantsStream =
    url.searchParams.get("stream") === "1" ||
    request.headers.get("accept")?.includes("text/event-stream");

  if (!wantsStream) {
    return NextResponse.json(job, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let active = true;

      const pushEvent = (payload: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      };

      const emit = async () => {
        const fresh = await getJob(jobId);
        if (!fresh) {
          pushEvent({ error: "not_found" });
          controller.close();
          active = false;
          return;
        }

        pushEvent(fresh);

        if (fresh.status === "complete" || fresh.status === "error") {
          active = false;
          controller.close();
        }
      };

      await emit();

      const interval = setInterval(async () => {
        if (!active) {
          clearInterval(interval);
          return;
        }
        await emit();
      }, 2000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        if (active) {
          controller.close();
        }
        active = false;
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}

"use client";

import { motion } from "framer-motion";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import type { JobLog, JobStatus } from "@/types";

const STEPS: JobStatus[] = [
  "queued",
  "scraping",
  "analyzing",
  "persisting",
  "complete",
];

const LABELS: Record<JobStatus, string> = {
  queued: "Queued",
  scraping: "Scraping product data",
  analyzing: "Analyzing reviews",
  summarizing: "Summarizing findings",
  persisting: "Storing insights",
  complete: "Done",
  error: "Failed",
};

interface ProgressTimelineProps {
  status: JobStatus;
  progress: number;
  logs: JobLog[];
}

export function ProgressTimeline({ status, progress, logs }: ProgressTimelineProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Live Pipeline
        </h3>
        <span className="text-xs text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {STEPS.map((step, index) => {
          const active = STEPS.indexOf(status) >= index;
          const isCurrent = status === step;
          const isComplete = status === "complete" && step === "complete";
          const isError = status === "error" && step !== "complete";

          return (
            <div key={step} className="relative flex items-start gap-3">
              <div className="relative flex h-6 w-6 items-center justify-center">
                {isComplete || (active && step !== "complete") ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                ) : isError ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger/10 text-danger">
                    <TriangleAlert className="h-4 w-4" />
                  </span>
                ) : isCurrent ? (
                  <motion.span
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-accent text-accent"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {LABELS[step]}
                </p>
                {isCurrent && logs.length > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {logs[logs.length - 1]?.message}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {status === "error" ? (
        <p className="mt-5 rounded-2xl border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
          Something went wrong while scraping. Please retry in a minute.
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, RefreshCcw } from "lucide-react";
import type { AnalysisResult, JobRecord } from "@/types";

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  price: number;
  generatedAt: string;
  rating: number;
}

function mapJobToHistory(job: JobRecord): HistoryItem | null {
  if (!job.result) return null;
  return {
    id: job.id,
    title: job.result.product.title,
    url: job.result.product.url,
    price: job.result.pricing.currentPrice,
    generatedAt: job.result.generatedAt,
    rating: job.result.product.averageRating,
  };
}

function loadLocalHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = JSON.parse(
      window.localStorage.getItem("meesholens-history") ?? "[]",
    ) as AnalysisResult[];
    return stored.map((result) => ({
      id: result.jobId,
      title: result.product.title,
      url: result.product.url,
      price: result.pricing.currentPrice,
      generatedAt: result.generatedAt,
      rating: result.product.averageRating,
    }));
  } catch (error) {
    console.warn("Failed to parse local history", error);
    return [];
  }
}

export function HistoryScreen() {
  const [localHistory] = useState<HistoryItem[]>(() => loadLocalHistory());

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["recent-jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs/recent");
      if (!response.ok) {
        throw new Error("Failed to load history");
      }
      const jobs = (await response.json()) as JobRecord[];
      return jobs
        .map(mapJobToHistory)
        .filter(Boolean) as HistoryItem[];
    },
    staleTime: 5000,
  });

  const combined = [...(data ?? []), ...localHistory].reduce<HistoryItem[]>(
    (acc, item) => {
      if (acc.some((existing) => existing.id === item.id)) {
        return acc;
      }
      acc.push(item);
      return acc;
    },
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Recent Analyses</h1>
          <p className="text-sm text-muted-foreground">
            The 12 most recent Meesho lenses you generated.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-accent hover:text-accent"
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {combined.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
            No history yet. Run an analysis to populate this timeline.
          </div>
        ) : (
          combined
            .sort((a, b) => (a.generatedAt < b.generatedAt ? 1 : -1))
            .map((item) => (
              <Link
                href={item.url}
                key={item.id}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-white/10 bg-surface p-5 transition hover:border-accent/60"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.generatedAt))}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>₹{item.price}</span>
                    <span>Rating {item.rating.toFixed(1)}★</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> revisit</span>
                  </div>
                </div>
              </Link>
            ))
        )}
      </div>
    </div>
  );
}

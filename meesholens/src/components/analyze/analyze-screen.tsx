"use client";

import { startTransition, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { ProgressTimeline } from "@/components/analyze/progress-timeline";
import { ProductOverview } from "@/components/analyze/product-overview";
import { PriceTrendCard } from "@/components/analyze/price-trend-card";
import { SentimentCard } from "@/components/analyze/sentiment-card";
import { ReviewList } from "@/components/analyze/review-list";
import { InsightsPanel } from "@/components/analyze/insights-panel";
import type { AnalysisResult, JobRecord } from "@/types";

interface AnalyzeResponse {
  jobId: string;
  status: string;
  result?: AnalysisResult;
}

type ClientPreference = {
  autoRefresh: boolean;
  useSample: boolean;
};

const defaultPrefs: ClientPreference = {
  autoRefresh: true,
  useSample: true,
};

function readPreferences(): ClientPreference {
  if (typeof window === "undefined") {
    return defaultPrefs;
  }
  try {
    const stored = window.localStorage.getItem("meesholens-settings");
    if (!stored) return defaultPrefs;
    const parsed = JSON.parse(stored) as ClientPreference;
    return { ...defaultPrefs, ...parsed };
  } catch (error) {
    console.warn("Failed to read preferences", error);
    return defaultPrefs;
  }
}

export function AnalyzeScreen() {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<AnalysisResult | null>(null);
  const [preferences, setPreferences] = useState<ClientPreference>(() =>
    readPreferences(),
  );

  const statusQuery = useQuery({
    queryKey: ["job-status", jobId],
    queryFn: async () => {
      if (!jobId) return null;
      const response = await fetch(`/api/status/${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job status");
      }
      return (await response.json()) as JobRecord;
    },
    enabled: Boolean(jobId),
    refetchInterval(query) {
      if (!preferences.autoRefresh) {
        return false;
      }
      const job = query.state.data as JobRecord | null | undefined;
      if (!job) {
        return false;
      }
      if (job.status === "complete" || job.status === "error") {
        return false;
      }
      return 2000;
    },
    staleTime: 2000,
  });

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const currentPrefs = readPreferences();
      setPreferences(currentPrefs);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-meesholens-use-sample": currentPrefs.useSample ? "1" : "0",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error ?? "Failed to start analysis");
      }

      return (await response.json()) as AnalyzeResponse;
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
      if (data.result) {
        setLatestResult(data.result);
      } else {
        setLatestResult(null);
      }
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const job = statusQuery.data;
    if (!job || job.status !== "complete" || !job.result) {
      return;
    }
    startTransition(() => {
      setLatestResult(job.result as AnalysisResult);
    });
    queryClient.setQueryData(["results", job.id, "life"], () => ({
      pricing: job.result!.pricing,
    }));

    if (typeof window !== "undefined") {
      const history = JSON.parse(
        window.localStorage.getItem("meesholens-history") ?? "[]",
      ) as AnalysisResult[];
      const nextHistory = [job.result, ...history]
        .slice(0, 12)
        .map((entry) => ({
          ...entry,
          generatedAt: entry.generatedAt,
        }));
      window.localStorage.setItem(
        "meesholens-history",
        JSON.stringify(nextHistory),
      );
    }
  }, [statusQuery.data, queryClient]);

  const handleSubmit = async (url: string) => {
    await analyzeMutation.mutateAsync(url);
  };

  const isLoading =
    analyzeMutation.isPending || statusQuery.data?.status === "queued" ||
    statusQuery.data?.status === "scraping" ||
    statusQuery.data?.status === "analyzing" ||
    statusQuery.data?.status === "persisting";

  const logs = statusQuery.data?.logs ?? [];
  const progress = statusQuery.data?.progress ?? (latestResult ? 100 : 0);
  const status = statusQuery.data?.status ?? "queued";

  const downloadReport = () => {
    if (!jobId) return;
    window.open(`/api/report/${jobId}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      <AnalyzeForm isLoading={isLoading} onSubmit={handleSubmit} />

      {jobId ? (
        <ProgressTimeline status={status} progress={progress} logs={logs} />
      ) : null}

      {latestResult ? (
        <div className="flex flex-col gap-6">
          <ProductOverview result={latestResult} onDownloadReport={downloadReport} />
          <PriceTrendCard
            jobId={jobId ?? latestResult.jobId}
            initialPricing={latestResult.pricing}
          />
          <InsightsPanel insights={latestResult.insights} />
          <SentimentCard insights={latestResult.insights} />
          <ReviewList reviews={latestResult.reviews} />
        </div>
      ) : null}
    </div>
  );
}

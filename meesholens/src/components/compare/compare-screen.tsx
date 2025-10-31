"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { JobRecord } from "@/types";

interface ComparisonSnapshot {
  id: string;
  label: string;
  price: number;
  rating: number;
  seller: string;
  url: string;
  revenue: number;
}

function mapJob(job: JobRecord): ComparisonSnapshot | null {
  if (!job.result) return null;
  return {
    id: job.id,
    label: job.result.product.title,
    price: job.result.pricing.currentPrice,
    rating: job.result.product.averageRating,
    seller: job.result.product.seller.name,
    url: job.result.product.url,
    revenue: job.result.insights.salesBehavior.estimatedMonthlyRevenue,
  };
}

export function CompareScreen() {
  const { data } = useQuery({
    queryKey: ["recent-jobs"],
    queryFn: async () => {
      const response = await fetch("/api/jobs/recent");
      if (!response.ok) {
        throw new Error("Failed to load comparisons");
      }
      const jobs = (await response.json()) as JobRecord[];
      return jobs.map(mapJob).filter(Boolean) as ComparisonSnapshot[];
    },
    staleTime: 5_000,
  });

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);

  const fallbackLeftId = data?.[0]?.id ?? "";
  const fallbackRightId = data?.[1]?.id ?? fallbackLeftId;

  const leftId = selectedLeftId ?? fallbackLeftId;
  const rightId = selectedRightId ?? fallbackRightId;

  const left = useMemo(
    () => data?.find((item) => item.id === leftId),
    [data, leftId],
  );
  const right = useMemo(
    () => data?.find((item) => item.id === rightId),
    [data, rightId],
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Compare Listings
          </h1>
          <p className="text-sm text-muted-foreground">
            Benchmark live Meesho listings side-by-side.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-surface p-5">
          <label className="text-xs font-semibold uppercase text-muted-foreground">
            Primary product
          </label>
          <select
            value={leftId}
            onChange={(event) =>
              setSelectedLeftId(event.target.value || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-background/80 px-3 py-2 text-sm text-foreground"
          >
            {data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label.slice(0, 70)}
              </option>
            ))}
          </select>
          {left ? (
            <div className="mt-4 space-y-2 text-sm text-foreground">
              <p>Price: ₹{left.price}</p>
              <p>Rating: {left.rating.toFixed(1)}★</p>
              <p>Seller: {left.seller}</p>
              <p>
                Revenue Potential: ₹{left.revenue.toLocaleString("en-IN")}
              </p>
              <a
                href={left.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs text-accent hover:underline"
              >
                View listing
              </a>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-surface p-5">
          <label className="text-xs font-semibold uppercase text-muted-foreground">
            Secondary product
          </label>
          <select
            value={rightId}
            onChange={(event) =>
              setSelectedRightId(event.target.value || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-background/80 px-3 py-2 text-sm text-foreground"
          >
            {data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label.slice(0, 70)}
              </option>
            ))}
          </select>
          {right ? (
            <div className="mt-4 space-y-2 text-sm text-foreground">
              <p>Price: ₹{right.price}</p>
              <p>Rating: {right.rating.toFixed(1)}★</p>
              <p>Seller: {right.seller}</p>
              <p>
                Revenue Potential: ₹{right.revenue.toLocaleString("en-IN")}
              </p>
              <a
                href={right.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-xs text-accent hover:underline"
              >
                View listing
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {left && right ? (
        <div className="rounded-3xl border border-white/10 bg-surface p-5 text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Delta Snapshot
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Price Difference</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{Math.abs(left.price - right.price).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Rating Gap</p>
              <p className="text-lg font-semibold text-foreground">
                {(left.rating - right.rating).toFixed(2)}★
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Revenue Spread</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{Math.abs(left.revenue - right.revenue).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Preferred Seller</p>
              <p className="text-lg font-semibold text-foreground">
                {left.rating >= right.rating ? left.seller : right.seller}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

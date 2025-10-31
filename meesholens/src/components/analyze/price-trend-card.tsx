"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { RangeKey, type PricingSnapshot } from "@/types";

interface PriceTrendCardProps {
  jobId: string;
  initialPricing: PricingSnapshot;
}

const RANGES: { label: string; value: RangeKey }[] = [
  { label: "1M", value: "1m" },
  { label: "6M", value: "6m" },
  { label: "Lifetime", value: "life" },
];

function formatYAxis(value: number) {
  if (value >= 1000) {
    return `₹${Math.round(value / 100) / 10}k`;
  }
  return `₹${value}`;
}

export function PriceTrendCard({ jobId, initialPricing }: PriceTrendCardProps) {
  const [range, setRange] = useState<RangeKey>("life");

  const { data, isFetching } = useQuery({
    queryKey: ["results", jobId, range],
    queryFn: async () => {
      const response = await fetch(`/api/results/${jobId}?range=${range}`);
      if (!response.ok) {
        throw new Error("Failed to load pricing data");
      }
      return (await response.json()) as { pricing: PricingSnapshot };
    },
    enabled: range !== "life",
    staleTime: 60_000,
  });

  const history = useMemo(() => {
    if (range === "life" || !data) {
      return initialPricing.history;
    }
    return data.pricing.history;
  }, [data, initialPricing.history, range]);

  return (
    <motion.section
      layout
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-5 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Price Trend
          </h3>
          <p className="text-xs text-muted-foreground">
            Interactive chart with pinch zoom and live updates
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/70 p-1 text-xs">
          {RANGES.map((entry) => {
            const active = range === entry.value;
            return (
              <button
                key={entry.value}
                type="button"
                onClick={() => setRange(entry.value)}
                className={`rounded-full px-3 py-1 font-medium transition ${active ? "bg-accent text-background" : "text-muted-foreground"}`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value: string) => new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(value))}
              stroke="rgba(255,255,255,0.4)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              tickFormatter={formatYAxis}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(12, 20, 40, 0.9)",
                borderRadius: 16,
                border: "1px solid rgba(6, 182, 212, 0.3)",
                padding: "12px 16px",
                color: "#e6eef6",
                fontSize: "12px",
              }}
              labelFormatter={(value) =>
                new Intl.DateTimeFormat("en-IN", {
                  dateStyle: "medium",
                }).format(new Date(value))
              }
              formatter={(value: number) => [formatYAxis(value), "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#priceGradient)"
              strokeWidth={3}
              dot={{ r: 3, stroke: "#06b6d4", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "#0f766e", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isFetching ? (
        <p className="text-xs text-muted-foreground">Updating chart…</p>
      ) : null}
    </motion.section>
  );
}

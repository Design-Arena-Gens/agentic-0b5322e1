"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import type { AnalysisInsights } from "@/types";

interface SentimentCardProps {
  insights: AnalysisInsights;
}

const COLORS = ["#06b6d4", "#4f46e5", "#f97316"];

export function SentimentCard({ insights }: SentimentCardProps) {
  const sentimentData = [
    { name: "Positive", value: insights.sentiment.positive },
    { name: "Neutral", value: insights.sentiment.neutral },
    { name: "Negative", value: insights.sentiment.negative },
  ];

  const total = sentimentData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <motion.section
      layout
      className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-surface p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Sentiment & Topics
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="h-48 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(12, 20, 40, 0.9)",
                  borderRadius: 16,
                  border: "1px solid rgba(15,118,110,0.4)",
                  color: "#e6eef6",
                  fontSize: "12px",
                }}
              />
              <Pie
                data={sentimentData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {sentimentData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            {total} recent reviews analyzed
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4 text-sm text-foreground">
            {insights.summary}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {insights.topTopics.map((topic) => (
              <div
                key={topic.label}
                className="rounded-2xl border border-white/10 bg-background/70 p-3"
              >
                <p className="text-sm font-semibold capitalize text-foreground">
                  {topic.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Signal strength {(topic.strength * 100).toFixed(0)}%
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topic.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-accent-soft px-2 py-1 text-[11px] text-accent"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

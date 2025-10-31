"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, TrendingUp } from "lucide-react";
import type { AnalysisInsights } from "@/types";

interface InsightsPanelProps {
  insights: AnalysisInsights;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <motion.section
      layout
      className="grid gap-4 md:grid-cols-2"
    >
      <div className="rounded-3xl border border-white/10 bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-accent" /> Sales Behavior
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-foreground">
            Momentum: <span className="capitalize">{insights.salesBehavior.momentum}</span>
          </p>
          <p className="text-foreground">
            Revenue Potential: {formatCurrency(insights.salesBehavior.estimatedMonthlyRevenue)}
          </p>
          <p className="text-muted-foreground text-xs">
            Confidence {Math.round(insights.salesBehavior.confidence * 100)}%
          </p>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {insights.salesBehavior.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Target className="h-4 w-4 text-accent" /> Buyer Profiles
        </div>
        <div className="mt-4 grid gap-3">
          {insights.buyerProfiles.map((profile) => (
            <div
              key={profile.label}
              className="rounded-2xl border border-white/10 bg-background/70 p-4 text-sm"
            >
              <div className="flex items-center justify-between text-foreground">
                <span className="font-semibold">{profile.label}</span>
                <span>{Math.round(profile.share * 100)}%</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {profile.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="rounded-3xl border border-white/10 bg-surface p-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-accent" /> Recommended Plays
          </div>
          <ol className="mt-4 grid gap-2 text-sm text-foreground md:grid-cols-3">
            {insights.suggestedActions.map((action, index) => (
              <li
                key={action}
                className="rounded-2xl border border-white/10 bg-background/70 p-3 text-xs text-muted-foreground"
              >
                <span className="mb-1 block text-sm font-semibold text-foreground">
                  #{index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </motion.section>
  );
}

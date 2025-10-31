"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { DownloadIcon, ExternalLink, Store, TrendingUp } from "lucide-react";
import type { AnalysisResult } from "@/types";

interface ProductOverviewProps {
  result: AnalysisResult;
  onDownloadReport: () => void;
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductOverview({ result, onDownloadReport }: ProductOverviewProps) {
  const { product, pricing } = result;
  const delta = pricing.delta ?? 0;
  const deltaLabel = delta === 0 ? "No change" : `${delta > 0 ? "▲" : "▼"} ${formatCurrency(Math.abs(delta), pricing.currency)}`;
  const summarySnippet =
    result.insights.summary.length > 72
      ? `${result.insights.summary.slice(0, 72)}…`
      : result.insights.summary;

  return (
    <motion.section
      layout
      className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-surface p-6 shadow-lg shadow-black/10 md:flex-row md:items-center"
    >
      <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/10 md:h-40 md:w-48">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {product.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {product.category}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm font-medium md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Live Price</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(pricing.currentPrice, pricing.currency)}
            </p>
            <p className="text-xs text-accent">{deltaLabel}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Discount</p>
            <p className="text-lg font-semibold text-foreground">
              {pricing.discountPercentage ?? 0}%
            </p>
            <p className="text-xs text-muted-foreground">vs last seen</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-lg font-semibold text-foreground">
              {product.averageRating.toFixed(1)} ★
            </p>
            <p className="text-xs text-muted-foreground">{product.ratingCount} ratings</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Momentum</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {result.insights.salesBehavior.momentum}
            </p>
            <p className="text-xs text-muted-foreground">
              Est. monthly: {formatCurrency(result.insights.salesBehavior.estimatedMonthlyRevenue, pricing.currency)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> {summarySnippet}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted/40 px-3 py-1">
            <Store className="h-3.5 w-3.5" /> {product.seller.name}
          </span>
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-accent hover:border-accent"
          >
            View listing
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <button
        onClick={onDownloadReport}
        className="hidden shrink-0 items-center gap-2 rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-background md:inline-flex"
      >
        <DownloadIcon className="h-4 w-4" />
        Export PDF
      </button>
    </motion.section>
  );
}

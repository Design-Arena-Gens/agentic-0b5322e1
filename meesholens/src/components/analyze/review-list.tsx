"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircleMore } from "lucide-react";
import type { ReviewRecord } from "@/types";

interface ReviewListProps {
  reviews: ReviewRecord[];
}

const sentimentStyles: Record<string, string> = {
  positive: "bg-success/15 text-success",
  neutral: "bg-accent-soft text-accent",
  negative: "bg-danger/15 text-danger",
};

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <motion.section
      layout
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-5 md:p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Voice of customer
        </h3>
        <span className="text-xs text-muted-foreground">
          {reviews.length} reviews captured
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-white/10 bg-background/70 p-4 text-sm"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {review.author}
              </span>
              <span>•</span>
              <span>{new Date(review.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{review.rating.toFixed(1)} ★</span>
              {review.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm text-foreground">{review.text}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {review.sentiment ? (
                <span
                  className={`rounded-full px-3 py-1 capitalize ${sentimentStyles[review.sentiment] ?? ""}`}
                >
                  {review.sentiment}
                </span>
              ) : null}
              {review.topics?.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-accent-soft px-3 py-1 text-[11px] text-accent"
                >
                  #{topic}
                </span>
              ))}
              {review.buyerProfile ? (
                <span className="rounded-full bg-primary-soft px-3 py-1 text-[11px] text-primary">
                  {review.buyerProfile}
                </span>
              ) : null}
            </div>

            {review.images.length ? (
              <div className="mt-3 flex gap-2">
                {review.images.map((src) => (
                  <div
                    key={src}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10"
                  >
                    <Image src={src} alt="Review photo" fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {reviews.length === 0 ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-background/60 px-4 py-6 text-sm text-muted-foreground">
          <MessageCircleMore className="h-4 w-4" />
          No reviews visible on the listing yet.
        </div>
      ) : null}
    </motion.section>
  );
}

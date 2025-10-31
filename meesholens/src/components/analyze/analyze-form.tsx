"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

interface AnalyzeFormProps {
  defaultValue?: string;
  isLoading?: boolean;
  onSubmit: (url: string) => Promise<void> | void;
}

export function AnalyzeForm({
  defaultValue = "",
  isLoading = false,
  onSubmit,
}: AnalyzeFormProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!value.trim()) {
      setError("Paste a Meesho product link to get started.");
      return;
    }

    if (!value.includes("meesho.com")) {
      setError("Only Meesho product URLs are supported right now.");
      return;
    }

    await onSubmit(value.trim());
  };

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-5 shadow-lg shadow-black/10 md:p-8"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Meesho product URL
        </label>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://www.meesho.com/..."
          className="w-full rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          We launch a fresh Playwright session for every request to fetch live
          pricing, reviews, and seller signals. Results are cached for 15
          minutes per URL.
        </p>
      )}

      <motion.button
        type="submit"
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? "Analyzing Live Data…" : "Analyze Product"}
      </motion.button>
    </motion.form>
  );
}

"use client";

import { useEffect, useState } from "react";

interface SettingsState {
  useSample: boolean;
  autoRefresh: boolean;
}

function loadSettings(): SettingsState {
  if (typeof window === "undefined") {
    return { useSample: true, autoRefresh: true };
  }
  try {
    const stored = window.localStorage.getItem("meesholens-settings");
    if (!stored) {
      return { useSample: true, autoRefresh: true };
    }
    const parsed = JSON.parse(stored) as SettingsState;
    return {
      useSample: parsed.useSample ?? true,
      autoRefresh: parsed.autoRefresh ?? true,
    };
  } catch (error) {
    console.warn("Failed to read stored settings", error);
    return { useSample: true, autoRefresh: true };
  }
}

export function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      "meesholens-settings",
      JSON.stringify(settings),
    );
  }, [settings]);

  const { useSample, autoRefresh } = settings;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure client-side preferences for MeeshoLens.
        </p>
      </header>

      <div className="rounded-3xl border border-white/10 bg-surface p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Runtime Preferences
        </h2>
        <div className="mt-4 space-y-4 text-sm text-foreground">
          <label className="flex items-center justify-between gap-4">
            <span>
              Use sample data fallback
              <p className="text-xs text-muted-foreground">
                When enabled, analyses fall back to curated sample payloads if live scraping fails.
              </p>
            </span>
            <input
              type="checkbox"
              checked={useSample}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  useSample: event.target.checked,
                }))
              }
              className="h-5 w-5 rounded border border-white/10 accent-accent"
            />
          </label>

          <label className="flex items-center justify-between gap-4">
            <span>
              Auto refresh job status
              <p className="text-xs text-muted-foreground">
                Enables continuous polling for live job status updates.
              </p>
            </span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  autoRefresh: event.target.checked,
                }))
              }
              className="h-5 w-5 rounded border border-white/10 accent-accent"
            />
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-surface p-6 text-sm text-muted-foreground">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Environment checklist
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Set <code>OPENAI_API_KEY</code> for live AI summaries.</li>
          <li>Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> to persist analyses.</li>
          <li>Set <code>UPSTASH_REDIS_URL</code> & <code>UPSTASH_REDIS_TOKEN</code> for distributed job state.</li>
          <li>Set <code>PLAYWRIGHT_ENABLED=true</code> to scrape Meesho in production.</li>
        </ul>
      </div>
    </div>
  );
}

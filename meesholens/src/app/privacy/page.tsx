import { AppShell } from "@/components/layout/app-shell";

export default function PrivacyPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-6 text-sm text-foreground">
        <h1 className="text-xl font-semibold">Privacy Notice</h1>
        <p className="text-sm text-muted-foreground">
          MeeshoLens fetches live, publicly available data from Meesho product
          pages only after you paste a link and request an analysis. We do not
          perform unsolicited background scraping. If Supabase storage is
          configured, we retain product metadata, generated insights, and
          anonymised review analytics strictly for reporting.
        </p>
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Data We Process
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Product metadata (title, category, seller, pricing signals).</li>
            <li>Public review text, rating, verification status, and imagery.</li>
            <li>Derived analytics (sentiment, topics, buyer archetypes).</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Retention
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Job payloads live in Redis for 15 minutes to enable responsive
            replays. Persistent storage in Supabase is optional and can be
            managed directly from your database. Remove entries anytime.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Third-party Services
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Live scraping leverages Playwright with your proxy choice. AI
            summaries use OpenAI. Storage depends on Supabase and Upstash.
            Enable Sentry only if you require production monitoring.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

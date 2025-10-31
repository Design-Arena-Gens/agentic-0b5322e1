<div align="center">
  <img src="./public/logo.svg" alt="MeeshoLens" width="96" />

  # MeeshoLens — Real-time Meesho Product Intelligence

  A mobile-first Next.js 14 experience that scrapes live Meesho product pages, enriches them with AI-driven insights, and serves interactive dashboards optimised for Vercel.
</div>

## ✨ Feature Highlights

- **Live scraping pipeline** powered by Playwright (with stealth) and optional rotating proxies
- **AI intelligence** via OpenAI GPT-4o-mini for sentiment, buyer profiles, and sales behaviour narratives
- **Realtime job orchestration** with Upstash Redis-backed job state and SSE status streaming
- **Rich analytics UI** using React Query polling, Recharts pinch-friendly charts, Framer Motion transitions, and dark mode by default
- **Persistent storage** hooks for Supabase (products, reviews, price history, jobs)
- **Export tooling** with server-rendered PDF snapshots for quick reporting

## 🗂️ Project Structure

```
src/
  app/
    api/        → REST & SSE endpoints (analyze, status, results, report, jobs)
    (routes)/   → App-router pages (analyze, history, compare, settings, legal)
  components/  → UI building blocks (analysis, history, layout, settings)
  lib/         → Jobs store, scraper, AI analysis, Supabase adapters
  types/       → Shared TypeScript contracts for API & UI
data/sample-analysis.json → Offline payload used when scraping is disabled
```

## ⚙️ Environment Setup

Copy `.env.example` to `.env.local` and populate the values that apply to your environment:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Required for live GPT-4o-mini insights; fallback heuristics used if absent |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Persist analysis results to Postgres (optional) |
| `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN` | Shared job store + 15 min caching (optional) |
| `PLAYWRIGHT_ENABLED` | Set to `true` in production to enable real scraping |
| `SCRAPER_PROXY_URL` | Optional HTTPS proxy endpoint (BrightData/ScraperAPI/etc.) |
| `SENTRY_DSN` | Optional Sentry monitoring |

> Without Playwright enabled the API automatically falls back to the bundled sample analysis payload.

## 🚀 Running Locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Manual pipeline smoke test

```bash
curl --request POST http://localhost:3000/api/analyze \
  --header 'Content-Type: application/json' \
  --data '{"url":"https://www.meesho.com/sample-product/p/12345"}'

curl http://localhost:3000/api/status/{jobId}
curl 'http://localhost:3000/api/results/{jobId}?range=1m'
curl http://localhost:3000/api/report/{jobId} --output report.pdf
```

## 🧠 Insight Generation

- Reviews are enriched with heuristic sentiment/topic clustering locally to reduce token consumption
- When `OPENAI_API_KEY` is present the pipeline upgrades summaries using GPT-4o-mini with structured JSON output
- Buyer archetypes, suggested actions, and sales momentum are surfaced in the UI & PDF report

## 🕸️ Scraper Notes

- Playwright is configured with stealth mode and awaits network idle before parsing JSON-LD & DOM fallbacks
- Provide `SCRAPER_PROXY_URL` or set environment-specific proxy config to avoid rate limits
- Respect Meesho robots.txt — the API only fires when the user explicitly submits a link
- Cached jobs live for 15 minutes; repeated submissions within that window reuse the prior result

## 📦 Deployment

1. Ensure the environment variables above are configured in Vercel
2. Build locally before deploying:

   ```bash
   npm run lint
   npm run build
   ```

3. Deploy from the repository root (token must exist in env):

   ```bash
   vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-0b5322e1
   ```

4. Verify the production deployment:

   ```bash
   curl https://agentic-0b5322e1.vercel.app
   ```

## 🛡️ Compliance & Safety

- Surface-level legal & privacy copy is available under `/privacy` and `/disclaimer`
- Jobs and user-triggered analyses are logged but personal data is never stored
- Respect Meesho marketplace terms by keeping usage human-in-the-loop and rate limited

## 🧪 Monitoring & Extensibility

- Wire up Sentry by setting `SENTRY_DSN` (Next.js already supports automatic instrumentation)
- Extend Supabase schema with vector embeddings for semantic review search if needed
- Add scheduled Cloud Run / CRON jobs to re-run analyses every 12h for longitudinal charts

Happy building! 💡

import { AppShell } from "@/components/layout/app-shell";

export default function DisclaimerPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-6 text-sm text-foreground">
        <h1 className="text-xl font-semibold">Usage Disclaimer</h1>
        <p className="text-sm text-muted-foreground">
          MeeshoLens is an intelligence companion intended for competitive
          benchmarking and trend monitoring on the Meesho marketplace. Always
          comply with Meesho&apos;s Terms of Service and applicable laws when
          fetching product data. The tool operates only on-demand and does not
          run autonomous crawlers.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Analytical outputs are estimates and should be validated manually.</li>
          <li>Revenue projections are heuristics based on review velocity and pricing.</li>
          <li>Respect customer privacy—do not extract personal information from reviews.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          By using MeeshoLens you accept that data availability can change at
          any time if Meesho updates its website or policies. Integrate your own
          proxy rotation and rate limits for production workloads.
        </p>
      </div>
    </AppShell>
  );
}

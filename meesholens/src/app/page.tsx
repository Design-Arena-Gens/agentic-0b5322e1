import { AppShell } from "@/components/layout/app-shell";
import { AnalyzeScreen } from "@/components/analyze/analyze-screen";

export default function Home() {
  return (
    <AppShell>
      <AnalyzeScreen />
    </AppShell>
  );
}

"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { BottomNav } from "@/components/navigation/bottom-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 flex flex-col gap-4 border-b border-white/5 bg-background/80 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <Logo withTagline />
          <ThemeToggle />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-xs leading-relaxed text-muted-foreground"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-accent" />
            <p>
              Live data is fetched directly from public Meesho product pages.
              Respect the platform&apos;s terms, only trigger analyses for your
              own research, and avoid automated bulk scraping.
            </p>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {children}
        </motion.div>
      </main>

      <footer className="hidden items-center justify-between gap-4 border-t border-white/5 bg-surface px-6 py-4 text-xs text-muted-foreground md:flex">
        <span>© {new Date().getFullYear()} MeeshoLens Live Intelligence</span>
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-accent">
            Privacy
          </Link>
          <span className="text-white/20">•</span>
          <Link href="/disclaimer" className="hover:text-accent">
            Disclaimer
          </Link>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, History, Settings2, GitMerge } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Analyze", icon: Search },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: GitMerge },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-50 border-t border-white/5 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85 md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium text-muted-foreground"
            >
              {active ? (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -top-1 h-1 w-12 rounded-full bg-accent"
                />
              ) : null}
              <Icon
                className={`h-5 w-5 ${active ? "text-accent" : "text-muted-foreground"}`}
              />
              <span className={active ? "text-accent" : "text-muted-foreground"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

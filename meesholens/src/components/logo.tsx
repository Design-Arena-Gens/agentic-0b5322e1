export function Logo({ withTagline = false }: { withTagline?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-soft">
        <svg
          viewBox="0 0 48 48"
          className="h-6 w-6 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="22" cy="22" r="10" className="opacity-90" />
          <path d="M30 30L40 40" strokeLinecap="round" />
          <path d="M18 22c2-4 8-6 12-2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="leading-tight">
        <span className="block text-base font-semibold tracking-tight text-foreground">
          MeeshoLens
        </span>
        {withTagline ? (
          <span className="block text-xs text-muted-foreground">
            Real-time product intelligence
          </span>
        ) : null}
      </div>
    </div>
  );
}

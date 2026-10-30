import { icons } from "@/lib/icons";

/** Editorial line-art empty-state illustration (spec §18.1). */
export function RadarIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      aria-hidden
      className={className}
      stroke="var(--accent-solid)"
    >
      <circle cx="80" cy="62" r="42" strokeWidth="1" opacity="0.35" />
      <circle cx="80" cy="62" r="28" strokeWidth="1" opacity="0.5" />
      <circle cx="80" cy="62" r="14" strokeWidth="1" opacity="0.7" />
      <path d="M80 62 L118 40" strokeWidth="1.25" />
      <path
        d="M22 92 C44 84, 52 60, 72 54 C92 48, 104 70, 138 44"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle cx="118" cy="40" r="2.5" fill="var(--accent-solid)" stroke="none" />
      <path d="M14 104 H146" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export function EmptyState({
  variant = "data",
  title,
  description,
  action,
}: {
  variant?: "data" | "results";
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  const Icon = variant === "data" ? icons.emptyData : icons.emptyResults;
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <RadarIllustration className="h-24 w-32" />
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        {title}
      </div>
      <p className="mt-1.5 max-w-sm text-[13px] text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

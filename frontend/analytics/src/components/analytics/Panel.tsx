import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-surface shadow-xs transition-all duration-200",
        padded && "p-5 sm:p-6 lg:p-7",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  question,
  action,
}: {
  eyebrow?: string;
  title: string;
  question?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl text-foreground">{title}</h2>
        {question ? (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground leading-relaxed">{question}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

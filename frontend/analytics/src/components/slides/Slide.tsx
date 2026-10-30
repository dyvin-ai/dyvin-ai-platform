import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared <Slide> primitive (spec §19) — used by the onboarding carousel,
 * report export slides and agent-run summaries.
 */
export function Slide({
  children,
  className,
  aspect = false,
}: {
  children: ReactNode;
  className?: string;
  aspect?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-surface p-5 sm:p-6",
        aspect && "aspect-video justify-between",
        className,
      )}
    >
      {children}
    </article>
  );
}

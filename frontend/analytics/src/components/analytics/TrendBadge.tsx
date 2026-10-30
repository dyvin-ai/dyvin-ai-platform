import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
  label?: string;
};

export function TrendBadge({ value, suffix = " pts", className, label }: Props) {
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold tnum select-none",
        dir === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
        dir === "down" && "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        dir === "flat" && "bg-surface-subtle text-muted-foreground border border-border/60",
        className,
      )}
    >
      {dir === "up" && <TrendingUp className="size-3 shrink-0" aria-hidden />}
      {dir === "down" && <TrendingDown className="size-3 shrink-0" aria-hidden />}
      {dir === "flat" && <Minus className="size-3 shrink-0" aria-hidden />}
      <span>
        {dir === "flat" ? (
          "0.0"
        ) : (
          <>
            {value > 0 ? "+" : ""}
            {value.toFixed(1)}
            {suffix}
          </>
        )}
      </span>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

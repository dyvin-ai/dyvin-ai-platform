import { TrendBadge } from "./TrendBadge";

export function MetricHero({
  eyebrow,
  value,
  suffix = "%",
  change,
  statement,
  context,
}: {
  eyebrow: string;
  value: number;
  suffix?: string;
  change: number;
  statement: string;
  context: string[];
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {eyebrow}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="font-mono text-[42px] sm:text-[48px] font-bold leading-none tracking-tight text-foreground tnum">
          {value.toFixed(1)}
          <span className="text-3xl sm:text-4xl text-muted-foreground ml-0.5">{suffix}</span>
        </span>
        <TrendBadge value={change} className="mb-0.5" />
      </div>
      <p className="mt-3 max-w-lg text-sm font-medium text-foreground leading-relaxed">{statement}</p>
      <p className="mt-1.5 text-xs text-muted-foreground font-mono">{context.join(" · ")}</p>
    </div>
  );
}

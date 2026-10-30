import type { Insight } from "@/types";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CheckCircle2, Layers, Sparkles } from "lucide-react";

const meta: Record<
  Insight["category"],
  { label: string; className: string; Icon: typeof icons.success }
> = {
  winning: { label: "Winning", className: "bg-success-bg text-success", Icon: icons.success },
  losing: { label: "Losing", className: "bg-danger-bg text-danger", Icon: icons.danger },
  opportunity: {
    label: "Opportunity",
    className: "bg-warning-bg text-warning",
    Icon: icons.warning,
  },
  competitive: { label: "Competitive", className: "bg-info-bg text-info", Icon: icons.competitors },
  source: { label: "Source", className: "bg-info-bg text-info", Icon: icons.sources },
  prompt: { label: "Prompt", className: "bg-surface-subtle text-muted-foreground", Icon: icons.prompts },
};

const severityStyles = {
  CRITICAL: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  HIGH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  MEDIUM: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  INFO: "bg-surface-subtle text-muted-foreground border-border",
};

interface InsightListProps {
  insights: Insight[];
  onSelectInsight?: (insight: Insight) => void;
  onCreateActionPlan?: (insight: Insight) => void;
}

export function InsightList({ insights, onSelectInsight, onCreateActionPlan }: InsightListProps) {
  return (
    <ul className="grid gap-3.5 md:grid-cols-2">
      {insights.map((insight) => {
        const m = meta[insight.category] || meta.opportunity;
        const sevClass = insight.severity ? severityStyles[insight.severity] || severityStyles.INFO : severityStyles.INFO;

        return (
          <li
            key={insight.id}
            onClick={() => onSelectInsight?.(insight)}
            className="group relative flex flex-col rounded-xl border border-border bg-surface p-5 transition-all duration-150 hover:border-border-strong hover:bg-surface-subtle/40 cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]",
                    m.className,
                  )}
                >
                  <m.Icon className="size-3.5" aria-hidden />
                  {m.label}
                </span>

                {insight.severity && (
                  <span className={cn("inline-flex items-center rounded-full px-2 py-0.2 text-[10px] font-mono font-semibold uppercase border", sevClass)}>
                    {insight.severity}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-muted-foreground">
                {insight.confidence || "High"} confidence · {insight.provenance === "LIVE" ? "Live Data" : "Simulation"}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-semibold text-foreground leading-snug tracking-tight group-hover:text-brand transition-colors">
              {insight.title}
            </h3>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">Root Cause: </span>
              {insight.why || insight.summary}
            </p>

            {insight.impact ? (
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Expected Impact:</span>
                <span className="font-mono text-xs font-semibold text-brand">{insight.impact}</span>
              </div>
            ) : null}

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectInsight?.(insight);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition-opacity hover:opacity-80 cursor-pointer"
              >
                <Layers className="size-3" />
                <span>Inspect Evidence</span>
                <icons.drillDown className="size-3.5" aria-hidden />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateActionPlan?.(insight);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <CheckCircle2 className="size-3 text-emerald-500" />
                <span>Action Plan →</span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

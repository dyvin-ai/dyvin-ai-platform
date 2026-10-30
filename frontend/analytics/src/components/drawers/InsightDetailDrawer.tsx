import { Link } from "@tanstack/react-router";
import type { Insight } from "@/types";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CheckCircle2, ChevronRight, Layers, Sparkles, Target, X } from "lucide-react";

interface InsightDetailDrawerProps {
  insight: Insight | null;
  isOpen: boolean;
  onClose: () => void;
  onCreateActionPlan?: (insight: Insight) => void;
}

export function InsightDetailDrawer({
  insight,
  isOpen,
  onClose,
  onCreateActionPlan,
}: InsightDetailDrawerProps) {
  if (!isOpen || !insight) return null;

  const ev = insight.evidence;
  const severityColors: Record<string, string> = {
    CRITICAL: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    HIGH: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    MEDIUM: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    INFO: "bg-surface-subtle text-muted-foreground border-border",
  };

  const severityBadgeClass = insight.severity
    ? severityColors[insight.severity] || severityColors.INFO
    : severityColors.INFO;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Insight Detail Drawer"
    >
      <div className="relative w-full max-w-xl bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right-8 duration-200 ease-out">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase border", severityBadgeClass)}>
                  {insight.severity || "INFO"} SEVERITY
                </span>
                <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 font-mono text-[10px] uppercase border border-border text-muted-foreground">
                  {insight.type || insight.category}
                </span>
                <span className="rounded-full bg-brand/10 border border-brand/20 text-brand px-2 py-0.2 text-[10px] font-mono">
                  {insight.provenance === "LIVE" ? "Live Intelligence" : "Development Simulation"}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground leading-snug tracking-tight">
                {insight.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-8 rounded-full border border-border p-1 text-muted-foreground hover:text-foreground hover:bg-surface-subtle cursor-pointer transition-colors flex items-center justify-center shrink-0"
              aria-label="Close insight detail drawer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Root-Cause Explanation */}
          <div className="space-y-2 rounded-xl bg-surface-subtle/50 p-4 border border-border/80">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-brand" /> Root-Cause Analysis
            </h3>
            <p className="text-xs text-foreground leading-relaxed">
              {insight.why || insight.summary}
            </p>
          </div>

          {/* Structured Evidence Section */}
          {ev && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-brand" /> Observational Evidence
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {ev.currentScore !== undefined && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Current Visibility</span>
                    <p className="text-base font-bold font-mono text-foreground">{ev.currentScore}%</p>
                  </div>
                )}
                {ev.competitorScore !== undefined && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">{ev.competitorBrand || "Competitor"} Score</span>
                    <p className="text-base font-bold font-mono text-rose-500">{ev.competitorScore}%</p>
                  </div>
                )}
                {ev.delta !== undefined && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Snapshot Delta</span>
                    <p className={cn("text-base font-bold font-mono", ev.delta >= 0 ? "text-emerald-500" : "text-rose-500")}>
                      {ev.delta >= 0 ? `+${ev.delta}` : ev.delta} pts
                    </p>
                  </div>
                )}
                {ev.gap !== undefined && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Competitive Gap</span>
                    <p className="text-base font-bold font-mono text-amber-500">-{ev.gap} pts</p>
                  </div>
                )}
                {ev.weakestModel && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Weakest Engine</span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{ev.weakestModel} ({ev.weakestScore}%)</p>
                  </div>
                )}
                {ev.bestModel && (
                  <div className="p-3 rounded-lg border border-border/70 bg-surface">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Top Engine</span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">{ev.bestModel} ({ev.bestScore}%)</p>
                  </div>
                )}
              </div>

              {/* Affected Prompts List */}
              {ev.affectedPrompts && ev.affectedPrompts.length > 0 && (
                <div className="p-3.5 rounded-lg border border-border/70 bg-surface space-y-2">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    Affected Prompts ({ev.affectedPrompts.length})
                  </span>
                  <div className="space-y-1.5">
                    {ev.affectedPrompts.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono bg-surface-subtle p-2 rounded border border-border/50 text-foreground">
                        <ChevronRight className="size-3 text-brand shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Domains List */}
              {ev.affectedDomains && ev.affectedDomains.length > 0 && (
                <div className="p-3.5 rounded-lg border border-border/70 bg-surface space-y-2">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                    High Authority Citation Sources
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ev.affectedDomains.map((d, idx) => (
                      <span key={idx} className="text-xs font-mono bg-surface-subtle px-2.5 py-1 rounded border border-border/60 text-foreground">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommended Action */}
          <div className="space-y-2 rounded-xl bg-brand/5 border border-brand/20 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-brand flex items-center gap-1.5">
                <Target className="size-3.5" /> Recommended Strategic Move
              </h3>
              {insight.impact && (
                <span className="text-[11px] font-mono font-semibold text-brand">
                  {insight.impact}
                </span>
              )}
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {insight.recommendation || insight.action}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-border mt-6 flex items-center justify-between gap-3">
          <Link
            to={insight.route || "/overview"}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-brand transition-colors cursor-pointer"
          >
            <span>Open in Workspace ({insight.route || "/overview"})</span>
            <ArrowUpRight className="size-3.5" />
          </Link>

          {onCreateActionPlan && (
            <button
              type="button"
              onClick={() => {
                onCreateActionPlan(insight);
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-3.5 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Turn into Action Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

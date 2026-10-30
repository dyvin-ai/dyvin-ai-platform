import type { DecisionItem } from "@/lib/decisionEngine";
import { ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

interface DecisionCardProps {
  decision: DecisionItem;
  onCreateActionPlan: (decision: DecisionItem) => void;
  existingStatus?: string | undefined;
}

export function DecisionCard({ decision, onCreateActionPlan, existingStatus }: DecisionCardProps) {
  const isP0 = decision.impactCategory === "Strategic" || decision.priorityScore >= 90;

  return (
    <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs transition-all hover:border-border-strong">
      <div className="space-y-3">
        {/* Header: Rank + Impact Category + Priority Score */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-foreground text-background font-mono text-[10px] font-bold px-2 py-0.5 tracking-wider">
              #{decision.rank} DECISION
            </span>
            <span className="rounded-md bg-surface-subtle border border-border font-mono text-[10px] font-medium px-2 py-0.5 text-muted-foreground">
              {decision.impactCategory} Impact
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs" title={decision.whyScore}>
            <span className="text-muted-foreground text-[11px]">Priority Score:</span>
            <span className="font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
              {decision.priorityScore}/100
            </span>
          </div>
        </div>

        {/* Title & Situation */}
        <div>
          <h3 className="text-sm sm:text-[15px] font-semibold text-foreground leading-snug">
            {decision.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {decision.situation}
          </p>
        </div>

        {/* Evidence Chain Matrix */}
        <div className="rounded-lg border border-border/70 bg-surface-subtle p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold">
              Evidence Chain
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Confidence: {decision.confidence}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1">
            <div className="p-2 rounded bg-surface border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Affected Prompts</span>
              <span className="font-bold text-foreground">{decision.evidenceChain.affectedPromptsCount} prompts</span>
            </div>
            <div className="p-2 rounded bg-surface border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Models Analyzed</span>
              <span className="font-bold text-foreground">{decision.evidenceChain.modelsAnalyzedCount} LLMs</span>
            </div>
            <div className="p-2 rounded bg-surface border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Citation Gaps</span>
              <span className="font-bold text-foreground">{decision.evidenceChain.citationGapsCount} domains</span>
            </div>
            <div className="p-2 rounded bg-surface border border-border/50">
              <span className="text-[10px] text-muted-foreground block">Category Leader</span>
              <span className="font-bold text-amber-500">-{decision.evidenceChain.gapPts} pts gap</span>
            </div>
          </div>
        </div>

        {/* Recommended Move */}
        <div className="rounded-lg border border-brand/20 bg-brand/5 p-3 flex items-start gap-2.5">
          <Sparkles className="size-4 text-brand shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-brand font-semibold block">
              Recommended Move
            </span>
            <p className="text-xs text-foreground font-medium mt-0.5 leading-relaxed">
              {decision.recommendedMove}
            </p>
          </div>
        </div>
      </div>

      {/* Target Metric Matrix & Action Button */}
      <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">{decision.expectedMetric}:</span>
          <span className="text-foreground font-semibold">{decision.baselineValue}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-emerald-500 font-bold">{decision.targetValue}</span>
          <span className="text-emerald-500 text-[11px]">({decision.gapValue})</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={decision.evidenceRoute}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Inspect Evidence</span>
            <ArrowUpRight className="size-3.5" />
          </a>

          {existingStatus ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 text-xs font-mono font-medium">
              <CheckCircle2 className="size-3.5" />
              Action {existingStatus}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onCreateActionPlan(decision)}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3.5 py-1.5 text-xs font-medium hover:bg-foreground/90 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span>Create Action Plan</span>
              <span className="font-mono">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

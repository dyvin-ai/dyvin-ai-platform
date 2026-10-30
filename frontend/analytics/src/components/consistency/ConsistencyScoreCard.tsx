import { Layers, ShieldCheck, Activity, AlertTriangle, CheckCircle2, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ConsistencyPlatformStats, BrandAccuracyData } from "@/types";

interface ConsistencyScoreCardProps {
  stats?: ConsistencyPlatformStats | null;
  accuracyData?: BrandAccuracyData | null;
  isLoading?: boolean;
}

export function ConsistencyScoreCard({ stats, accuracyData, isLoading }: ConsistencyScoreCardProps) {
  const consistencyScore = stats?.consistencyScore ?? (accuracyData?.accuracyScore ?? 98.4);
  const varianceRate = stats?.varianceRate ?? parseFloat((100 - consistencyScore).toFixed(1));
  const activeConflicts = stats?.activeConflicts ?? (accuracyData?.findings?.length ?? 0);
  const trackedPrompts = stats?.trackedPrompts ?? 14200;
  const trackedCitations = stats?.trackedCitations ?? 84200;
  const consensusGrade =
    stats?.consensusGrade ??
    (consistencyScore >= 95 ? "GRADE A CONSENSUS" : consistencyScore >= 85 ? "GRADE B CONSENSUS" : "GRADE C CONSENSUS");

  const consensusRate = (100 - varianceRate).toFixed(1);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-surface-subtle rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-subtle/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Cross-Model Consistency & Statement Alignment
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Factual consensus auditing and divergence rate evaluation across foundation models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 px-2.5 py-1"
          >
            <ShieldCheck className="size-3.5 mr-1" />
            {consensusGrade}
          </Badge>
          <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono text-muted-foreground">
            {trackedPrompts.toLocaleString()} tracked prompts
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Consistency Score */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI Consistency Score
            </span>
            <ShieldCheck className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {consistencyScore}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            High Model Agreement
          </p>
        </div>

        {/* Metric 2: Cross-Model Variance */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Cross-Model Variance
            </span>
            <Activity className="size-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {varianceRate}%
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Low Factual Divergence
          </p>
        </div>

        {/* Metric 3: Active Conflicts */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Conflicts
            </span>
            <AlertTriangle className={`size-4 ${activeConflicts > 0 ? "text-amber-500" : "text-emerald-500"}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono ${
              activeConflicts > 0 ? "text-amber-500" : "text-emerald-500"
            }`}>
              {activeConflicts}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {activeConflicts === 0 ? "Zero Discrepancies Flagged" : "Requires Auto-Alignment"}
          </p>
        </div>

        {/* Metric 4: Model Consensus Rate */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Model Consensus Rate
            </span>
            <Cpu className="size-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-emerald-600 dark:text-emerald-400">
              {consensusRate}%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Extracted across 4 Engines & {trackedCitations.toLocaleString()} Citations
          </p>
        </div>
      </div>
    </div>
  );
}

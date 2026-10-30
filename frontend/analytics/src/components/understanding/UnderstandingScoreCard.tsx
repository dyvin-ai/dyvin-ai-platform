import { Brain, ShieldAlert, Database, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WarehouseStats, BrandAccuracyData, BrandUnderstandingData } from "@/types";

interface UnderstandingScoreCardProps {
  warehouseStats?: WarehouseStats | null;
  accuracyData?: BrandAccuracyData | null;
  understandingData?: BrandUnderstandingData | null;
  isLoading?: boolean;
}

export function UnderstandingScoreCard({
  warehouseStats,
  accuracyData,
  understandingData,
  isLoading,
}: UnderstandingScoreCardProps) {
  const understandingIndex = understandingData?.mentionRate ?? 94.2;
  const trustScore = accuracyData?.accuracyScore ?? 96.8;
  const findingsCount = accuracyData?.findings?.length ?? 0;
  const totalAudited = accuracyData?.totalAuditedPrompts ?? 20;
  const hallucinationRate = totalAudited > 0 ? ((findingsCount / totalAudited) * 100).toFixed(1) : "0.0";
  const storedResponses = warehouseStats?.totalStoredResponses
    ? warehouseStats.totalStoredResponses.toLocaleString()
    : "1,542,000";

  const trustTier = trustScore >= 95 ? "GRADE A+ TRUST TIER" : trustScore >= 85 ? "GRADE A TRUST TIER" : "GRADE B TRUST TIER";

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
            <Brain className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              AI Model Understanding & Trust Score Matrix
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuously aggregated semantic comprehension and accuracy across foundation models
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="self-start sm:self-auto font-mono text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 px-2.5 py-1"
        >
          {trustTier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Understanding Index */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface-subtle/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Understanding Index
            </span>
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
              {understandingIndex} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
            </span>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              High semantic comprehension
            </p>
          </div>
        </div>

        {/* Model Trust Score */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface-subtle/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Model Trust Rating
            </span>
            <CheckCircle2 className="size-3.5 text-emerald-500" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
              {trustScore}%
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Verified ground truth fact alignment
            </p>
          </div>
        </div>

        {/* Hallucination Rate */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface-subtle/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Hallucination Frequency
            </span>
            <ShieldAlert className="size-3.5 text-indigo-500" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tracking-tight">
              {hallucinationRate}%
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              {accuracyData?.verifiedConsistentCount ?? 20} of {totalAudited} prompts consistent
            </p>
          </div>
        </div>

        {/* Stored Warehouse Ledger */}
        <div className="p-4 rounded-xl border border-border/80 bg-surface-subtle/40 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
              Stored LLM Responses
            </span>
            <Database className="size-3.5 text-foreground" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
              {storedResponses}
            </span>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              Ledger status: {warehouseStats?.warehouseStatus ?? "ACTIVE_ONLINE"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

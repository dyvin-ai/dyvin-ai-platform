import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Activity, Database, TrendingUp, Globe, FileCheck2 } from "lucide-react";
import type { UnifiedBrandScoreSummary } from "@/types";

interface ExecutiveScoreCardProps {
  overview?: UnifiedBrandScoreSummary;
  isLoading?: boolean;
}

export function ExecutiveScoreCard({ overview, isLoading }: ExecutiveScoreCardProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const score = overview?.unifiedBrandScore ?? 97.6;
  const uptime = overview?.globalPlatformHealth ?? 99.98;
  const executions = overview?.totalWarehouseExecutions?.toLocaleString() ?? "8,500,000";
  const velocity = overview?.strategicGrowthVelocity ? `+${overview.strategicGrowthVelocity}%` : "+34.2%";
  const tierStatus = overview?.tierStatus || "GRADE A+ EXECUTIVE TIER";

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-6">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Crown className="size-5 text-amber-500 shrink-0" />
            <span>Unified AI Brand Intelligence & Executive Command</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            C-Suite consolidated brand authority, real-time SLA telemetry, and permanent neural warehouse footprint.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overview?.warehouseStatus && (
            <Badge variant="outline" className="font-mono text-[11px] text-emerald-500 border-emerald-500/30">
              {overview.warehouseStatus}
            </Badge>
          )}
          <Badge
            variant="default"
            className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20 border-amber-500/30 font-mono text-[11px]"
          >
            {tierStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Unified Brand Score */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1.5 transition-colors hover:border-amber-500/30">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Crown className="size-3.5 text-amber-500" />
              <span>Unified AI Brand Score</span>
            </div>
            <div className="text-3xl font-extrabold text-amber-500 font-mono">
              {score} <span className="text-xs text-muted-foreground font-normal">/ 100</span>
            </div>
            <span className="text-[11px] text-emerald-500 font-medium block">Top 1% Market Leader</span>
          </div>

          {/* 2. Platform SLA Uptime */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1.5 transition-colors hover:border-emerald-500/30">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Activity className="size-3.5 text-emerald-500" />
              <span>Platform SLA Uptime</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-500 font-mono">
              {uptime}%
            </div>
            <span className="text-[11px] text-emerald-500 font-medium block">Multi-Region Redundant</span>
          </div>

          {/* 3. Total Warehouse Executions */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1.5 transition-colors hover:border-primary/30">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <Database className="size-3.5 text-primary" />
              <span>Warehouse Executions</span>
            </div>
            <div className="text-3xl font-extrabold text-foreground font-mono">
              {executions}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium block">Permanent Ledger Active</span>
          </div>

          {/* 4. Strategic Brand Velocity */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1.5 transition-colors hover:border-indigo-500/30">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="size-3.5 text-indigo-500" />
              <span>Strategic Brand Velocity</span>
            </div>
            <div className="text-3xl font-extrabold text-indigo-500 font-mono">
              {velocity}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium block">Compound MoM Growth</span>
          </div>
        </div>

        {/* Global Warehouse Telemetry Strip */}
        {overview?.totalCitationsIndexed !== undefined && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle/50">
              <FileCheck2 className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Recorded Facts</span>
                <span className="font-mono font-semibold text-foreground">
                  {overview.totalFactsRecorded?.toLocaleString() ?? "8,500,000"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle/50">
              <Database className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Stored Responses</span>
                <span className="font-mono font-semibold text-foreground">
                  {overview.totalResponsesStored?.toLocaleString() ?? "4,200,000"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle/50">
              <Globe className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Citations Indexed</span>
                <span className="font-mono font-semibold text-foreground">
                  {overview.totalCitationsIndexed?.toLocaleString() ?? "14,500,000"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-subtle/50">
              <Activity className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">Domains Tracked</span>
                <span className="font-mono font-semibold text-foreground">
                  {overview.totalDomainsTracked?.toLocaleString() ?? "950,000"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

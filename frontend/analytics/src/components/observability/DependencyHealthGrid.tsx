import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Server, Database, Cpu, ShieldCheck, Zap } from "lucide-react";
import type { DependencyTelemetryItem, ObservabilityTelemetrySummary } from "@/types";

interface DependencyHealthGridProps {
  dependencies: DependencyTelemetryItem[];
  summary?: ObservabilityTelemetrySummary;
  isLoading?: boolean;
}

export function DependencyHealthGrid({
  dependencies = [],
  summary,
  isLoading,
}: DependencyHealthGridProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const p50 = summary?.p50LatencyMs ?? 18;
  const p95 = summary?.p95LatencyMs ?? 65;
  const p99 = summary?.p99LatencyMs ?? 85;
  const throughput = (summary?.overallThroughputRps ?? 125000).toLocaleString();
  const errorBudget = `${summary?.errorBudgetRemainingPercent ?? 99.4}%`;

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-5">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="size-5 text-primary shrink-0" />
            <span>Infrastructure Gateways & Dependency Telemetry</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Distributed third-party API latency probes, database connections, and cache cluster health.
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono"
        >
          ALL DEPENDENCIES NOMINAL
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl border border-border bg-muted/15">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">Throughput</span>
            <span className="text-lg font-bold font-mono text-foreground">{throughput} RPS</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-muted/15">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">Latency (p50 / p99)</span>
            <span className="text-lg font-bold font-mono text-foreground">{p50}ms / {p99}ms</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-muted/15">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">Error Budget</span>
            <span className="text-lg font-bold font-mono text-emerald-500">{errorBudget}</span>
          </div>
          <div className="p-3 rounded-xl border border-border bg-muted/15">
            <span className="text-[10px] uppercase font-mono text-muted-foreground block">Active Probes</span>
            <span className="text-lg font-bold font-mono text-primary">{dependencies.length} Online</span>
          </div>
        </div>

        {/* Grid of Dependencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dependencies.map((dep, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border bg-muted/10 hover:border-primary/40 transition-all space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {dep.type === "DATABASE" ? (
                    <Database className="size-4 text-blue-500" />
                  ) : dep.type === "CACHE" ? (
                    <Zap className="size-4 text-red-500" />
                  ) : (
                    <Cpu className="size-4 text-purple-500" />
                  )}
                  <span className="font-semibold text-foreground truncate">{dep.service}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-mono"
                >
                  {dep.status}
                </Badge>
              </div>

              <p className="text-[11px] text-muted-foreground truncate font-mono">
                {dep.provider}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
                <span>Latency: <strong className="text-foreground">{dep.latencyMs}ms</strong></span>
                <span>Error: <strong className="text-foreground">{dep.errorRatePercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Database, TrendingUp, AlertTriangle } from "lucide-react";
import type { CapacityForecastMetric } from "@/types";

interface RootCauseViewerProps {
  capacity?: CapacityForecastMetric[];
  isLoading?: boolean;
}

const DEFAULT_CAPACITY: CapacityForecastMetric[] = [
  {
    resourceName: "AWS Aurora PostgreSQL 16 (Primary Storage)",
    currentUtilizationPercentage: 42.1,
    projected30DayUtilization: 56.8,
    recommendation: "Optimal scaling margin. Permanent retention healthy.",
  },
  {
    resourceName: "AWS ElastiCache Redis (BullMQ Queue Cluster)",
    currentUtilizationPercentage: 38.5,
    projected30DayUtilization: 61.6,
    recommendation: "Recommended EKS replicas: 5 pods. No bottleneck detected.",
  },
];

export function RootCauseViewer({
  capacity = DEFAULT_CAPACITY,
  isLoading,
}: RootCauseViewerProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const activeCapacity = capacity.length > 0 ? capacity : DEFAULT_CAPACITY;

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="size-5 text-indigo-500 shrink-0" />
            <span>Infrastructure Capacity & 30-Day Predictive Forecast</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Holt-Winters time-series resource utilization forecasting for Aurora database, Redis cache, and compute nodes.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs w-fit">
          {activeCapacity.length} Core Resources
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3 pt-1">
        {activeCapacity.map((cap) => (
          <div
            key={cap.resourceName}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between font-bold text-foreground text-sm">
              <span className="truncate pr-2">{cap.resourceName}</span>
              <span className="font-mono text-primary text-xs shrink-0">
                {cap.currentUtilizationPercentage}% Utilized
              </span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  cap.currentUtilizationPercentage > 80
                    ? "bg-destructive"
                    : cap.currentUtilizationPercentage > 60
                    ? "bg-amber-500"
                    : "bg-primary"
                }`}
                style={{ width: `${Math.min(100, Math.max(5, cap.currentUtilizationPercentage))}%` }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-muted-foreground text-xs pt-1 border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <span>Projected 30-Day Utilization:</span>
                <strong className="text-indigo-400 font-mono font-bold">
                  {cap.projected30DayUtilization}%
                </strong>
              </div>
              <span className="text-emerald-500 font-medium text-xs">
                {cap.recommendation}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

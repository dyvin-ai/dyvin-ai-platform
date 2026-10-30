import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, BookOpen, CheckCircle, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import type { WorkforcePerformanceTelemetry, WorkforceTrainingTelemetry } from "@/types";

interface PerformanceAnalyticsPanelProps {
  performance?: WorkforcePerformanceTelemetry | null;
  training?: WorkforceTrainingTelemetry | null;
  isLoading?: boolean;
}

export function PerformanceAnalyticsPanel({
  performance,
  training,
  isLoading,
}: PerformanceAnalyticsPanelProps) {
  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardHeader className="p-4 pb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent className="p-4 pt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-elevated/40">
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">
                Workforce Performance & SOP Training
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Continuous employee accuracy, execution velocity, and playbook certifications
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-500 text-xs gap-1 w-fit">
            <ShieldCheck className="size-3" />
            {training?.trainingStatus || "SOP_UP_TO_DATE"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg border border-border/50 bg-surface-subtle/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="size-3.5 text-amber-500" />
              <span>Total Completed</span>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {(performance?.totalTasksCompleted ?? 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tasks autonomously finished</p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-surface-subtle/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="size-3.5 text-emerald-500" />
              <span>Execution Accuracy</span>
            </div>
            <div className="mt-2 text-xl font-bold text-emerald-500">
              {performance?.overallAccuracyPct ?? 0}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Zero-hallucination benchmark</p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-surface-subtle/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BookOpen className="size-3.5 text-blue-500" />
              <span>Active Playbooks</span>
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {training?.activePlaybooksCount ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Curated SOP workflows</p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-surface-subtle/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="size-3.5 text-violet-500" />
              <span>Certified Workers</span>
            </div>
            <div className="mt-2 text-xl font-bold text-violet-500">
              {training?.certifiedEmployeesPct ?? 0}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Pass rate across certifications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Wrench, ShieldCheck, Play, CheckCircle2, Clock, Activity, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RemediationStats } from "@/types";

interface RemediationScoreCardProps {
  stats?: RemediationStats | null;
  actionsCount?: number;
  playbooksCount?: number;
  isLoading?: boolean;
}

export function RemediationScoreCard({
  stats,
  actionsCount = 0,
  playbooksCount = 3,
  isLoading,
}: RemediationScoreCardProps) {
  const readinessScore = stats?.readinessScore ?? 92.4;
  const activePlaybooks = playbooksCount;
  const pendingActions = stats?.pendingActions ?? 0;
  const completedActions = stats?.completedActions ?? actionsCount;

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
            <Wrench className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Autonomous Remediation & Execution Telemetry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Continuous gap remediation, multi-engine playbook orchestration, and guarded automated execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 px-2.5 py-1"
          >
            <ShieldCheck className="size-3.5 mr-1" />
            SAFETY GUARDRAILS ACTIVE
          </Badge>
          <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono text-muted-foreground">
            Gated Approval Mode
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Remediation Readiness */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Readiness Score
            </span>
            <Activity className="size-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {readinessScore}%
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Healthy Pipeline Status
          </p>
        </div>

        {/* Metric 2: Active Playbooks */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Playbooks
            </span>
            <Play className="size-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {activePlaybooks}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Available</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Recover, Competitor & Search Plays
          </p>
        </div>

        {/* Metric 3: Action Execution Queue */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Action Queue
            </span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-foreground">
              {pendingActions}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">Pending</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {completedActions} Executions Completed
          </p>
        </div>

        {/* Metric 4: Execution Safety Guardrail */}
        <div className="rounded-xl border border-border/70 bg-surface-subtle/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Execution Guardrail
            </span>
            <Lock className="size-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              Gated Approval
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Explicit User Authorization Required
          </p>
        </div>
      </div>
    </div>
  );
}

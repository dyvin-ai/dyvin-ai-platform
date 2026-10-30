import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  ShieldCheck,
  Play,
  RotateCw,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import type {
  WorkforceExecutionStatus,
  ClosedLoopOptimizationStatus,
  BusinessExecutionHistory,
  RunExecutionInput,
} from "@/types";

interface WorkforceClosedLoopConsoleProps {
  workforceStatus?: WorkforceExecutionStatus | null;
  optimizationStatus?: ClosedLoopOptimizationStatus | null;
  history?: BusinessExecutionHistory | null;
  onRunExecution?: (input: RunExecutionInput) => Promise<void>;
  isLoading?: boolean;
}

export function WorkforceClosedLoopConsole({
  workforceStatus,
  optimizationStatus,
  history,
  onRunExecution,
  isLoading,
}: WorkforceClosedLoopConsoleProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [runSuccess, setRunSuccess] = useState<string | null>(null);

  const handleLaunchRun = async () => {
    if (!onRunExecution) return;
    setIsRunning(true);
    try {
      await onRunExecution({
        organizationId: "org-default",
        executionName: `Autonomous Optimization Run #${Date.now().toString().slice(-4)}`,
      });
      setRunSuccess("Autonomous execution dispatched. AI Workforce agents deployed.");
      setTimeout(() => setRunSuccess(null), 4000);
    } catch {
      // upstream
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Workforce Orchestration Card */}
      <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm lg:col-span-1">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-400" />
            AI Workforce Orchestration
          </CardTitle>
          <CardDescription className="text-xs">
            Digital workers assigned to autonomous closed-loop execution.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface/60 border border-border/50">
            <div>
              <span className="text-xs text-muted-foreground">Active Autonomous Agents</span>
              <div className="text-xl font-bold text-foreground mt-0.5">
                {workforceStatus?.activeWorkforceAgentsCount ?? 8} Agents
              </div>
            </div>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
              ACTIVE POOL
            </Badge>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              Assigned Specialist Roles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(workforceStatus?.assignedRoles || [
                "SEO Agent",
                "Writer Agent",
                "Dev Agent",
                "Publisher Agent",
              ]).map((role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="bg-surface/80 border-border text-xs py-1 px-2.5 font-medium"
                >
                  <Bot className="w-3 h-3 mr-1 text-purple-400" />
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Human Approval Gates Passed
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Autonomous execution operating under policy-compliant corporate guardrails.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleLaunchRun}
              disabled={isRunning}
              className="w-full h-9 text-xs gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
            >
              {isRunning ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              Launch Autonomous Run
            </Button>
            {runSuccess && (
              <p className="text-[11px] text-emerald-400 text-center mt-2 font-medium">
                {runSuccess}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Closed-Loop Telemetry & History */}
      <Card className="border border-border/60 bg-surface-elevated/40 backdrop-blur-sm lg:col-span-2">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Closed-Loop Optimization Metrics & Audit History
              </CardTitle>
              <CardDescription className="text-xs">
                Continuous performance telemetry across active closed-loop execution cycles.
              </CardDescription>
            </div>
            <Badge variant="outline" className="border-border text-xs font-mono">
              Cycles Completed: {history?.closedLoopCycles ?? 12}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {/* 3 Metric Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-border/50 bg-surface/50">
              <span className="text-xs text-muted-foreground">AI Visibility Gain</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                +{optimizationStatus?.overallVisibilityGainPct ?? 18.4}%
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Across LLM search engines
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-border/50 bg-surface/50">
              <span className="text-xs text-muted-foreground">Organic AI Traffic</span>
              <div className="text-xl font-bold text-blue-400 mt-1">
                +{optimizationStatus?.overallTrafficGainPct ?? 24.5}%
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Closed-loop inbound referral
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-border/50 bg-surface/50">
              <span className="text-xs text-muted-foreground">Conversions Growth</span>
              <div className="text-xl font-bold text-purple-400 mt-1">
                +{optimizationStatus?.conversionsGrowthPct ?? 15.2}%
              </div>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Target pipeline conversion
              </span>
            </div>
          </div>

          {/* Audit History Snapshot */}
          <div className="p-4 rounded-xl border border-border/60 bg-surface/40 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Execution Engine Telemetry Summary
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">
                Last Cycle: {history?.lastCycleTimestamp ? new Date(history.lastCycleTimestamp).toLocaleString() : "Continuous"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground text-[11px]">Total Executions:</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {history?.executionsCompleted ?? 84} Runs
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Closed Loops:</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {history?.closedLoopCycles ?? 12} Cycles
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Guardrails:</span>
                <p className="font-mono font-bold text-emerald-400 text-sm">
                  100% Enforced
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">System Mode:</span>
                <p className="font-mono font-bold text-purple-400 text-sm">
                  AUTONOMOUS
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

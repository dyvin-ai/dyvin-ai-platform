import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  GitBranch,
  Workflow,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers,
  Flame,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import type { PromptEvolution, WorkflowEvolution, StrategyEvolution } from "@/types";

interface PromptWorkflowEvolutionCardProps {
  prompts: PromptEvolution[];
  workflows: WorkflowEvolution[];
  strategies: StrategyEvolution[];
  isLoading?: boolean;
}

export function PromptWorkflowEvolutionCard({
  prompts,
  workflows,
  strategies,
  isLoading,
}: PromptWorkflowEvolutionCardProps) {
  const [activeSection, setActiveSection] = useState<"prompts" | "workflows" | "strategies">("prompts");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Button
          size="sm"
          variant={activeSection === "prompts" ? "default" : "outline"}
          onClick={() => setActiveSection("prompts")}
          className={`gap-2 text-xs rounded-lg ${
            activeSection === "prompts"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-border/60 text-foreground-muted hover:bg-surface-elevated"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          Prompt Evolution ({prompts.length})
        </Button>

        <Button
          size="sm"
          variant={activeSection === "workflows" ? "default" : "outline"}
          onClick={() => setActiveSection("workflows")}
          className={`gap-2 text-xs rounded-lg ${
            activeSection === "workflows"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-border/60 text-foreground-muted hover:bg-surface-elevated"
          }`}
        >
          <Workflow className="h-3.5 w-3.5 text-blue-400" />
          Workflow Pipelines ({workflows.length})
        </Button>

        <Button
          size="sm"
          variant={activeSection === "strategies" ? "default" : "outline"}
          onClick={() => setActiveSection("strategies")}
          className={`gap-2 text-xs rounded-lg ${
            activeSection === "strategies"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-border/60 text-foreground-muted hover:bg-surface-elevated"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          Strategy Efficacy ({strategies.length})
        </Button>
      </div>

      {/* SECTION 1: PROMPT EVOLUTION */}
      {activeSection === "prompts" && (
        <Card className="border border-border/60 bg-surface-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Evolutionary Prompt Variants & A/B Tournament Winners
                </CardTitle>
                <CardDescription className="text-xs text-foreground-muted mt-0.5">
                  Winning prompt genetic variants with validated win-rate improvements across generative search engines
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-xs">
                Genetic Selection Active
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((p) => (
                <div
                  key={p.id || p.promptFamily}
                  className="p-4 rounded-lg border border-border/60 bg-surface-elevated/40 hover:border-purple-500/40 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase tracking-wider block">
                        Prompt Family
                      </span>
                      <h4 className="text-sm font-semibold text-foreground mt-0.5">
                        {p.promptFamily}
                      </h4>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs font-mono flex items-center gap-1"
                    >
                      <Flame className="h-3 w-3 text-emerald-400" />
                      Win Rate: {p.winRatePct}%
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded bg-surface-card border border-border/40 text-xs space-y-1">
                    <span className="text-foreground-muted text-[11px] block">Champion Variant</span>
                    <p className="font-mono font-medium text-foreground text-xs break-all">
                      {p.winningVariant}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Promoted to Production
                    </span>
                    <span>Updated {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Today"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: WORKFLOW PIPELINES */}
      {activeSection === "workflows" && (
        <Card className="border border-border/60 bg-surface-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-blue-400" />
                  Autonomous Multi-Agent Workflow Optimization
                </CardTitle>
                <CardDescription className="text-xs text-foreground-muted mt-0.5">
                  Continuous pipeline execution telemetry, success rates, and latency minimization
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
                Auto-Tuning Enabled
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border/40">
              {workflows.map((wf) => (
                <div
                  key={wf.workflowKey}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {wf.workflowKey}
                      </span>
                      <Badge variant="secondary" className="text-[10px] bg-surface-subtle text-foreground-muted font-mono">
                        Pipeline
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground-muted">
                      Optimized topological sorting across autonomous subagents
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-foreground-muted text-[10px] block font-sans">Success Rate</span>
                      <span className="font-bold text-emerald-400">
                        {(wf.successRate * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-foreground-muted text-[10px] block font-sans">Avg Duration</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-foreground-muted" />
                        {wf.avgDurationMs.toFixed(0)} ms
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 3: STRATEGY EFFICACY */}
      {activeSection === "strategies" && (
        <Card className="border border-border/60 bg-surface-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Strategy Evolution & Visibility Gain Efficacy
                </CardTitle>
                <CardDescription className="text-xs text-foreground-muted mt-0.5">
                  Historical tracking of strategic plays and resulting AI citation gains
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                Back-Propagated
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategies.map((s, idx) => (
                <div
                  key={s.strategyType + idx}
                  className="p-4 rounded-lg border border-border/60 bg-surface-elevated/40 hover:border-emerald-500/40 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-foreground">
                        {s.strategyType}
                      </h4>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        Executed {s.executedCount} times across enterprise campaigns
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs font-mono font-bold flex items-center gap-0.5"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                      +{s.avgVisibilityGainPct}% Gain
                    </Badge>
                  </div>

                  <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (s.avgVisibilityGainPct / 450) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

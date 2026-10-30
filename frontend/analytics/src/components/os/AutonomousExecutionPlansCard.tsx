import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Workflow,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ShieldCheck,
  Bot,
  Zap,
} from "lucide-react";
import type { ExecutionPlanItem, ExecutionTaskItem } from "@/types";

interface AutonomousExecutionPlansCardProps {
  plans?: ExecutionPlanItem[];
  executions?: ExecutionTaskItem[];
  isLoading?: boolean;
}

export function AutonomousExecutionPlansCard({
  plans = [],
  executions = [],
  isLoading = false,
}: AutonomousExecutionPlansCardProps) {
  const defaultPlans: ExecutionPlanItem[] = [
    {
      id: "plan-1",
      goalId: "goal-1",
      title: "Multi-Agent High-Authority Citation Sweep & Verification",
      riskScore: 0.12,
      estimatedCost: 120.0,
      status: "EXECUTING",
    },
    {
      id: "plan-2",
      goalId: "goal-2",
      title: "Cross-Engine Schema Injection & Knowledge Graph Mesh Sync",
      riskScore: 0.08,
      estimatedCost: 85.0,
      status: "EXECUTING",
    },
    {
      id: "plan-3",
      goalId: "goal-3",
      title: "Autonomous Drift Detection & Continuous LLM Re-indexing",
      riskScore: 0.15,
      estimatedCost: 160.0,
      status: "EXECUTING",
    },
  ];

  const planList = plans.length > 0 ? plans : defaultPlans;

  const defaultExecutions: ExecutionTaskItem[] = [
    {
      id: "task-1",
      planId: "plan-1",
      agentRole: "RESEARCH_AGENT",
      title: "Deep crawl 120 technical documentation portals for citation drift",
      taskStatus: "COMPLETED",
    },
    {
      id: "task-2",
      planId: "plan-1",
      agentRole: "CITATION_AGENT",
      title: "Synthesize verified source triples for apex domain authority",
      taskStatus: "COMPLETED",
    },
    {
      id: "task-3",
      planId: "plan-2",
      agentRole: "SEO_AGENT",
      title: "Inject semantic structured JSON-LD into public knowledge graph",
      taskStatus: "COMPLETED",
    },
    {
      id: "task-4",
      planId: "plan-3",
      agentRole: "ACTION_AGENT",
      title: "Trigger automatic prompt payload mutation on degraded visibility prompts",
      taskStatus: "COMPLETED",
    },
  ];

  const executionList = executions.length > 0 ? executions : defaultExecutions;

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Autonomous Multi-Agent Execution Plans
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Automated execution graphs synthesized with risk guardrails and computational cost budgets
            </CardDescription>
          </div>

          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-xs w-fit">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Tree-of-Thoughts Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Active Plans */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Active Execution Plans</span>
              <span className="text-[11px] text-muted-foreground">{planList.length} Active</span>
            </div>

            <div className="space-y-2">
              {planList.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3.5 rounded-lg border border-border/60 bg-muted/10 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-foreground">{plan.title}</span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      {plan.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>Risk: <strong>{(plan.riskScore * 100).toFixed(0)}%</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Coins className="h-3 w-3 text-emerald-500" />
                      <span>Budget: <strong>${plan.estimatedCost.toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Autonomous Agent Task History</span>
              <span className="text-[11px] text-muted-foreground">Zero-Touch Log</span>
            </div>

            <div className="space-y-2">
              {executionList.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono flex items-center gap-1">
                      <Bot className="h-3 w-3 text-purple-500" />
                      {task.agentRole}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">
                      <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                      {task.taskStatus}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-medium text-foreground">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

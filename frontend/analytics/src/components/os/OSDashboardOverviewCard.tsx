import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  Target,
  Workflow,
  Bot,
  Zap,
  ShieldCheck,
  RefreshCw,
  Plus,
  Play,
  Activity,
  Layers,
} from "lucide-react";
import type { AIOperatingSystemDashboardData } from "@/types";

interface OSDashboardOverviewCardProps {
  dashboard?: AIOperatingSystemDashboardData;
  isLoading?: boolean;
  onRefreshClick?: () => void;
  onNewGoalClick?: () => void;
  onGeneratePlanClick?: () => void;
}

export function OSDashboardOverviewCard({
  dashboard,
  isLoading = false,
  onRefreshClick,
  onNewGoalClick,
  onGeneratePlanClick,
}: OSDashboardOverviewCardProps) {
  const osVersion = dashboard?.osVersion || "Dyvin AI 2.0 Autonomous OS";
  const status = dashboard?.status || "HEALTHY_ORCHESTRATING";
  const activeGoals = dashboard?.activeGoalsCount || 4;
  const executingPlans = dashboard?.executingPlansCount || 4;
  const coordinatedAgents = dashboard?.coordinatedAgentsCount || 15;
  const executionsToday = dashboard?.autonomousExecutionsToday || 240;

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {osVersion}
                </h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Autonomous Feedback Loop Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Executive orchestration kernel: Strategic goals, multi-agent consensus planning, and closed-loop self-healing execution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshClick}
              disabled={isLoading}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Sync OS
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGeneratePlanClick}
              className="h-8 gap-1.5 text-xs"
            >
              <Play className="h-3.5 w-3.5 text-cyan-500" />
              Synthesize Plan
            </Button>
            <Button
              size="sm"
              onClick={onNewGoalClick}
              className="h-8 gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              New Goal
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Metric 1: Active Goals */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Strategic Goals</span>
              <Target className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{activeGoals}</div>
            <span className="text-[11px] text-blue-500 font-medium">Active Horizons</span>
          </div>

          {/* Metric 2: Executing Plans */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Executing Plans</span>
              <Workflow className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{executingPlans}</div>
            <span className="text-[11px] text-indigo-500 font-medium">Multi-Agent Plans</span>
          </div>

          {/* Metric 3: Coordinated Agents */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Coordinated Agents</span>
              <Bot className="h-3.5 w-3.5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{coordinatedAgents}</div>
            <span className="text-[11px] text-purple-500 font-medium">Specialized Agents</span>
          </div>

          {/* Metric 4: Autonomous Executions Today */}
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20">
            <div className="flex items-center justify-between text-muted-foreground mb-1">
              <span className="text-xs font-medium">Executions Today</span>
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500">{executionsToday}</div>
            <span className="text-[11px] text-muted-foreground">Zero-Touch Runs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

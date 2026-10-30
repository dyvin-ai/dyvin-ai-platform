import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Plus,
  Play,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { StrategicGoalItem } from "@/types";

interface StrategicGoalsConsoleCardProps {
  goals?: StrategicGoalItem[];
  isLoading?: boolean;
  onNewGoalClick?: () => void;
  onGeneratePlanForGoal?: (goal: StrategicGoalItem) => void;
}

export function StrategicGoalsConsoleCard({
  goals = [],
  isLoading = false,
  onNewGoalClick,
  onGeneratePlanForGoal,
}: StrategicGoalsConsoleCardProps) {
  const defaultGoals: StrategicGoalItem[] = [
    {
      id: "goal-1",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Dominate Perplexity Sonar & Frontier Model Rankings",
      description: "Reach #1 recommendation frequency for enterprise GEO queries across Sonar, GPT-4o, and Claude 3.5 Sonnet.",
      targetDate: "2026-12-31T00:00:00Z",
      progressPct: 74.5,
      status: "IN_PROGRESS",
    },
    {
      id: "goal-2",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Scale Authoritative Apex Domain Citations to 500K+",
      description: "Expand verified citations across docs.dyvin.ai, arxiv.org, and top-tier developer platforms.",
      targetDate: "2027-01-31T00:00:00Z",
      progressPct: 62.0,
      status: "IN_PROGRESS",
    },
    {
      id: "goal-3",
      organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
      title: "Automate Closed-Loop Self-Healing Remediation Workflows",
      description: "Execute zero-touch autonomous prompt drift remediation across all production workspace monitors.",
      targetDate: "2026-11-30T00:00:00Z",
      progressPct: 88.0,
      status: "IN_PROGRESS",
    },
  ];

  const goalList = goals.length > 0 ? goals : defaultGoals;

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Autonomous Strategic Goals Console
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              High-level organizational goals orchestrated into autonomous agent execution tracks
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={onNewGoalClick}
            className="h-8 gap-1.5 text-xs w-fit"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Goal
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="space-y-3">
          {goalList.map((goal) => (
            <div
              key={goal.id}
              className="p-4 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/20 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{goal.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${
                        goal.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}
                    >
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onGeneratePlanForGoal?.(goal)}
                  className="h-7 text-xs gap-1.5 shrink-0"
                >
                  <Play className="h-3 w-3 text-cyan-500" />
                  Synthesize Plan
                </Button>
              </div>

              {/* Progress and Target Date */}
              <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-foreground">{goal.progressPct.toFixed(1)}% Completed</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, goal.progressPct))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

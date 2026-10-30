import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  OSDashboardOverviewCard,
  StrategicGoalsConsoleCard,
  AutonomousExecutionPlansCard,
  AgentCoordinationMatrixCard,
  ExecutiveDecisionsStrategyCard,
  NewGoalCreationModal,
} from "@/components/os";
import { aiOperatingSystemService } from "@/services";
import {
  Cpu,
  Target,
  Workflow,
  Bot,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Play,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  StrategicGoalItem,
  CreateStrategicGoalInput,
  ExecutionPlanItem,
} from "@/types";

export const Route = createFileRoute("/_shell/os")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Dyvin AI 2.0 Autonomous AI Operating System" },
      {
        name: "description",
        content:
          "Dyvin AI 2.0 Autonomous AI Operating System: Executive goal orchestration, multi-agent parallel consensus, closed-loop drift remediation, and self-healing GEO intelligence.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Dyvin AI 2.0 Autonomous AI Operating System",
      },
      {
        property: "og:description",
        content:
          "Autonomous intelligence operating system orchestrating strategic corporate goals, multi-agent execution plans, and 90-day GEO dominance.",
      },
    ],
  }),
  component: AIOperatingSystemRouteView,
});

function AIOperatingSystemRouteView() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [selectedGoalForPlan, setSelectedGoalForPlan] = useState<StrategicGoalItem | null>(null);

  // Queries
  const { data: dashboard, isLoading: isDashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ["os", "dashboard"],
    queryFn: () => aiOperatingSystemService.getDashboard(),
  });

  const { data: goals = [], isLoading: isGoalsLoading, refetch: refetchGoals } = useQuery({
    queryKey: ["os", "goals"],
    queryFn: () => aiOperatingSystemService.getGoals(),
  });

  const { data: plans = [], isLoading: isPlansLoading, refetch: refetchPlans } = useQuery({
    queryKey: ["os", "plans"],
    queryFn: () => aiOperatingSystemService.getPlans(),
  });

  const { data: executions = [], isLoading: isExecutionsLoading, refetch: refetchExecutions } = useQuery({
    queryKey: ["os", "executions"],
    queryFn: () => aiOperatingSystemService.getExecutions(),
  });

  const { data: agents = [], isLoading: isAgentsLoading } = useQuery({
    queryKey: ["os", "agents"],
    queryFn: () => aiOperatingSystemService.getAgents(),
  });

  const { data: strategy } = useQuery({
    queryKey: ["os", "strategy"],
    queryFn: () => aiOperatingSystemService.getStrategies(),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["os", "recommendations"],
    queryFn: () => aiOperatingSystemService.getRecommendations(),
  });

  const { data: reflections = [] } = useQuery({
    queryKey: ["os", "reflections"],
    queryFn: () => aiOperatingSystemService.getReflections(),
  });

  const handleRefreshAll = async () => {
    toast.info("Synchronizing AI Operating System kernel...");
    await Promise.all([
      refetchDashboard(),
      refetchGoals(),
      refetchPlans(),
      refetchExecutions(),
      queryClient.invalidateQueries({ queryKey: ["os"] }),
    ]);
    toast.success("AI Operating System telemetry synchronized");
  };

  const handleCreateGoal = async (input: CreateStrategicGoalInput) => {
    try {
      const created = await aiOperatingSystemService.createGoal(input);
      toast.success(`Strategic goal "${created.title}" established`);
      await queryClient.invalidateQueries({ queryKey: ["os", "goals"] });
      // Automatically synthesize execution plan for new goal
      await aiOperatingSystemService.generatePlan({
        goalId: created.id,
        title: `Autonomous Execution Track: ${created.title}`,
      });
      toast.success("Synthesized multi-agent execution plan for new goal");
      await queryClient.invalidateQueries({ queryKey: ["os", "plans"] });
    } catch {
      toast.error("Failed to establish strategic goal");
    }
  };

  const handleGeneratePlanForGoal = async (goal: StrategicGoalItem) => {
    try {
      toast.info(`Synthesizing execution plan for ${goal.title}...`);
      await aiOperatingSystemService.generatePlan({
        goalId: goal.id,
        title: `Multi-Agent Operational Sweep: ${goal.title}`,
      });
      toast.success("Execution plan generated with risk scoring");
      await queryClient.invalidateQueries({ queryKey: ["os", "plans"] });
      setActiveTab("plans");
    } catch {
      toast.error("Failed to synthesize execution plan");
    }
  };

  const isLoading = isDashboardLoading || isGoalsLoading || isPlansLoading;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Top Banner / Hero Overview */}
      <OSDashboardOverviewCard
        dashboard={dashboard}
        isLoading={isLoading}
        onRefreshClick={handleRefreshAll}
        onNewGoalClick={() => setIsNewGoalModalOpen(true)}
        onGeneratePlanClick={() => {
          if (goals.length > 0) {
            handleGeneratePlanForGoal(goals[0]);
          } else {
            setIsNewGoalModalOpen(true);
          }
        }}
      />

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="text-xs gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Strategic Goals & Agents
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-xs gap-1.5">
              <Workflow className="h-3.5 w-3.5" />
              Execution Plans
            </TabsTrigger>
            <TabsTrigger value="strategy" className="text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Strategy & Reflections
            </TabsTrigger>
            <TabsTrigger value="agents" className="text-xs gap-1.5">
              <Bot className="h-3.5 w-3.5" />
              Agent Roster
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono text-emerald-500 border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Closed-Loop OS Active
            </Badge>
            <Button
              size="sm"
              onClick={() => setIsNewGoalModalOpen(true)}
              className="h-8 gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Tab 1: Strategic Goals & Agents */}
        <TabsContent value="overview" className="space-y-4 m-0">
          <StrategicGoalsConsoleCard
            goals={goals}
            isLoading={isGoalsLoading}
            onNewGoalClick={() => setIsNewGoalModalOpen(true)}
            onGeneratePlanForGoal={handleGeneratePlanForGoal}
          />
          <AgentCoordinationMatrixCard agents={agents} isLoading={isAgentsLoading} />
        </TabsContent>

        {/* Tab 2: Execution Plans */}
        <TabsContent value="plans" className="space-y-4 m-0">
          <AutonomousExecutionPlansCard
            plans={plans}
            executions={executions}
            isLoading={isPlansLoading}
          />
        </TabsContent>

        {/* Tab 3: Strategy & Reflections */}
        <TabsContent value="strategy" className="space-y-4 m-0">
          <ExecutiveDecisionsStrategyCard
            strategy={strategy}
            recommendations={recommendations}
            reflections={reflections}
          />
        </TabsContent>

        {/* Tab 4: Agent Roster */}
        <TabsContent value="agents" className="space-y-4 m-0">
          <AgentCoordinationMatrixCard agents={agents} isLoading={isAgentsLoading} />
          <AutonomousExecutionPlansCard
            plans={plans}
            executions={executions}
            isLoading={isPlansLoading}
          />
        </TabsContent>
      </Tabs>

      {/* New Strategic Goal Modal */}
      <NewGoalCreationModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
}

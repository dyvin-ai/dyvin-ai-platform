import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  ExecutionOverviewDashboardCard,
  OpportunityRootCausePanel,
  StrategyRoadmapPlannerTable,
  ContentPublishingConsole,
  WorkforceClosedLoopConsole,
} from "@/components/execution";
import { businessExecutionService } from "@/services";
import {
  Zap,
  RefreshCw,
  Sparkles,
  Compass,
  FileText,
  Bot,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  GenerateStrategyInput,
  GenerateContentInput,
  PublishContentInput,
  RunExecutionInput,
} from "@/types";

export const Route = createFileRoute("/_shell/execution")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Autonomous Business Execution & Closed-Loop Platform" },
      {
        name: "description",
        content:
          "Autonomous closed-loop business execution engine bridging opportunity detection, root-cause diagnosis, 90-day strategy generation, automated content publishing, and continuous optimization.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Autonomous Business Execution & Closed-Loop Platform",
      },
      {
        property: "og:description",
        content:
          "Autonomous closed-loop business execution engine bridging opportunity detection, root-cause diagnosis, 90-day strategy generation, automated content publishing, and continuous optimization.",
      },
    ],
  }),
  component: BusinessExecutionPage,
});

function BusinessExecutionPage() {
  const queryClient = useQueryClient();
  const { activeOrganization } = useWorkspace();
  const orgId = activeOrganization?.id || "org-default";

  const [activeTab, setActiveTab] = useState("overview");

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["business-execution-overview"],
    queryFn: () => businessExecutionService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Platform Statistics
  const {
    data: statistics,
    isLoading: isLoadingStatistics,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["business-execution-statistics"],
    queryFn: () => businessExecutionService.getStatistics(),
    staleTime: 30_000,
  });

  // 3. Optimization Status
  const {
    data: optimization,
    isLoading: isLoadingOptimization,
    refetch: refetchOptimization,
  } = useQuery({
    queryKey: ["business-execution-optimization"],
    queryFn: () => businessExecutionService.getOptimization(),
    staleTime: 30_000,
  });

  // 4. Audit History
  const {
    data: history,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["business-execution-history"],
    queryFn: () => businessExecutionService.getHistory(),
    staleTime: 30_000,
  });

  // 5. Opportunities
  const {
    data: opportunities = [],
    isLoading: isLoadingOpportunities,
    refetch: refetchOpportunities,
  } = useQuery({
    queryKey: ["business-execution-opportunities", orgId],
    queryFn: () => businessExecutionService.getOpportunities(orgId),
    staleTime: 30_000,
  });

  // 6. Root Causes
  const {
    data: rootCauses = [],
    isLoading: isLoadingRootCauses,
    refetch: refetchRootCauses,
  } = useQuery({
    queryKey: ["business-execution-root-causes"],
    queryFn: () => businessExecutionService.getRootCauses(),
    staleTime: 30_000,
  });

  // 7. Strategies
  const {
    data: strategies = [],
    isLoading: isLoadingStrategies,
    refetch: refetchStrategies,
  } = useQuery({
    queryKey: ["business-execution-strategies", orgId],
    queryFn: () => businessExecutionService.getStrategies(orgId),
    staleTime: 30_000,
  });

  // 8. Content Items
  const {
    data: contentItems = [],
    isLoading: isLoadingContent,
    refetch: refetchContent,
  } = useQuery({
    queryKey: ["business-execution-content"],
    queryFn: () => businessExecutionService.getContent(),
    staleTime: 30_000,
  });

  // 9. Publishing Logs
  const {
    data: publishingLogs = [],
    isLoading: isLoadingPublishing,
    refetch: refetchPublishing,
  } = useQuery({
    queryKey: ["business-execution-publishing"],
    queryFn: () => businessExecutionService.getPublishing(),
    staleTime: 30_000,
  });

  // 10. Workforce Status
  const {
    data: workforceStatus,
    isLoading: isLoadingWorkforce,
    refetch: refetchWorkforce,
  } = useQuery({
    queryKey: ["business-execution-workforce"],
    queryFn: () => businessExecutionService.getWorkforce(),
    staleTime: 30_000,
  });

  // Mutation Handlers
  const handleGenerateStrategy = async (input: GenerateStrategyInput) => {
    try {
      await businessExecutionService.generateStrategy({
        ...input,
        organizationId: orgId,
      });
      toast.success("90-Day Execution Strategy Generated", {
        description: `Strategy "${input.strategyTitle}" generated and enrolled into closed-loop execution.`,
      });
      refetchStrategies();
      refetchOverview();
    } catch (err: any) {
      toast.error("Strategy Generation Failed", {
        description: err?.message || "Failed to generate execution strategy.",
      });
    }
  };

  const handleGenerateContent = async (input: GenerateContentInput) => {
    try {
      await businessExecutionService.generateContent(input);
      toast.success("Content Item Generated", {
        description: `Content generated for strategy ${input.strategyId}.`,
      });
      refetchContent();
      refetchOverview();
    } catch (err: any) {
      toast.error("Content Generation Failed", {
        description: err?.message || "Failed to generate content item.",
      });
    }
  };

  const handlePublishContent = async (input: PublishContentInput) => {
    try {
      await businessExecutionService.publishContent(input);
      toast.success("Content Published Live", {
        description: `Content published to ${input.targetPlatform || "CMS"}.`,
      });
      refetchPublishing();
      refetchOverview();
    } catch (err: any) {
      toast.error("Publishing Failed", {
        description: err?.message || "Failed to publish content.",
      });
    }
  };

  const handleRunExecution = async (input: RunExecutionInput) => {
    try {
      await businessExecutionService.runExecution({
        ...input,
        organizationId: orgId,
      });
      toast.success("Autonomous Execution Launched", {
        description: `Closed-loop execution run "${input.executionName}" dispatched.`,
      });
      refetchHistory();
      refetchOptimization();
      refetchWorkforce();
    } catch (err: any) {
      toast.error("Execution Dispatch Failed", {
        description: err?.message || "Failed to dispatch autonomous execution run.",
      });
    }
  };

  const handleRefreshAll = () => {
    refetchOverview();
    refetchStatistics();
    refetchOptimization();
    refetchHistory();
    refetchOpportunities();
    refetchRootCauses();
    refetchStrategies();
    refetchContent();
    refetchPublishing();
    refetchWorkforce();
    toast.info("Refreshed closed-loop business execution telemetry.");
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Autonomous Business Execution
                </h1>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold"
                >
                  CLOSED-LOOP ENGINE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enterprise Closed-Loop Autonomous Execution: Opportunity detection, technical root cause analysis, 90-day roadmaps, CMS auto-publishing, and agent orchestration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="h-8 text-xs gap-1.5 border-border/60 hover:bg-surface-elevated"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin text-purple-400" : ""}`}
            />
            Sync Telemetry
          </Button>
        </div>
      </div>

      {/* Overview Dashboard Card */}
      <ExecutionOverviewDashboardCard
        overview={overview}
        statistics={statistics}
        optimization={optimization}
        isLoading={isLoadingOverview}
      />

      {/* Tabbed Interactive Consoles */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="bg-surface border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-lg"
          >
            <Zap className="w-3.5 h-3.5" />
            Opportunities & Diagnostic ({opportunities.length})
          </TabsTrigger>

          <TabsTrigger
            value="strategies"
            className="text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-lg"
          >
            <Compass className="w-3.5 h-3.5" />
            90-Day Strategies ({strategies.length})
          </TabsTrigger>

          <TabsTrigger
            value="content"
            className="text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-lg"
          >
            <FileText className="w-3.5 h-3.5" />
            Content & CMS Publishing ({publishingLogs.length})
          </TabsTrigger>

          <TabsTrigger
            value="workforce"
            className="text-xs gap-1.5 py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium rounded-lg"
          >
            <Bot className="w-3.5 h-3.5" />
            Workforce & Optimization Loop
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Opportunities & Root Causes */}
        <TabsContent value="overview" className="mt-0 space-y-4">
          <OpportunityRootCausePanel
            opportunities={opportunities}
            rootCauses={rootCauses}
            isLoading={isLoadingOpportunities || isLoadingRootCauses}
          />
        </TabsContent>

        {/* Tab 2: 90-Day Execution Strategies */}
        <TabsContent value="strategies" className="mt-0 space-y-4">
          <StrategyRoadmapPlannerTable
            strategies={strategies}
            onGenerateStrategy={handleGenerateStrategy}
            isLoading={isLoadingStrategies}
          />
        </TabsContent>

        {/* Tab 3: Content Generation & CMS Publishing */}
        <TabsContent value="content" className="mt-0 space-y-4">
          <ContentPublishingConsole
            contentItems={contentItems}
            publishingLogs={publishingLogs}
            onGenerateContent={handleGenerateContent}
            onPublishContent={handlePublishContent}
            isLoading={isLoadingContent || isLoadingPublishing}
          />
        </TabsContent>

        {/* Tab 4: AI Workforce & Closed-Loop Telemetry */}
        <TabsContent value="workforce" className="mt-0 space-y-4">
          <WorkforceClosedLoopConsole
            workforceStatus={workforceStatus}
            optimizationStatus={optimization}
            history={history}
            onRunExecution={handleRunExecution}
            isLoading={isLoadingWorkforce || isLoadingOptimization || isLoadingHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

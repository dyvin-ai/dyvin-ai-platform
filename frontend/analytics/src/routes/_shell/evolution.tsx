import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  EvolutionDashboardOverviewCard,
  ModelRegistryEvaluationCard,
  OptimalRoutingConsoleCard,
  PromptWorkflowEvolutionCard,
  LearningOptimizationHistoryCard,
  BenchmarkQualityOverviewCard,
} from "@/components/evolution";
import { aiEvolutionService } from "@/services";
import {
  Cpu,
  Sparkles,
  Zap,
  Workflow,
  History,
  ShieldCheck,
  RefreshCw,
  GitMerge,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/evolution")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise AI Evolution & Model Lifecycle Management" },
      {
        name: "description",
        content:
          "Enterprise AI Evolution Platform: Autonomous Model Lifecycle, Continuous Prompt Optimization, Intelligent Task-Based Dynamic Routing & System Quality Engine.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise AI Evolution & Model Lifecycle Management",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI Evolution Platform: Autonomous Model Lifecycle, Continuous Prompt Optimization, Intelligent Task-Based Dynamic Routing & System Quality Engine.",
      },
    ],
  }),
  component: AIEvolutionPage,
});

function AIEvolutionPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["evolution-dashboard"],
    queryFn: () => aiEvolutionService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Models
  const {
    data: models = [],
    isLoading: isLoadingModels,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["evolution-models"],
    queryFn: () => aiEvolutionService.getModels(),
    staleTime: 30_000,
  });

  // 3. Prompts
  const {
    data: prompts = [],
    isLoading: isLoadingPrompts,
    refetch: refetchPrompts,
  } = useQuery({
    queryKey: ["evolution-prompts"],
    queryFn: () => aiEvolutionService.getPrompts(),
    staleTime: 30_000,
  });

  // 4. Workflows
  const {
    data: workflows = [],
    isLoading: isLoadingWorkflows,
    refetch: refetchWorkflows,
  } = useQuery({
    queryKey: ["evolution-workflows"],
    queryFn: () => aiEvolutionService.getWorkflows(),
    staleTime: 30_000,
  });

  // 5. Strategies
  const {
    data: strategies = [],
    isLoading: isLoadingStrategies,
    refetch: refetchStrategies,
  } = useQuery({
    queryKey: ["evolution-strategies"],
    queryFn: () => aiEvolutionService.getStrategies(),
    staleTime: 30_000,
  });

  // 6. Quality Metrics
  const {
    data: quality,
    isLoading: isLoadingQuality,
    refetch: refetchQuality,
  } = useQuery({
    queryKey: ["evolution-quality"],
    queryFn: () => aiEvolutionService.getQuality(),
    staleTime: 30_000,
  });

  // 7. Benchmarks
  const {
    data: benchmarks = [],
    isLoading: isLoadingBenchmarks,
    refetch: refetchBenchmarks,
  } = useQuery({
    queryKey: ["evolution-benchmarks"],
    queryFn: () => aiEvolutionService.getBenchmarks(),
    staleTime: 30_000,
  });

  // 8. Providers
  const {
    data: providers = [],
    isLoading: isLoadingProviders,
    refetch: refetchProviders,
  } = useQuery({
    queryKey: ["evolution-providers"],
    queryFn: () => aiEvolutionService.getProviders(),
    staleTime: 30_000,
  });

  // 9. History
  const {
    data: history = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["evolution-history"],
    queryFn: () => aiEvolutionService.getHistory(),
    staleTime: 30_000,
  });

  // 10. Statistics
  const {
    data: statistics,
    isLoading: isLoadingStatistics,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["evolution-statistics"],
    queryFn: () => aiEvolutionService.getStatistics(),
    staleTime: 30_000,
  });

  const handleRefreshAll = async () => {
    toast.info("Refreshing AI Evolution telemetry...");
    await Promise.all([
      refetchOverview(),
      refetchModels(),
      refetchPrompts(),
      refetchWorkflows(),
      refetchStrategies(),
      refetchQuality(),
      refetchBenchmarks(),
      refetchProviders(),
      refetchHistory(),
      refetchStatistics(),
    ]);
    toast.success("AI Evolution state synchronized");
  };

  const handleFetchRoute = async (taskType: string) => {
    return aiEvolutionService.getOptimalRoute(taskType);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <GitMerge className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Enterprise AI Evolution Platform
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs">
                  Phase F26
                </Badge>
              </h1>
            </div>
          </div>
          <p className="text-xs md:text-sm text-foreground-muted mt-1">
            Autonomous multi-model registry, dynamic routing cascades, winning prompt synthesis, and continuous quality guardrails
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="h-9 gap-1.5 text-xs border-border/80 hover:bg-surface-elevated"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetchingOverview ? "animate-spin text-primary" : "text-foreground-muted"}`} />
            Sync State
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-elevated border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            Platform Overview
          </TabsTrigger>

          <TabsTrigger
            value="models"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Cpu className="h-3.5 w-3.5 text-blue-400" />
            Model Registry ({models.length})
          </TabsTrigger>

          <TabsTrigger
            value="routing"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Routing Optimizer
          </TabsTrigger>

          <TabsTrigger
            value="prompts"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <Workflow className="h-3.5 w-3.5 text-emerald-400" />
            Prompts & Workflows
          </TabsTrigger>

          <TabsTrigger
            value="learning"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <History className="h-3.5 w-3.5 text-orange-400" />
            Learning History ({history.length})
          </TabsTrigger>

          <TabsTrigger
            value="benchmarks"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-surface-card data-[state=active]:text-foreground rounded-lg"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Quality & Benchmarks
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <EvolutionDashboardOverviewCard
            overview={overview}
            statistics={statistics}
            onNavigateTab={setActiveTab}
            isLoading={isLoadingOverview}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimalRoutingConsoleCard
              initialRecommendation={null}
              onFetchRoute={handleFetchRoute}
              isLoading={isLoadingOverview}
            />

            <BenchmarkQualityOverviewCard
              quality={quality}
              benchmarks={benchmarks}
              providers={providers}
              isLoading={isLoadingQuality}
            />
          </div>
        </TabsContent>

        {/* TAB 2: MODELS */}
        <TabsContent value="models">
          <ModelRegistryEvaluationCard
            models={models}
            evaluations={[]}
            isLoading={isLoadingModels}
          />
        </TabsContent>

        {/* TAB 3: ROUTING */}
        <TabsContent value="routing">
          <OptimalRoutingConsoleCard
            initialRecommendation={null}
            onFetchRoute={handleFetchRoute}
            isLoading={isLoadingOverview}
          />
        </TabsContent>

        {/* TAB 4: PROMPTS & WORKFLOWS */}
        <TabsContent value="prompts">
          <PromptWorkflowEvolutionCard
            prompts={prompts}
            workflows={workflows}
            strategies={strategies}
            isLoading={isLoadingPrompts || isLoadingWorkflows || isLoadingStrategies}
          />
        </TabsContent>

        {/* TAB 5: LEARNING HISTORY */}
        <TabsContent value="learning">
          <LearningOptimizationHistoryCard
            history={history}
            isLoading={isLoadingHistory}
          />
        </TabsContent>

        {/* TAB 6: QUALITY & BENCHMARKS */}
        <TabsContent value="benchmarks">
          <BenchmarkQualityOverviewCard
            quality={quality}
            benchmarks={benchmarks}
            providers={providers}
            isLoading={isLoadingQuality || isLoadingBenchmarks || isLoadingProviders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

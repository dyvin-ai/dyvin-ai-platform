import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RetrievalIntelligenceOverviewCard,
  RetrievalTelemetryCard,
  SourceDiscoveryMatrixCard,
  ResearchProjectsConsoleCard,
  ModelComparisonGridCard,
  NewResearchRunModal,
} from "@/components/retrieval";
import { retrievalIntelligenceService } from "@/services";
import {
  BookOpen,
  Activity,
  Globe,
  FlaskConical,
  Sparkles,
  RefreshCw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { StartResearchInput } from "@/types";

export const Route = createFileRoute("/_shell/research")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Research & Retrieval Intelligence Engine" },
      {
        name: "description",
        content:
          "Enterprise Research & Retrieval Intelligence Engine: Inspect RAG vector chunk performance, citation provenance, source leaderboard authority, and run autonomous discovery pipelines.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Research & Retrieval Intelligence Engine",
      },
      {
        property: "og:description",
        content:
          "RAG explorer, cross-model retrieval comparison, authoritative source discovery, and autonomous market research sweeps.",
      },
    ],
  }),
  component: ResearchIntelligenceRouteView,
});

function ResearchIntelligenceRouteView() {
  const queryClient = useQueryClient();
  const organizationId = "f5bb0153-e41a-49ee-97dc-e03dc6228403";

  const [activeTab, setActiveTab] = useState<string>("telemetry");
  const [isNewRunModalOpen, setIsNewRunModalOpen] = useState(false);

  // Queries
  const { data: overview, isLoading: isOverviewLoading, refetch: refetchOverview } = useQuery({
    queryKey: ["retrieval", "overview"],
    queryFn: () => retrievalIntelligenceService.getRetrievalOverview(),
  });

  const { data: timelineData } = useQuery({
    queryKey: ["retrieval", "timeline"],
    queryFn: () => retrievalIntelligenceService.getRetrievalTimeline(),
  });

  const { data: citations } = useQuery({
    queryKey: ["retrieval", "citations"],
    queryFn: () => retrievalIntelligenceService.getCitationsOverview(),
  });

  const { data: sources = [], isLoading: isSourcesLoading } = useQuery({
    queryKey: ["retrieval", "sources"],
    queryFn: () => retrievalIntelligenceService.getSources(),
  });

  const { data: leaderboards = [] } = useQuery({
    queryKey: ["retrieval", "leaderboard"],
    queryFn: () => retrievalIntelligenceService.getSourceLeaderboard(),
  });

  const { data: urlPerformances = [] } = useQuery({
    queryKey: ["retrieval", "urls"],
    queryFn: async () => {
      const res = await retrievalIntelligenceService.getURLPerformance();
      return Array.isArray(res) ? res : [res];
    },
  });

  const { data: domainPerformances = [] } = useQuery({
    queryKey: ["retrieval", "domains"],
    queryFn: async () => {
      const res = await retrievalIntelligenceService.getDomainPerformance();
      return Array.isArray(res) ? res : [res];
    },
  });

  const { data: promptPerformances = [] } = useQuery({
    queryKey: ["retrieval", "prompts"],
    queryFn: async () => {
      const res = await retrievalIntelligenceService.getPromptPerformance();
      return Array.isArray(res) ? res : [res];
    },
  });

  const { data: modelComparisons = [] } = useQuery({
    queryKey: ["retrieval", "models"],
    queryFn: () => retrievalIntelligenceService.getModelComparison(),
  });

  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ["research", "projects", organizationId],
    queryFn: () => retrievalIntelligenceService.getResearchProjects(organizationId),
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ["research", "opportunities"],
    queryFn: () => retrievalIntelligenceService.getResearchOpportunities(),
  });

  const { data: threats = [] } = useQuery({
    queryKey: ["research", "threats"],
    queryFn: () => retrievalIntelligenceService.getResearchThreats(),
  });

  const { data: trends = [] } = useQuery({
    queryKey: ["research", "trends"],
    queryFn: () => retrievalIntelligenceService.getResearchTrends(),
  });

  const { data: benchmarks = [] } = useQuery({
    queryKey: ["research", "benchmarks"],
    queryFn: () => retrievalIntelligenceService.getResearchBenchmarks(),
  });

  // Handlers
  const handleLaunchResearchRun = async (input: StartResearchInput) => {
    try {
      const newProj = await retrievalIntelligenceService.runResearch(input);
      toast.success("Autonomous research discovery run launched successfully!");
      queryClient.invalidateQueries({ queryKey: ["research", "projects"] });
      queryClient.invalidateQueries({ queryKey: ["retrieval"] });
      setActiveTab("discovery");
      return newProj;
    } catch (err: any) {
      toast.error(err?.message || "Failed to start research run.");
      throw err;
    }
  };

  const handleRefreshAll = () => {
    refetchOverview();
    queryClient.invalidateQueries({ queryKey: ["retrieval"] });
    queryClient.invalidateQueries({ queryKey: ["research"] });
    toast.success("Retrieval intelligence telemetry refreshed.");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-[1600px] mx-auto animate-in fade-in-50 duration-300">
      {/* Overview & Header Card */}
      <RetrievalIntelligenceOverviewCard
        overview={overview}
        citations={citations}
        activeProjectsCount={projects.length}
        isLoading={isOverviewLoading}
        onNewResearchClick={() => setIsNewRunModalOpen(true)}
        onRefreshClick={handleRefreshAll}
        onInspectSourcesClick={() => setActiveTab("sources")}
        onCompareModelsClick={() => setActiveTab("models")}
      />

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-3">
          <TabsList className="bg-card/70 border border-border/50 p-1 rounded-xl">
            <TabsTrigger value="telemetry" className="text-xs gap-2 py-1.5 px-3">
              <Activity className="h-3.5 w-3.5 text-primary" />
              RAG Telemetry
            </TabsTrigger>
            <TabsTrigger value="sources" className="text-xs gap-2 py-1.5 px-3">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              Source Discovery ({sources.length})
            </TabsTrigger>
            <TabsTrigger value="discovery" className="text-xs gap-2 py-1.5 px-3">
              <FlaskConical className="h-3.5 w-3.5 text-rose-400" />
              Research Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="models" className="text-xs gap-2 py-1.5 px-3">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              Model Comparison
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              className="text-xs h-8 gap-1.5 border-border/60"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync
            </Button>
            <Button
              size="sm"
              onClick={() => setIsNewRunModalOpen(true)}
              className="text-xs h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Launch Run
            </Button>
          </div>
        </div>

        {/* Tab 1: Telemetry */}
        <TabsContent value="telemetry" className="space-y-6 mt-0">
          <RetrievalTelemetryCard
            overview={overview}
            timeline={timelineData?.timeline || []}
            isLoading={isOverviewLoading}
          />
        </TabsContent>

        {/* Tab 2: Sources & Provenance */}
        <TabsContent value="sources" className="space-y-6 mt-0">
          <SourceDiscoveryMatrixCard
            sources={sources}
            leaderboards={leaderboards}
            urlPerformances={urlPerformances}
            domainPerformances={domainPerformances}
            isLoading={isSourcesLoading}
          />
        </TabsContent>

        {/* Tab 3: Research Projects */}
        <TabsContent value="discovery" className="space-y-6 mt-0">
          <ResearchProjectsConsoleCard
            projects={projects}
            opportunities={opportunities}
            threats={threats}
            trends={trends}
            onNewRunClick={() => setIsNewRunModalOpen(true)}
            isLoading={isProjectsLoading}
          />
        </TabsContent>

        {/* Tab 4: Model Comparison */}
        <TabsContent value="models" className="space-y-6 mt-0">
          <ModelComparisonGridCard
            models={modelComparisons}
            benchmarks={benchmarks}
            prompts={promptPerformances}
          />
        </TabsContent>
      </Tabs>

      {/* Modal Dialog */}
      <NewResearchRunModal
        open={isNewRunModalOpen}
        onOpenChange={setIsNewRunModalOpen}
        onSubmit={handleLaunchResearchRun}
        organizationId={organizationId}
      />
    </div>
  );
}
export default ResearchIntelligenceRouteView;

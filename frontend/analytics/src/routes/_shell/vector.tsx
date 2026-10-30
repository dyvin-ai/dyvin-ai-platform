import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  VectorOverviewMetricsCard,
  VectorCollectionsTable,
  SemanticVectorSearchConsole,
  CosineSimilarityCalculator,
  EmbeddingGeneratorPanel,
} from "@/components/vector";
import { vectorIntelligenceService } from "@/services";
import {
  Cpu,
  Search,
  Database,
  Scale,
  RefreshCw,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/vector")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Vector Intelligence Platform" },
      {
        name: "description",
        content:
          "Enterprise high-dimensional vector embeddings, hybrid semantic retrieval, multi-provider embedding models, and cosine distance benchmarks.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Vector Intelligence Platform",
      },
      {
        property: "og:description",
        content:
          "Enterprise high-dimensional vector embeddings, hybrid semantic retrieval, multi-provider embedding models, and cosine distance benchmarks.",
      },
    ],
  }),
  component: VectorIntelligencePage,
});

function VectorIntelligencePage() {
  const queryClient = useQueryClient();
  const { activeOrganization } = useWorkspace();
  const orgId = activeOrganization?.id || "org-default";

  const [activeTab, setActiveTab] = useState("search");

  // 1. Vector Engine Metrics
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
    isFetching: isFetchingMetrics,
  } = useQuery({
    queryKey: ["vector-metrics"],
    queryFn: () => vectorIntelligenceService.getMetrics(),
    staleTime: 30_000,
  });

  // 2. Active Embedding Providers
  const {
    data: providers = [],
    isLoading: isLoadingProviders,
    refetch: refetchProviders,
  } = useQuery({
    queryKey: ["vector-providers"],
    queryFn: () => vectorIntelligenceService.getProviders(),
    staleTime: 60_000,
  });

  // 3. Vector Indexes Configuration
  const {
    data: indexes = [],
    isLoading: isLoadingIndexes,
    refetch: refetchIndexes,
  } = useQuery({
    queryKey: ["vector-indexes"],
    queryFn: () => vectorIntelligenceService.getIndexes(),
    staleTime: 60_000,
  });

  // 4. Vector Collections
  const {
    data: collections = [],
    isLoading: isLoadingCollections,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ["vector-collections", orgId],
    queryFn: () => vectorIntelligenceService.getCollections(orgId),
    staleTime: 30_000,
  });

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchMetrics(),
      refetchProviders(),
      refetchIndexes(),
      refetchCollections(),
    ]);
    toast.success("Vector telemetry & index configurations refreshed");
  };

  const isRefreshing = isFetchingMetrics;

  return (
    <div className="flex-1 space-y-5 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Cpu className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
                  Enterprise Vector Intelligence Platform
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-mono"
                >
                  <Activity className="size-3 mr-1 inline animate-pulse text-emerald-500" />
                  {metrics?.engineStatus ?? "ONLINE"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dense high-dimensional vector embeddings, hybrid semantic retrieval, multi-provider models, and cosine distance benchmarks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Overview Telemetry Card */}
      <VectorOverviewMetricsCard
        metrics={metrics}
        providers={providers}
        indexes={indexes}
        isLoading={isLoadingMetrics || isLoadingProviders || isLoadingIndexes}
      />

      {/* Functional Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-surface border border-border/60 p-1">
          <TabsTrigger value="search" className="gap-1.5 text-xs">
            <Search className="size-3.5" />
            Search Console
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-1.5 text-xs">
            <Database className="size-3.5" />
            Collections & Partitions ({collections.length})
          </TabsTrigger>
          <TabsTrigger value="similarity" className="gap-1.5 text-xs">
            <Scale className="size-3.5" />
            Cosine Comparator
          </TabsTrigger>
          <TabsTrigger value="generator" className="gap-1.5 text-xs">
            <Cpu className="size-3.5" />
            Embedding Generator
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Hybrid Semantic Search Console */}
        <TabsContent value="search" className="space-y-4 m-0">
          <SemanticVectorSearchConsole organizationId={orgId} />
        </TabsContent>

        {/* Tab 2: Collections & Partitions */}
        <TabsContent value="collections" className="space-y-4 m-0">
          <VectorCollectionsTable
            collections={collections}
            isLoading={isLoadingCollections}
          />
        </TabsContent>

        {/* Tab 3: Cosine Similarity Comparator */}
        <TabsContent value="similarity" className="space-y-4 m-0">
          <CosineSimilarityCalculator />
        </TabsContent>

        {/* Tab 4: Embedding Generator */}
        <TabsContent value="generator" className="space-y-4 m-0">
          <EmbeddingGeneratorPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

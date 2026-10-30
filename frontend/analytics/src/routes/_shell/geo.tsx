import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  GeoOverviewDashboardCard,
  GeoCitationsRetrievalPanel,
  GeoCompetitorBenchmarkTable,
  GeoDomainUrlIntelligenceTable,
  GeoKeywordClusteringConsole,
  GeoRecommendationsActionPanel,
} from "@/components/geo";
import { aiSearchIntelligenceService } from "@/services";
import {
  Globe2,
  RefreshCw,
  Sparkles,
  Quote,
  Users,
  Globe,
  FileSpreadsheet,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/geo")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise AI Search Visibility & GEO Analytics" },
      {
        name: "description",
        content:
          "Enterprise Generative Engine Optimization (GEO) analytics, multi-LLM citation tracking, retrieval rank positioning, competitor benchmarking, and one-click optimization actions.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise AI Search Visibility & GEO Analytics",
      },
      {
        property: "og:description",
        content:
          "Enterprise Generative Engine Optimization (GEO) analytics, multi-LLM citation tracking, retrieval rank positioning, competitor benchmarking, and one-click optimization actions.",
      },
    ],
  }),
  component: GeoAnalyticsPage,
});

function GeoAnalyticsPage() {
  const queryClient = useQueryClient();
  const { activeOrganization } = useWorkspace();
  const orgId = activeOrganization?.id || "org-default";

  const [activeTab, setActiveTab] = useState("citations");

  // 1. Executive Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["geo-overview"],
    queryFn: () => aiSearchIntelligenceService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Citations Overview
  const {
    data: citations,
    isLoading: isLoadingCitations,
    refetch: refetchCitations,
  } = useQuery({
    queryKey: ["geo-citations"],
    queryFn: () => aiSearchIntelligenceService.getCitations(),
    staleTime: 30_000,
  });

  // 3. Retrieval Analytics
  const {
    data: retrieval,
    isLoading: isLoadingRetrieval,
    refetch: refetchRetrieval,
  } = useQuery({
    queryKey: ["geo-retrieval"],
    queryFn: () => aiSearchIntelligenceService.getRetrieval(),
    staleTime: 30_000,
  });

  // 4. Competitors Benchmark
  const {
    data: competitors = [],
    isLoading: isLoadingCompetitors,
    refetch: refetchCompetitors,
  } = useQuery({
    queryKey: ["geo-competitors"],
    queryFn: () => aiSearchIntelligenceService.getCompetitors(),
    staleTime: 30_000,
  });

  // 5. Authority Domains
  const {
    data: domains = [],
    isLoading: isLoadingDomains,
    refetch: refetchDomains,
  } = useQuery({
    queryKey: ["geo-domains"],
    queryFn: () => aiSearchIntelligenceService.getDomains(),
    staleTime: 60_000,
  });

  // 6. URL Intelligence
  const {
    data: urls = [],
    isLoading: isLoadingUrls,
    refetch: refetchUrls,
  } = useQuery({
    queryKey: ["geo-urls"],
    queryFn: () => aiSearchIntelligenceService.getUrls(),
    staleTime: 60_000,
  });

  // 7. Keyword 2.0 Analytics
  const {
    data: keywords,
    isLoading: isLoadingKeywords,
    refetch: refetchKeywords,
  } = useQuery({
    queryKey: ["geo-keywords"],
    queryFn: () => aiSearchIntelligenceService.getKeywords(),
    staleTime: 60_000,
  });

  // 8. Actionable Recommendations
  const {
    data: recommendations = [],
    isLoading: isLoadingRecommendations,
    refetch: refetchRecommendations,
  } = useQuery({
    queryKey: ["geo-recommendations"],
    queryFn: () => aiSearchIntelligenceService.getRecommendations(),
    staleTime: 30_000,
  });

  // 9. Platform Statistics
  const {
    data: statistics,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["geo-statistics"],
    queryFn: () => aiSearchIntelligenceService.getStatistics(),
    staleTime: 60_000,
  });

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchOverview(),
      refetchCitations(),
      refetchRetrieval(),
      refetchCompetitors(),
      refetchDomains(),
      refetchUrls(),
      refetchKeywords(),
      refetchRecommendations(),
      refetchStatistics(),
    ]);
    toast.success("GEO analytics and citation telemetry refreshed");
  };

  const isRefreshing = isFetchingOverview;

  return (
    <div className="flex-1 space-y-5 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Globe2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
                  AI Search Visibility & GEO Analytics
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-mono"
                >
                  <Activity className="size-3 mr-1 inline animate-pulse text-emerald-500" />
                  Score: {overview?.overallAiVisibilityScore ?? 84.5}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generative Engine Optimization (GEO), multi-LLM citation tracking, retrieval rank positioning, and competitor benchmarks.
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
      <GeoOverviewDashboardCard
        overview={overview}
        statistics={statistics}
        isLoading={isLoadingOverview}
      />

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-surface border border-border/60 p-1 flex-wrap">
          <TabsTrigger value="citations" className="gap-1.5 text-xs">
            <Quote className="size-3.5" />
            Citations & Retrieval
          </TabsTrigger>
          <TabsTrigger value="competitors" className="gap-1.5 text-xs">
            <Users className="size-3.5" />
            Competitors ({competitors.length})
          </TabsTrigger>
          <TabsTrigger value="domains" className="gap-1.5 text-xs">
            <Globe className="size-3.5" />
            Domains & URLs ({domains.length + urls.length})
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-1.5 text-xs">
            <FileSpreadsheet className="size-3.5" />
            Keyword 2.0 Clusters
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-1.5 text-xs">
            <Sparkles className="size-3.5" />
            GEO Actions ({recommendations.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Citations & Retrieval */}
        <TabsContent value="citations" className="space-y-4 m-0">
          <GeoCitationsRetrievalPanel
            citations={citations}
            retrieval={retrieval}
            isLoading={isLoadingCitations || isLoadingRetrieval}
          />
        </TabsContent>

        {/* Tab 2: Competitor Benchmarks */}
        <TabsContent value="competitors" className="space-y-4 m-0">
          <GeoCompetitorBenchmarkTable
            competitors={competitors}
            isLoading={isLoadingCompetitors}
          />
        </TabsContent>

        {/* Tab 3: Domains & URLs */}
        <TabsContent value="domains" className="space-y-4 m-0">
          <GeoDomainUrlIntelligenceTable
            domains={domains}
            urls={urls}
            isLoading={isLoadingDomains || isLoadingUrls}
          />
        </TabsContent>

        {/* Tab 4: Keyword 2.0 Clusters */}
        <TabsContent value="keywords" className="space-y-4 m-0">
          <GeoKeywordClusteringConsole
            keywordData={keywords}
            isLoading={isLoadingKeywords}
            onRefresh={refetchKeywords}
          />
        </TabsContent>

        {/* Tab 5: Actionable Recommendations */}
        <TabsContent value="recommendations" className="space-y-4 m-0">
          <GeoRecommendationsActionPanel
            recommendations={recommendations}
            isLoading={isLoadingRecommendations}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

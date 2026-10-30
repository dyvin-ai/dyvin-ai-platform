import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IndustryOverviewDashboardCard,
  IndustryBenchmarkComparisonCard,
  GlobalIndustryLeaderboardTable,
  IndustryDomainAuthorityCard,
  IndustryResearchPublicationConsole,
} from "@/components/industry";
import { industryCloudService } from "@/services";
import {
  Building2,
  Target,
  Trophy,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/industry")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise AI Industry Cloud Platform" },
      {
        name: "description",
        content:
          "Enterprise AI Industry Cloud: Anonymous Vertical Benchmarking, Global Opt-in Leaderboards, Domain Authority & Trust Scores, and AI Search Trend Detection.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise AI Industry Cloud Platform",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI Industry Cloud: Anonymous Vertical Benchmarking, Global Opt-in Leaderboards, Domain Authority & Trust Scores, and AI Search Trend Detection.",
      },
    ],
  }),
  component: IndustryCloudPage,
});

function IndustryCloudPage() {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIndustry, setSelectedIndustry] = useState("SAAS");
  const [selectedCategory, setSelectedCategory] = useState("B2B_SAAS");
  const [publicIndexQuery, setPublicIndexQuery] = useState("SaaS Visibility");
  const [activeSearchTerm, setActiveSearchTerm] = useState("SaaS Visibility");
  const [targetDomain, setTargetDomain] = useState("dyvin.ai");
  const [activeDomainLookup, setActiveDomainLookup] = useState("dyvin.ai");

  // 1. Industry Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["industry-dashboard", selectedIndustry],
    queryFn: () => industryCloudService.getDashboard(selectedIndustry),
    staleTime: 30_000,
  });

  // 2. Industry Benchmarks
  const {
    data: benchmarks,
    isLoading: isLoadingBenchmarks,
    refetch: refetchBenchmarks,
  } = useQuery({
    queryKey: ["industry-benchmarks", selectedIndustry],
    queryFn: () => industryCloudService.getBenchmarks(selectedIndustry),
    staleTime: 30_000,
  });

  // 3. Global Leaderboards
  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    refetch: refetchLeaderboard,
  } = useQuery({
    queryKey: ["industry-leaderboards", selectedCategory],
    queryFn: () => industryCloudService.getLeaderboards(selectedCategory),
    staleTime: 30_000,
  });

  // 4. Domain Authority & Trust Score
  const {
    data: authority,
    isLoading: isLoadingAuthority,
    refetch: refetchAuthority,
  } = useQuery({
    queryKey: ["industry-authority", activeDomainLookup],
    queryFn: () => industryCloudService.getAuthority(activeDomainLookup),
    staleTime: 30_000,
  });

  // 5. Public Index Explorer
  const {
    data: publicIndex,
    isLoading: isLoadingIndex,
    refetch: refetchIndex,
  } = useQuery({
    queryKey: ["industry-public-index", activeSearchTerm],
    queryFn: () => industryCloudService.getPublicIndex(activeSearchTerm),
    staleTime: 30_000,
  });

  // 6. Publications & Trends
  const { data: reports, refetch: refetchReports } = useQuery({
    queryKey: ["industry-reports"],
    queryFn: () => industryCloudService.getReports(),
    staleTime: 60_000,
  });

  const { data: trends, refetch: refetchTrends } = useQuery({
    queryKey: ["industry-trends"],
    queryFn: () => industryCloudService.getTrends(),
    staleTime: 60_000,
  });

  const { data: models, refetch: refetchModels } = useQuery({
    queryKey: ["industry-models"],
    queryFn: () => industryCloudService.getModels(),
    staleTime: 60_000,
  });

  const { data: publications, refetch: refetchPublications } = useQuery({
    queryKey: ["industry-publications"],
    queryFn: () => industryCloudService.getPublications(),
    staleTime: 60_000,
  });

  const { data: platformStats } = useQuery({
    queryKey: ["industry-statistics"],
    queryFn: () => industryCloudService.getStatistics(),
    staleTime: 60_000,
  });

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchOverview(),
        refetchBenchmarks(),
        refetchLeaderboard(),
        refetchAuthority(),
        refetchIndex(),
        refetchReports(),
        refetchTrends(),
        refetchModels(),
        refetchPublications(),
      ]);
      toast.success("Industry Cloud metrics refreshed successfully");
    } catch {
      toast.error("Failed to refresh some industry datasets");
    }
  };

  const handleIndexSearch = () => {
    if (!publicIndexQuery.trim()) return;
    setActiveSearchTerm(publicIndexQuery.trim());
    toast.info(`Searching public index for: ${publicIndexQuery.trim()}`);
  };

  const handleDomainLookup = () => {
    if (!targetDomain.trim()) return;
    setActiveDomainLookup(targetDomain.trim());
    toast.info(`Evaluating domain authority for: ${targetDomain.trim()}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-display">
                  Enterprise AI Industry Cloud
                </h1>
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                  Phase F24
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Anonymous cross-tenant vertical baselines, global AI visibility leaderboards, and domain authority scoring.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="border-border/60 text-xs gap-1.5 h-8 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin" : ""}`} />
            Refresh Intelligence
          </Button>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-elevated/80 border border-border/60 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Building2 className="w-3.5 h-3.5" />
            Overview & Index
          </TabsTrigger>
          <TabsTrigger
            value="benchmarks"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Target className="w-3.5 h-3.5" />
            Industry Benchmarks
          </TabsTrigger>
          <TabsTrigger
            value="leaderboards"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <Trophy className="w-3.5 h-3.5" />
            Global Leaderboards
          </TabsTrigger>
          <TabsTrigger
            value="authority"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Domain Authority
          </TabsTrigger>
          <TabsTrigger
            value="publications"
            className="text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5 rounded-lg"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Research & Publications
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview & Index */}
        <TabsContent value="overview" className="space-y-6">
          <IndustryOverviewDashboardCard
            overview={overview}
            platformStats={platformStats}
            publicIndex={publicIndex}
            selectedIndustry={selectedIndustry}
            onIndustryChange={setSelectedIndustry}
            searchQuery={publicIndexQuery}
            onSearchChange={setPublicIndexQuery}
            onSearchSubmit={handleIndexSearch}
            isLoading={isLoadingOverview}
          />
        </TabsContent>

        {/* Tab 2: Benchmarks */}
        <TabsContent value="benchmarks" className="space-y-6">
          <IndustryBenchmarkComparisonCard
            benchmarks={benchmarks}
            isLoading={isLoadingBenchmarks}
          />
        </TabsContent>

        {/* Tab 3: Leaderboards */}
        <TabsContent value="leaderboards" className="space-y-6">
          <GlobalIndustryLeaderboardTable
            leaderboard={leaderboard}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isLoading={isLoadingLeaderboard}
          />
        </TabsContent>

        {/* Tab 4: Domain Authority */}
        <TabsContent value="authority" className="space-y-6">
          <IndustryDomainAuthorityCard
            authority={authority}
            targetDomain={targetDomain}
            onDomainChange={setTargetDomain}
            onLookup={handleDomainLookup}
            isLoading={isLoadingAuthority}
          />
        </TabsContent>

        {/* Tab 5: Publications & Trends */}
        <TabsContent value="publications" className="space-y-6">
          <IndustryResearchPublicationConsole
            reports={reports}
            trends={trends}
            models={models}
            publications={publications}
            isLoading={isLoadingOverview}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

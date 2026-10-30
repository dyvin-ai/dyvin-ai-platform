import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  KeywordIntelligenceOverviewCard,
  KeywordDiscoveryTableCard,
  TopicClustersGridCard,
  SearchVolumeTrendsCard,
  KeywordCampaignsCard,
  GenerativePromptConsoleCard,
  AddKeywordModal,
  ImportKeywordsModal,
  CreateCampaignModal,
} from "@/components/keywords";
import { keywordIntelligenceService } from "@/services";
import {
  Search,
  Layers,
  TrendingUp,
  Zap,
  Wand2,
  RefreshCw,
  Plus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  CreateKeywordInput,
  ImportKeywordsInput,
  CreateCampaignInput,
  PromptTemplateType,
} from "@/types";

export const Route = createFileRoute("/_shell/keywords")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Keyword & Generative Search Discovery Platform" },
      {
        name: "description",
        content:
          "Enterprise Keyword & Generative Search Discovery Platform: Analyze query volumes, semantic topic clusters, automated citation campaigns, and generative prompt synthesis.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Keyword & Generative Search Discovery Platform",
      },
      {
        property: "og:description",
        content:
          "High-throughput keyword intelligence, multi-intent classification, topic cluster graphs, and answer engine citation telemetry.",
      },
    ],
  }),
  component: KeywordIntelligenceRouteView,
});

function KeywordIntelligenceRouteView() {
  const queryClient = useQueryClient();
  const organizationId = "f5bb0153-e41a-49ee-97dc-e03dc6228403";

  const [activeTab, setActiveTab] = useState<string>("catalog");
  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [isGeneratingClusters, setIsGeneratingClusters] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Queries
  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["keyword-intelligence", "overview", organizationId],
    queryFn: () => keywordIntelligenceService.getOverview(organizationId),
  });

  const { data: keywords = [], isLoading: isKeywordsLoading } = useQuery({
    queryKey: ["keyword-intelligence", "keywords", organizationId],
    queryFn: () => keywordIntelligenceService.getKeywords(organizationId),
  });

  const { data: clusters = [], isLoading: isClustersLoading } = useQuery({
    queryKey: ["keyword-intelligence", "clusters"],
    queryFn: () => keywordIntelligenceService.getClusters(),
  });

  const { data: trends = [], isLoading: isTrendsLoading } = useQuery({
    queryKey: ["keyword-intelligence", "trends"],
    queryFn: () => keywordIntelligenceService.getTrends(),
  });

  const { data: searchVolumes = [], isLoading: isVolumesLoading } = useQuery({
    queryKey: ["keyword-intelligence", "search-volume"],
    queryFn: async () => {
      const res = await keywordIntelligenceService.getSearchVolume();
      return Array.isArray(res) ? res : [res];
    },
  });

  const { data: campaigns = [], isLoading: isCampaignsLoading } = useQuery({
    queryKey: ["keyword-intelligence", "campaigns", organizationId],
    queryFn: () => keywordIntelligenceService.getCampaigns(organizationId),
  });

  const { data: promptLibrary = [], isLoading: isPromptLibLoading } = useQuery({
    queryKey: ["keyword-intelligence", "prompt-library"],
    queryFn: () => keywordIntelligenceService.getPromptLibrary(),
  });

  const { data: promptTemplates = [] } = useQuery({
    queryKey: ["keyword-intelligence", "templates"],
    queryFn: () => keywordIntelligenceService.getPromptTemplates(),
  });

  // Handlers
  const handleAddKeyword = async (input: CreateKeywordInput) => {
    try {
      await keywordIntelligenceService.createKeyword(input);
      toast.success("Keyword successfully registered for tracking!");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence"] });
    } catch {
      toast.error("Failed to add keyword");
    }
  };

  const handleImportKeywords = async (input: ImportKeywordsInput) => {
    try {
      const result = await keywordIntelligenceService.importKeywords(input);
      toast.success(`Imported ${result.importedCount} keywords successfully!`);
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence"] });
    } catch {
      toast.error("Failed to import keywords from CSV");
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    try {
      await keywordIntelligenceService.deleteKeyword(id);
      toast.success("Keyword removed from tracking catalog");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence"] });
    } catch {
      toast.error("Failed to delete keyword");
    }
  };

  const handleGenerateClusters = async () => {
    setIsGeneratingClusters(true);
    try {
      await keywordIntelligenceService.generateClusters(organizationId);
      toast.success("AI semantic topic clusters generated successfully!");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "clusters"] });
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "overview"] });
    } catch {
      toast.error("Failed to generate AI clusters");
    } finally {
      setIsGeneratingClusters(false);
    }
  };

  const handleRunCampaign = async (campaignId: string) => {
    try {
      await keywordIntelligenceService.runCampaign(campaignId);
      toast.success("Campaign execution sweep completed! Results updated.");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "campaigns"] });
    } catch {
      toast.error("Failed to execute campaign run");
    }
  };

  const handleCreateCampaign = async (input: CreateCampaignInput) => {
    try {
      await keywordIntelligenceService.createCampaign(input);
      toast.success("New monitoring campaign created successfully!");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "campaigns"] });
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "overview"] });
    } catch {
      toast.error("Failed to create campaign");
    }
  };

  const handleGeneratePrompt = async (keyword: string, templateType: PromptTemplateType) => {
    setIsGeneratingPrompt(true);
    try {
      await keywordIntelligenceService.generatePrompt({
        keyword,
        templateType,
        brandName: "Dyvin AI",
      });
      toast.success("Evaluation prompt synthesized and added to library!");
      await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence", "prompt-library"] });
    } catch {
      toast.error("Failed to synthesize prompt");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["keyword-intelligence"] });
    toast.info("Refreshed keyword discovery data");
  };

  return (
    <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
      {/* Overview Top Card */}
      <KeywordIntelligenceOverviewCard
        overview={overview}
        isLoading={isOverviewLoading}
        onAddKeywordClick={() => setIsAddKeywordModalOpen(true)}
        onImportCsvClick={() => setIsImportModalOpen(true)}
        onGenerateClustersClick={handleGenerateClusters}
        onNewCampaignClick={() => setIsCreateCampaignModalOpen(true)}
      />

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
          <TabsList className="bg-muted/40 p-1 border border-border/50">
            <TabsTrigger value="catalog" className="gap-2 text-xs">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              Keywords & Matrix
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5 font-normal">
                {keywords.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="clusters" className="gap-2 text-xs">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Topic Clusters
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5 font-normal">
                {clusters.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Trends & Volume
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="gap-2 text-xs">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Campaigns
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5 font-normal">
                {campaigns.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="gap-2 text-xs">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              Prompt Synthesis
              <Badge variant="secondary" className="ml-1 text-[10px] py-0 px-1.5 font-normal">
                {promptLibrary.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-1.5 text-xs border-border/60 hover:bg-accent/40"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab 1: Keywords Catalog & Intent Matrix */}
        <TabsContent value="catalog" className="space-y-6 outline-none">
          <KeywordDiscoveryTableCard
            keywords={keywords}
            isLoading={isKeywordsLoading}
            onDeleteKeyword={handleDeleteKeyword}
            onAddKeywordClick={() => setIsAddKeywordModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 2: Topic Clusters */}
        <TabsContent value="clusters" className="space-y-6 outline-none">
          <TopicClustersGridCard
            clusters={clusters}
            isLoading={isClustersLoading}
            onGenerateClusters={handleGenerateClusters}
            isGenerating={isGeneratingClusters}
          />
        </TabsContent>

        {/* Tab 3: Trends & Volume Breakdown */}
        <TabsContent value="trends" className="space-y-6 outline-none">
          <SearchVolumeTrendsCard
            trends={trends}
            searchVolumes={searchVolumes}
            isLoading={isTrendsLoading || isVolumesLoading}
          />
        </TabsContent>

        {/* Tab 4: Campaigns */}
        <TabsContent value="campaigns" className="space-y-6 outline-none">
          <KeywordCampaignsCard
            campaigns={campaigns}
            isLoading={isCampaignsLoading}
            onRunCampaign={handleRunCampaign}
            onCreateCampaignClick={() => setIsCreateCampaignModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 5: Generative Prompt Synthesis */}
        <TabsContent value="prompts" className="space-y-6 outline-none">
          <GenerativePromptConsoleCard
            promptLibrary={promptLibrary}
            templates={promptTemplates}
            isLoading={isPromptLibLoading}
            onGeneratePrompt={handleGeneratePrompt}
            isGenerating={isGeneratingPrompt}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddKeywordModal
        isOpen={isAddKeywordModalOpen}
        onClose={() => setIsAddKeywordModalOpen(false)}
        onSubmit={handleAddKeyword}
        organizationId={organizationId}
        clusters={clusters}
      />

      <ImportKeywordsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleImportKeywords}
        organizationId={organizationId}
      />

      <CreateCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setIsCreateCampaignModalOpen(false)}
        onSubmit={handleCreateCampaign}
        organizationId={organizationId}
      />
    </div>
  );
}
export default KeywordIntelligenceRouteView;

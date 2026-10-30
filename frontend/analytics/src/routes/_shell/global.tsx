import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GlobalIntelligenceOverviewCard,
  MultiRegionLatencyMapCard,
  GlobalKnowledgeGraphCard,
  GlobalCitationsMatrixCard,
  GlobalModelIntelligenceCard,
  GlobalArchiveExplorerModal,
} from "@/components/global";
import { globalIntelligenceService } from "@/services";
import {
  Globe2,
  Network,
  Quote,
  Cpu,
  Search,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/global")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Global Intelligence Distributed Network" },
      {
        name: "description",
        content:
          "Enterprise Global Intelligence Distributed Network: Multi-region edge telemetry, public AI response warehouse, knowledge graph mesh, and cross-model citation analytics.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Global Intelligence Distributed Network",
      },
      {
        property: "og:description",
        content:
          "Distributed AI response warehouse with append-only tamper-resistant logging and federated knowledge mesh.",
      },
    ],
  }),
  component: GlobalIntelligenceRouteView,
});

function GlobalIntelligenceRouteView() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("network");
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  // Queries
  const { data: warehouseStats, isLoading: isWarehouseLoading, refetch: refetchWarehouse } = useQuery({
    queryKey: ["global-intelligence", "warehouse"],
    queryFn: () => globalIntelligenceService.getWarehouseStats(),
  });

  const { data: networkStats, isLoading: isNetworkLoading, refetch: refetchNetwork } = useQuery({
    queryKey: ["global-intelligence", "network-stats"],
    queryFn: () => globalIntelligenceService.getNetworkStatistics(),
  });

  const { data: telemetry = [], isLoading: isTelemetryLoading } = useQuery({
    queryKey: ["global-intelligence", "telemetry"],
    queryFn: () => globalIntelligenceService.getMultiRegionTelemetry(),
  });

  const { data: graphData, isLoading: isGraphLoading } = useQuery({
    queryKey: ["global-intelligence", "knowledge-graph"],
    queryFn: () => globalIntelligenceService.getKnowledgeGraph(),
  });

  const { data: topics = [] } = useQuery({
    queryKey: ["global-intelligence", "topics"],
    queryFn: () => globalIntelligenceService.getTopics(),
  });

  const { data: citations = [], isLoading: isCitationsLoading } = useQuery({
    queryKey: ["global-intelligence", "citations"],
    queryFn: () => globalIntelligenceService.getGlobalCitations(),
  });

  const { data: domainsData } = useQuery({
    queryKey: ["global-intelligence", "domains"],
    queryFn: () => globalIntelligenceService.getGlobalDomains(),
  });

  const domains = Array.isArray(domainsData)
    ? domainsData
    : domainsData
    ? [domainsData]
    : [];

  const { data: models = [] } = useQuery({
    queryKey: ["global-intelligence", "models"],
    queryFn: () => globalIntelligenceService.getModelProfiles(),
  });

  const { data: trends } = useQuery({
    queryKey: ["global-intelligence", "trends"],
    queryFn: () => globalIntelligenceService.getGlobalTrends(),
  });

  const { data: archiveStats } = useQuery({
    queryKey: ["global-intelligence", "archive"],
    queryFn: () => globalIntelligenceService.getArchiveStats(),
  });

  const handleRefreshAll = async () => {
    toast.info("Refreshing global network telemetry...");
    await Promise.all([
      refetchWarehouse(),
      refetchNetwork(),
      queryClient.invalidateQueries({ queryKey: ["global-intelligence"] }),
    ]);
    toast.success("Global intelligence mesh data synchronized");
  };

  const handleSearchWarehouse = async (query: string) => {
    try {
      const res = await globalIntelligenceService.searchGlobalWarehouse(query);
      toast.success(`Warehouse search query matched records`);
      return res;
    } catch {
      toast.error("Failed to query public AI warehouse");
      return [];
    }
  };

  const isLoading = isWarehouseLoading || isNetworkLoading || isTelemetryLoading;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Top Banner / Hero Overview */}
      <GlobalIntelligenceOverviewCard
        warehouseStats={warehouseStats}
        networkStats={networkStats}
        isLoading={isLoading}
        onRefreshClick={handleRefreshAll}
        onExploreArchiveClick={() => setIsArchiveModalOpen(true)}
        onInspectKnowledgeClick={() => setActiveTab("knowledge")}
      />

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="network" className="text-xs gap-1.5">
              <Globe2 className="h-3.5 w-3.5" />
              Edge Telemetry
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="text-xs gap-1.5">
              <Network className="h-3.5 w-3.5" />
              Knowledge Graph
            </TabsTrigger>
            <TabsTrigger value="citations" className="text-xs gap-1.5">
              <Quote className="h-3.5 w-3.5" />
              Citations Matrix
            </TabsTrigger>
            <TabsTrigger value="models" className="text-xs gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              Model Intelligence
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono text-emerald-500 border-emerald-500/20">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Tamper-Proof Ledger Active
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsArchiveModalOpen(true)}
              className="h-8 gap-1.5 text-xs"
            >
              <Search className="h-3.5 w-3.5" />
              Search Archive
            </Button>
          </div>
        </div>

        {/* Tab 1: Edge Telemetry */}
        <TabsContent value="network" className="space-y-4 m-0">
          <MultiRegionLatencyMapCard telemetry={telemetry} isLoading={isTelemetryLoading} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlobalModelIntelligenceCard models={models} />
            <GlobalCitationsMatrixCard
              citations={citations}
              domains={domains}
              trends={trends}
              isLoading={isCitationsLoading}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Knowledge Graph */}
        <TabsContent value="knowledge" className="space-y-4 m-0">
          <GlobalKnowledgeGraphCard
            graphData={graphData}
            topics={topics}
            isLoading={isGraphLoading}
          />
        </TabsContent>

        {/* Tab 3: Citations Matrix */}
        <TabsContent value="citations" className="space-y-4 m-0">
          <GlobalCitationsMatrixCard
            citations={citations}
            domains={domains}
            trends={trends}
            isLoading={isCitationsLoading}
          />
        </TabsContent>

        {/* Tab 4: Model Intelligence */}
        <TabsContent value="models" className="space-y-4 m-0">
          <GlobalModelIntelligenceCard models={models} />
        </TabsContent>
      </Tabs>

      {/* Public Response Warehouse Explorer Modal */}
      <GlobalArchiveExplorerModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        archiveStats={archiveStats}
        onSearchWarehouse={handleSearchWarehouse}
      />
    </div>
  );
}

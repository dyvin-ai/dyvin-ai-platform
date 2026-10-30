import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  KnowledgeGraphOverviewCard,
  KnowledgeGraphExplorer,
  EntityProvenanceTable,
  SemanticFactsList,
  ProductsServicesGrid,
} from "@/components/knowledge";
import { knowledgeGraphService, scanService } from "@/services";
import {
  Network,
  RefreshCw,
  Sparkles,
  Building,
  FileCheck2,
  Package,
  Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_shell/knowledge")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Knowledge Graph & Semantic Provenance Platform" },
      {
        name: "description",
        content:
          "Enterprise Knowledge Graph entity extraction, directed relationship graph, semantic fact verification, and provenance source attribution.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Knowledge Graph & Semantic Provenance Platform",
      },
      {
        property: "og:description",
        content:
          "Enterprise Knowledge Graph entity extraction, directed relationship graph, semantic fact verification, and provenance source attribution.",
      },
    ],
  }),
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const queryClient = useQueryClient();
  const { activeProject } = useWorkspace();
  const projectId = activeProject?.id || "project-default";

  const [activeTab, setActiveTab] = useState("graph");
  const [isTriggeringScan, setIsTriggeringScan] = useState(false);

  // 1. Knowledge Graph Overview Summary
  const {
    data: summary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
    isFetching: isFetchingSummary,
  } = useQuery({
    queryKey: ["knowledge-graph-summary", projectId],
    queryFn: () => knowledgeGraphService.getKnowledgeGraph(projectId),
    staleTime: 30_000,
  });

  // 2. Canonical Extracted Entities
  const {
    data: entities = [],
    isLoading: isLoadingEntities,
    refetch: refetchEntities,
    isFetching: isFetchingEntities,
  } = useQuery({
    queryKey: ["knowledge-entities", projectId],
    queryFn: () => knowledgeGraphService.getEntities(projectId),
    staleTime: 30_000,
  });

  // 3. Graph Relationships
  const {
    data: relationships = [],
    isLoading: isLoadingRelationships,
    refetch: refetchRelationships,
  } = useQuery({
    queryKey: ["knowledge-relationships", projectId],
    queryFn: () => knowledgeGraphService.getRelationships(projectId),
    staleTime: 30_000,
  });

  // 4. Extracted Semantic Facts
  const {
    data: facts = [],
    isLoading: isLoadingFacts,
    refetch: refetchFacts,
  } = useQuery({
    queryKey: ["knowledge-facts", projectId],
    queryFn: () => knowledgeGraphService.getFacts(projectId),
    staleTime: 30_000,
  });

  // 5. Discovered Products
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["knowledge-products", projectId],
    queryFn: () => knowledgeGraphService.getProducts(projectId),
    staleTime: 30_000,
  });

  // 6. Extracted Services
  const {
    data: services = [],
    isLoading: isLoadingServices,
    refetch: refetchServices,
  } = useQuery({
    queryKey: ["knowledge-services", projectId],
    queryFn: () => knowledgeGraphService.getServices(projectId),
    staleTime: 30_000,
  });

  const isRefreshing =
    isFetchingSummary || isFetchingEntities;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchSummary(),
        refetchEntities(),
        refetchRelationships(),
        refetchFacts(),
        refetchProducts(),
        refetchServices(),
      ]);
      toast.success("Knowledge Graph synchronized with latest intelligence telemetry.");
    } catch {
      toast.error("Failed to refresh Knowledge Graph data.");
    }
  };

  const handleTriggerIntelligenceScan = async () => {
    setIsTriggeringScan(true);
    try {
      if (scanService?.triggerScan) {
        await scanService.triggerScan(projectId);
      }
      toast.success("Website intelligence scan queued. New entities will be extracted into the graph.");
      await handleRefreshAll();
    } catch {
      toast.error("Unable to trigger website intelligence scan.");
    } finally {
      setIsTriggeringScan(false);
    }
  };

  const hasGraphData = Boolean(summary || entities.length > 0);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Knowledge Graph & Semantic Provenance
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs font-mono"
                >
                  PHASE F18
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Canonical business entity extraction, directed relationship graph, and citation-backed provenance statements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-9 gap-1.5 border-border/60 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            {isRefreshing ? "Syncing..." : "Refresh Graph"}
          </Button>

          <Button
            size="sm"
            onClick={handleTriggerIntelligenceScan}
            disabled={isTriggeringScan}
            className="h-9 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isTriggeringScan ? "Queuing Scan..." : "Scan Website Intelligence"}
          </Button>
        </div>
      </div>

      {/* KPI & Metadata Banner */}
      <KnowledgeGraphOverviewCard
        summary={summary}
        isLoading={isLoadingSummary}
      />

      {/* Empty State when no graph has been generated yet */}
      {!isLoadingSummary && !hasGraphData && (
        <Card className="border border-dashed border-border/80 bg-surface/30 p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Network className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <CardTitle className="text-base font-semibold text-foreground">
              No Knowledge Graph Generated Yet
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Run a website scan on this project to extract canonical entities, directed relations, and provenance facts.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={handleTriggerIntelligenceScan}
            disabled={isTriggeringScan}
            className="text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Run Website Intelligence Scan
          </Button>
        </Card>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-elevated/60 border border-border/60 p-1 rounded-lg h-auto flex flex-wrap gap-1">
          <TabsTrigger
            value="graph"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Network className="h-3.5 w-3.5" />
            Topology Explorer
          </TabsTrigger>
          <TabsTrigger
            value="entities"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building className="h-3.5 w-3.5" />
            Canonical Entities ({entities.length})
          </TabsTrigger>
          <TabsTrigger
            value="facts"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            Semantic Facts ({facts.length})
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="gap-2 text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Package className="h-3.5 w-3.5" />
            Products & Services ({products.length + services.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Graph Explorer */}
        <TabsContent value="graph" className="mt-0 space-y-4">
          <KnowledgeGraphExplorer
            entities={entities}
            relationships={relationships}
            facts={facts}
            isLoading={isLoadingEntities || isLoadingRelationships}
          />
        </TabsContent>

        {/* Tab 2: Canonical Entities Table */}
        <TabsContent value="entities" className="mt-0">
          <EntityProvenanceTable
            entities={entities}
            isLoading={isLoadingEntities}
          />
        </TabsContent>

        {/* Tab 3: Semantic Facts List */}
        <TabsContent value="facts" className="mt-0">
          <SemanticFactsList
            facts={facts}
            isLoading={isLoadingFacts}
          />
        </TabsContent>

        {/* Tab 4: Products & Services */}
        <TabsContent value="catalog" className="mt-0">
          <ProductsServicesGrid
            products={products}
            services={services}
            isLoading={isLoadingProducts || isLoadingServices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AppPlatformDashboardOverviewCard,
  CustomAppDirectoryCard,
  MarketplaceExplorerCard,
  ExtensionPluginsRegistryCard,
  DeveloperSDKConsoleCard,
  CreateAppModal,
  PublishListingModal,
  PublishWorkflowModal,
} from "@/components/apps";
import { appPlatformService } from "@/services";
import {
  AppWindow,
  ShoppingBag,
  Puzzle,
  Code2,
  RefreshCw,
  Plus,
  Workflow,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CreateAppInput, PublishListingInput, PublishWorkflowInput } from "@/types";

export const Route = createFileRoute("/_shell/apps")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise AI App Platform & Marketplace" },
      {
        name: "description",
        content:
          "Enterprise AI App Platform & Extensibility: Sovereign low-code AI micro-applications, verified marketplace integrations, modular extension sandboxes, and developer client SDKs.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise AI App Platform & Marketplace",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI App Platform & Extensibility: Sovereign low-code AI micro-applications, verified marketplace integrations, modular extension sandboxes, and developer client SDKs.",
      },
    ],
  }),
  component: AppPlatformPage,
});

function AppPlatformPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);
  const [isPublishListingOpen, setIsPublishListingOpen] = useState(false);
  const [isPublishWorkflowOpen, setIsPublishWorkflowOpen] = useState(false);

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["apps-dashboard"],
    queryFn: () => appPlatformService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Custom Apps
  const {
    data: apps = [],
    isLoading: isLoadingApps,
    refetch: refetchApps,
  } = useQuery({
    queryKey: ["apps-list"],
    queryFn: () => appPlatformService.getApps(),
    staleTime: 30_000,
  });

  // 3. Marketplace Listings
  const {
    data: marketplaceListings = [],
    isLoading: isLoadingMarketplace,
    refetch: refetchMarketplace,
  } = useQuery({
    queryKey: ["apps-marketplace"],
    queryFn: () => appPlatformService.getMarketplace(),
    staleTime: 30_000,
  });

  // 4. Extensions & Plugins
  const {
    data: extensions = [],
    isLoading: isLoadingExtensions,
    refetch: refetchExtensions,
  } = useQuery({
    queryKey: ["apps-extensions"],
    queryFn: () => appPlatformService.getExtensions(),
    staleTime: 30_000,
  });

  // 5. SDK Artifacts
  const {
    data: sdks = [],
    isLoading: isLoadingSdks,
    refetch: refetchSdks,
  } = useQuery({
    queryKey: ["apps-sdks"],
    queryFn: () => appPlatformService.getSDKs(),
    staleTime: 30_000,
  });

  // 6. Registered Developers
  const {
    data: developers = [],
    isLoading: isLoadingDevelopers,
    refetch: refetchDevelopers,
  } = useQuery({
    queryKey: ["apps-developers"],
    queryFn: () => appPlatformService.getDevelopers(),
    staleTime: 30_000,
  });

  // 7. Workflow Templates
  const {
    data: templates = [],
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
  } = useQuery({
    queryKey: ["apps-templates"],
    queryFn: () => appPlatformService.getTemplates(),
    staleTime: 30_000,
  });

  // 8. Workflows
  const {
    data: workflows = [],
    isLoading: isLoadingWorkflows,
    refetch: refetchWorkflows,
  } = useQuery({
    queryKey: ["apps-workflows"],
    queryFn: () => appPlatformService.getWorkflows(),
    staleTime: 30_000,
  });

  // 9. Statistics
  const {
    data: statistics,
    isLoading: isLoadingStatistics,
    refetch: refetchStatistics,
  } = useQuery({
    queryKey: ["apps-statistics"],
    queryFn: () => appPlatformService.getStatistics(),
    staleTime: 30_000,
  });

  const handleRefreshAll = () => {
    refetchOverview();
    refetchApps();
    refetchMarketplace();
    refetchExtensions();
    refetchSdks();
    refetchDevelopers();
    refetchTemplates();
    refetchWorkflows();
    refetchStatistics();
    toast.success("Platform telemetry refreshed");
  };

  const handleCreateApp = async (input: CreateAppInput) => {
    try {
      const created = await appPlatformService.createApp(input);
      toast.success(`Application "${created.appName}" registered successfully`);
      queryClient.invalidateQueries({ queryKey: ["apps-list"] });
      queryClient.invalidateQueries({ queryKey: ["apps-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["apps-statistics"] });
    } catch {
      toast.error("Failed to register application");
    }
  };

  const handlePublishListing = async (input: PublishListingInput) => {
    try {
      const published = await appPlatformService.publishListing(input);
      toast.success(`Marketplace listing "${published.title}" published`);
      queryClient.invalidateQueries({ queryKey: ["apps-marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["apps-dashboard"] });
    } catch {
      toast.error("Failed to publish listing");
    }
  };

  const handlePublishWorkflow = async (input: PublishWorkflowInput) => {
    try {
      const published = await appPlatformService.publishWorkflow(input);
      toast.success(`Workflow "${published.workflowName}" published to platform`);
      queryClient.invalidateQueries({ queryKey: ["apps-workflows"] });
      queryClient.invalidateQueries({ queryKey: ["apps-dashboard"] });
    } catch {
      toast.error("Failed to publish workflow");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <AppWindow className="w-6 h-6 text-indigo-400" />
              App Platform & Extensibility
            </h1>
            <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 text-xs">
              Phase F29
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Build, publish, and orchestrate custom AI micro-apps, extensions, and marketplace integrations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="text-xs gap-1.5 border-border/70 hover:bg-accent/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateAppOpen(true)}
            className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create App</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/70 border border-border/60 p-1 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <AppWindow className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="apps" className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Layers className="w-3.5 h-3.5" />
            <span>Custom Apps ({apps.length})</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace ({marketplaceListings.length})</span>
          </TabsTrigger>
          <TabsTrigger value="extensions" className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Puzzle className="w-3.5 h-3.5" />
            <span>Extensions ({extensions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="developers" className="text-xs gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer & SDKs ({sdks.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <AppPlatformDashboardOverviewCard
            overview={overview}
            statistics={statistics}
            isLoading={isLoadingOverview}
            onCreateAppClick={() => setIsCreateAppOpen(true)}
            onPublishListingClick={() => setIsPublishListingOpen(true)}
            onPublishWorkflowClick={() => setIsPublishWorkflowOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomAppDirectoryCard
              apps={apps.slice(0, 4)}
              isLoading={isLoadingApps}
              onCreateAppClick={() => setIsCreateAppOpen(true)}
            />
            <MarketplaceExplorerCard
              listings={marketplaceListings.slice(0, 4)}
              isLoading={isLoadingMarketplace}
              onPublishListingClick={() => setIsPublishListingOpen(true)}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Custom Apps */}
        <TabsContent value="apps" className="space-y-6">
          <CustomAppDirectoryCard
            apps={apps}
            isLoading={isLoadingApps}
            onCreateAppClick={() => setIsCreateAppOpen(true)}
          />
        </TabsContent>

        {/* Tab 3: Marketplace */}
        <TabsContent value="marketplace" className="space-y-6">
          <MarketplaceExplorerCard
            listings={marketplaceListings}
            isLoading={isLoadingMarketplace}
            onPublishListingClick={() => setIsPublishListingOpen(true)}
          />
        </TabsContent>

        {/* Tab 4: Extensions */}
        <TabsContent value="extensions" className="space-y-6">
          <ExtensionPluginsRegistryCard
            extensions={extensions}
            isLoading={isLoadingExtensions}
          />
        </TabsContent>

        {/* Tab 5: Developer & SDKs */}
        <TabsContent value="developers" className="space-y-6">
          <DeveloperSDKConsoleCard
            sdks={sdks}
            developers={developers}
            templates={templates}
            isLoading={isLoadingSdks || isLoadingDevelopers || isLoadingTemplates}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateAppModal
        isOpen={isCreateAppOpen}
        onClose={() => setIsCreateAppOpen(false)}
        onSubmit={handleCreateApp}
      />
      <PublishListingModal
        isOpen={isPublishListingOpen}
        onClose={() => setIsPublishListingOpen(false)}
        onSubmit={handlePublishListing}
      />
      <PublishWorkflowModal
        isOpen={isPublishWorkflowOpen}
        onClose={() => setIsPublishWorkflowOpen(false)}
        onSubmit={handlePublishWorkflow}
      />
    </div>
  );
}

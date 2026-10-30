import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IntegrationHubOverviewCard,
  ConnectedIntegrationsListCard,
  ProvidersCatalogGridCard,
  WebhookEventConsoleCard,
  ConnectProviderModal,
  PublishContentModal,
} from "@/components/integrations";
import { integrationHubService } from "@/services";
import {
  Cable,
  Globe,
  Radio,
  RefreshCw,
  Plus,
  Send,
  Workflow,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  ConnectProviderInput,
  PublishCMSContentInput,
  ProcessWebhookInput,
  IntegrationProviderItem,
} from "@/types";

export const Route = createFileRoute("/_shell/integrations")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Integration Hub & Webhooks" },
      {
        name: "description",
        content:
          "Enterprise Integration Hub & Real-Time Webhooks: Connect external SaaS platforms, configure CMS auto-publishing, monitor bidirectional CRM sync, and inspect live webhook events.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Integration Hub & Webhooks",
      },
      {
        property: "og:description",
        content:
          "Enterprise Integration Hub & Real-Time Webhooks: Connect external SaaS platforms, configure CMS auto-publishing, monitor bidirectional CRM sync, and inspect live webhook events.",
      },
    ],
  }),
  component: IntegrationHubPage,
});

function IntegrationHubPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProviderItem | null>(null);

  // 1. Hub Status
  const {
    data: status,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
    isFetching: isFetchingStatus,
  } = useQuery({
    queryKey: ["integrations-status"],
    queryFn: () => integrationHubService.getStatus(),
    staleTime: 30_000,
  });

  // 2. Connected Integrations
  const {
    data: integrations = [],
    isLoading: isLoadingIntegrations,
    refetch: refetchIntegrations,
  } = useQuery({
    queryKey: ["integrations-list"],
    queryFn: () => integrationHubService.getIntegrations(),
    staleTime: 30_000,
  });

  // 3. Providers Catalog
  const {
    data: providers = [],
    isLoading: isLoadingProviders,
    refetch: refetchProviders,
  } = useQuery({
    queryKey: ["integrations-providers"],
    queryFn: () => integrationHubService.getProviders(),
    staleTime: 30_000,
  });

  // 4. Metrics
  const {
    data: metrics = [],
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ["integrations-metrics"],
    queryFn: () => integrationHubService.getMetrics(),
    staleTime: 30_000,
  });

  // 5. History / Webhook logs
  const {
    data: history = [],
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["integrations-history"],
    queryFn: () => integrationHubService.getHistory(),
    staleTime: 30_000,
  });

  const handleRefreshAll = () => {
    refetchStatus();
    refetchIntegrations();
    refetchProviders();
    refetchMetrics();
    refetchHistory();
    toast.success("Integration Hub telemetry refreshed");
  };

  const handleConnectProvider = async (input: ConnectProviderInput) => {
    try {
      const res = await integrationHubService.connectProvider(input);
      toast.success(`Integration "${res.integration.name}" connected successfully`);
      queryClient.invalidateQueries({ queryKey: ["integrations-list"] });
      queryClient.invalidateQueries({ queryKey: ["integrations-status"] });
    } catch {
      toast.error("Failed to connect external integration");
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await integrationHubService.disconnectProvider(integrationId);
      toast.success("Integration disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["integrations-list"] });
      queryClient.invalidateQueries({ queryKey: ["integrations-status"] });
    } catch {
      toast.error("Failed to disconnect integration");
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      await integrationHubService.syncIntegration({ integrationId, direction: "BIDIRECTIONAL" });
      toast.success("Synchronization job dispatched to Redis queue");
      queryClient.invalidateQueries({ queryKey: ["integrations-list"] });
      queryClient.invalidateQueries({ queryKey: ["integrations-status"] });
    } catch {
      toast.error("Failed to trigger synchronization job");
    }
  };

  const handlePublishCMS = async (input: PublishCMSContentInput) => {
    try {
      const res = await integrationHubService.publishCMSContent(input);
      toast.success(`Published to ${input.platform}: "${input.title}"`);
      if (res.url) {
        toast.info(`Target URL: ${res.url}`);
      }
    } catch {
      toast.error("Failed to publish content to CMS");
    }
  };

  const handleDispatchTestWebhook = async (input: ProcessWebhookInput) => {
    try {
      await integrationHubService.processWebhook(input);
      toast.success(`Webhook event "${input.eventType}" dispatched & processed`);
      queryClient.invalidateQueries({ queryKey: ["integrations-history"] });
    } catch {
      toast.error("Failed to process webhook event");
    }
  };

  const handleOpenConnectForProvider = (provider: IntegrationProviderItem) => {
    setSelectedProvider(provider);
    setIsConnectModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Cable className="w-6 h-6 text-sky-400" />
              Integration Hub & Webhooks
            </h1>
            <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-500/10 text-xs">
              Phase F30
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Connect external CMS engines, synchronize CRM records, and orchestrate signed webhook streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingStatus}
            className="text-xs gap-1.5 border-border/70 hover:bg-accent/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingStatus ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedProvider(null);
              setIsConnectModalOpen(true);
            }}
            className="text-xs gap-1.5 bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Provider</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card/70 border border-border/60 p-1 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="text-xs gap-1.5 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            <Cable className="w-3.5 h-3.5" />
            <span>Overview & Mesh KPIs</span>
          </TabsTrigger>
          <TabsTrigger value="connected" className="text-xs gap-1.5 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            <Layers className="w-3.5 h-3.5" />
            <span>Connected Integrations ({integrations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="catalog" className="text-xs gap-1.5 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            <Globe className="w-3.5 h-3.5" />
            <span>Adapters Catalog ({providers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="text-xs gap-1.5 data-[state=active]:bg-sky-600 data-[state=active]:text-white">
            <Radio className="w-3.5 h-3.5" />
            <span>Webhooks & Event Stream</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <IntegrationHubOverviewCard
            status={status}
            metrics={metrics}
            isLoading={isLoadingStatus}
            onConnectClick={() => {
              setSelectedProvider(null);
              setIsConnectModalOpen(true);
            }}
            onPublishClick={() => setIsPublishModalOpen(true)}
            onSyncAllClick={handleRefreshAll}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConnectedIntegrationsListCard
              integrations={integrations.slice(0, 3)}
              isLoading={isLoadingIntegrations}
              onConnectClick={() => {
                setSelectedProvider(null);
                setIsConnectModalOpen(true);
              }}
              onSyncClick={handleSync}
              onDisconnectClick={handleDisconnect}
            />
            <WebhookEventConsoleCard
              events={history.map((h) => ({
                id: h.id,
                eventType: h.action || "integration.event.dispatched",
                payloadJson: h.details || { action: h.action, status: h.status },
                deliveredAt: h.createdAt,
              }))}
              isLoading={isLoadingHistory}
              onDispatchTestWebhook={handleDispatchTestWebhook}
              defaultIntegrationId={integrations[0]?.id || "int-1"}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Connected Integrations */}
        <TabsContent value="connected" className="space-y-6">
          <ConnectedIntegrationsListCard
            integrations={integrations}
            isLoading={isLoadingIntegrations}
            onConnectClick={() => {
              setSelectedProvider(null);
              setIsConnectModalOpen(true);
            }}
            onSyncClick={handleSync}
            onDisconnectClick={handleDisconnect}
          />
        </TabsContent>

        {/* Tab 3: Catalog */}
        <TabsContent value="catalog" className="space-y-6">
          <ProvidersCatalogGridCard
            providers={providers}
            activeIntegrations={integrations}
            isLoading={isLoadingProviders}
            onSelectProvider={handleOpenConnectForProvider}
          />
        </TabsContent>

        {/* Tab 4: Webhooks */}
        <TabsContent value="webhooks" className="space-y-6">
          <WebhookEventConsoleCard
            events={history.map((h) => ({
              id: h.id,
              eventType: h.action || "integration.event.dispatched",
              payloadJson: h.details || { action: h.action, status: h.status },
              deliveredAt: h.createdAt,
            }))}
            isLoading={isLoadingHistory}
            onDispatchTestWebhook={handleDispatchTestWebhook}
            defaultIntegrationId={integrations[0]?.id || "int-1"}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ConnectProviderModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSubmit={handleConnectProvider}
        selectedProvider={selectedProvider}
        providers={providers}
      />
      <PublishContentModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={handlePublishCMS}
      />
    </div>
  );
}

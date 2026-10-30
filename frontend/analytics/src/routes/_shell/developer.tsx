import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DeveloperOverviewCard,
  DeveloperApplicationsListCard,
  APIKeyManagerCard,
  WebhookSubscriptionConsoleCard,
  ApiRequestLogsViewerCard,
  CreateAppModal,
  GenerateKeyModal,
  CreateWebhookModal,
} from "@/components/developer";
import { developerPlatformService } from "@/services";
import {
  Code2,
  Key,
  Webhook,
  Activity,
  Layers,
  RefreshCw,
  Plus,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type {
  CreateDeveloperAppInput,
  CreateDeveloperWebhookInput,
  CreateAPIKeyResult,
  DeveloperAppItem,
} from "@/types";

export const Route = createFileRoute("/_shell/developer")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Developer Platform & Public API Gateway" },
      {
        name: "description",
        content:
          "Enterprise Developer Platform & Public API Gateway: Issue SHA-256 hashed API keys, configure OAuth2 tokens, manage event webhooks, and inspect real-time request telemetry.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Developer Platform & Public API Gateway",
      },
      {
        property: "og:description",
        content:
          "Enterprise Developer Platform & Public API Gateway: Issue SHA-256 hashed API keys, configure OAuth2 tokens, manage event webhooks, and inspect real-time request telemetry.",
      },
    ],
  }),
  component: DeveloperPlatformPage,
});

function DeveloperPlatformPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateAppOpen, setIsCreateAppOpen] = useState(false);
  const [isGenerateKeyOpen, setIsGenerateKeyOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>(undefined);

  // 1. Overview Telemetry
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["developer-overview"],
    queryFn: () => developerPlatformService.getOverview(),
    staleTime: 30_000,
  });

  // 2. Developer Applications
  const {
    data: applications = [],
    isLoading: isLoadingApps,
    refetch: refetchApps,
  } = useQuery({
    queryKey: ["developer-apps"],
    queryFn: () => developerPlatformService.getApps(),
    staleTime: 30_000,
  });

  // Set default selected app if none selected
  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0];
  const effectiveAppId = selectedAppId || activeApp?.id;

  // 3. API Keys
  const {
    data: apiKeys = [],
    isLoading: isLoadingKeys,
    refetch: refetchKeys,
  } = useQuery({
    queryKey: ["developer-keys", effectiveAppId],
    queryFn: () => developerPlatformService.getAPIKeys(effectiveAppId),
    staleTime: 30_000,
  });

  // 4. Webhooks
  const {
    data: webhooks = [],
    isLoading: isLoadingWebhooks,
    refetch: refetchWebhooks,
  } = useQuery({
    queryKey: ["developer-webhooks", effectiveAppId],
    queryFn: () => developerPlatformService.getWebhooks(effectiveAppId),
    staleTime: 30_000,
  });

  // 5. Logs
  const {
    data: logs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["developer-logs", effectiveAppId],
    queryFn: () => developerPlatformService.getLogs(effectiveAppId),
    staleTime: 30_000,
  });

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchOverview(),
      refetchApps(),
      refetchKeys(),
      refetchWebhooks(),
      refetchLogs(),
    ]);
    toast.success("Developer platform telemetry refreshed");
  };

  const handleCreateApp = async (input: CreateDeveloperAppInput) => {
    try {
      const newApp = await developerPlatformService.createApp(input);
      toast.success(`Application "${newApp.name}" created successfully`);
      await refetchApps();
      await refetchOverview();
      setSelectedAppId(newApp.id);
    } catch (err: any) {
      toast.error(err?.message || "Failed to create application");
      throw err;
    }
  };

  const handleGenerateKey = async (appId: string, expiresInDays?: number): Promise<CreateAPIKeyResult> => {
    try {
      const res = await developerPlatformService.createAPIKey({
        applicationId: appId,
        prefix: "dyv_live",
        expiresInDays,
      });
      toast.success("API key generated successfully");
      await refetchKeys();
      await refetchOverview();
      return res;
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate API key");
      throw err;
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      // Optimistic update
      queryClient.setQueryData<any[]>(["developer-keys", effectiveAppId], (old = []) =>
        old.map((k) => (k.id === keyId ? { ...k, status: "REVOKED" } : k))
      );
      toast.success("API key revoked");
      await refetchKeys();
      await refetchOverview();
    } catch (err: any) {
      toast.error(err?.message || "Failed to revoke API key");
    }
  };

  const handleCreateWebhook = async (input: CreateDeveloperWebhookInput) => {
    try {
      await developerPlatformService.createWebhook(input);
      toast.success("Webhook endpoint registered successfully");
      await refetchWebhooks();
    } catch (err: any) {
      toast.error(err?.message || "Failed to register webhook");
      throw err;
    }
  };

  const handleTestWebhook = (hook: any) => {
    toast.info(`Test payload dispatched to ${hook.targetUrl}`);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
              Developer Platform
            </h1>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
              v1 Gateway
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Programmatic access tokens, OAuth2 authorization, event delivery webhooks, and public API gateway telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="gap-1.5 h-8 text-xs border-border"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateAppOpen(true)}
            className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New App</span>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface border border-border p-1">
          <TabsTrigger value="overview" className="gap-2 text-xs">
            <Activity className="w-4 h-4" />
            <span>Overview & Mesh</span>
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-2 text-xs">
            <Layers className="w-4 h-4" />
            <span>Applications ({applications.length})</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="gap-2 text-xs">
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2 text-xs">
            <Webhook className="w-4 h-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2 text-xs">
            <Terminal className="w-4 h-4" />
            <span>Request Logs</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          <DeveloperOverviewCard
            overview={overview}
            isLoading={isLoadingOverview}
            onCreateAppClick={() => setIsCreateAppOpen(true)}
            onGenerateKeyClick={() => setIsGenerateKeyOpen(true)}
            onCreateWebhookClick={() => setIsCreateWebhookOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeveloperApplicationsListCard
              applications={applications}
              isLoading={isLoadingApps}
              selectedAppId={effectiveAppId}
              onSelectApp={setSelectedAppId}
              onCreateAppClick={() => setIsCreateAppOpen(true)}
              onGenerateKeyClick={(appId) => {
                setSelectedAppId(appId);
                setIsGenerateKeyOpen(true);
              }}
            />

            <APIKeyManagerCard
              apiKeys={apiKeys}
              selectedAppName={activeApp?.name}
              isLoading={isLoadingKeys}
              onGenerateKeyClick={() => setIsGenerateKeyOpen(true)}
              onRevokeKeyClick={handleRevokeKey}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WebhookSubscriptionConsoleCard
              webhooks={webhooks}
              selectedAppName={activeApp?.name}
              isLoading={isLoadingWebhooks}
              onCreateWebhookClick={() => setIsCreateWebhookOpen(true)}
              onTestWebhookClick={handleTestWebhook}
            />

            <ApiRequestLogsViewerCard
              logs={logs}
              isLoading={isLoadingLogs}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Applications */}
        <TabsContent value="apps" className="space-y-6 focus-visible:outline-none">
          <DeveloperApplicationsListCard
            applications={applications}
            isLoading={isLoadingApps}
            selectedAppId={effectiveAppId}
            onSelectApp={setSelectedAppId}
            onCreateAppClick={() => setIsCreateAppOpen(true)}
            onGenerateKeyClick={(appId) => {
              setSelectedAppId(appId);
              setIsGenerateKeyOpen(true);
            }}
          />
        </TabsContent>

        {/* Tab 3: API Keys */}
        <TabsContent value="keys" className="space-y-6 focus-visible:outline-none">
          <APIKeyManagerCard
            apiKeys={apiKeys}
            selectedAppName={activeApp?.name}
            isLoading={isLoadingKeys}
            onGenerateKeyClick={() => setIsGenerateKeyOpen(true)}
            onRevokeKeyClick={handleRevokeKey}
          />
        </TabsContent>

        {/* Tab 4: Webhooks */}
        <TabsContent value="webhooks" className="space-y-6 focus-visible:outline-none">
          <WebhookSubscriptionConsoleCard
            webhooks={webhooks}
            selectedAppName={activeApp?.name}
            isLoading={isLoadingWebhooks}
            onCreateWebhookClick={() => setIsCreateWebhookOpen(true)}
            onTestWebhookClick={handleTestWebhook}
          />
        </TabsContent>

        {/* Tab 5: Request Logs */}
        <TabsContent value="logs" className="space-y-6 focus-visible:outline-none">
          <ApiRequestLogsViewerCard
            logs={logs}
            isLoading={isLoadingLogs}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateAppModal
        isOpen={isCreateAppOpen}
        onClose={() => setIsCreateAppOpen(false)}
        onSubmit={handleCreateApp}
        organizationId="f5bb0153-e41a-49ee-97dc-e03dc6228403"
      />

      <GenerateKeyModal
        isOpen={isGenerateKeyOpen}
        onClose={() => setIsGenerateKeyOpen(false)}
        applications={applications}
        selectedAppId={effectiveAppId}
        onGenerate={handleGenerateKey}
      />

      <CreateWebhookModal
        isOpen={isCreateWebhookOpen}
        onClose={() => setIsCreateWebhookOpen(false)}
        applications={applications}
        selectedAppId={effectiveAppId}
        onSubmit={handleCreateWebhook}
      />
    </div>
  );
}

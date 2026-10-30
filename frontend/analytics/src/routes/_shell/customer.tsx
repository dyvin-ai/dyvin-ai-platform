import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  CustomerOverviewDashboardCard,
  CustomerJourneyTimelinePanel,
  CustomerMemoryVaultTable,
  CustomerWarehouseBrowser,
  CustomerPrivacyAuditConsole,
} from "@/components/customer";
import { customerIntelligenceService } from "@/services";
import {
  UserCheck,
  RefreshCw,
  Milestone,
  Brain,
  Database,
  ShieldCheck,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/customer")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Customer Intelligence Layer" },
      {
        name: "description",
        content:
          "Enterprise Customer Intelligence Layer: Multi-tier Tenant Memory Vault, Append-only Customer Data Warehouse, Customer Journey Milestones, and Zero-Leakage Privacy Auditing.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Customer Intelligence Layer",
      },
      {
        property: "og:description",
        content:
          "Enterprise Customer Intelligence Layer: Multi-tier Tenant Memory Vault, Append-only Customer Data Warehouse, Customer Journey Milestones, and Zero-Leakage Privacy Auditing.",
      },
    ],
  }),
  component: CustomerIntelligencePage,
});

function CustomerIntelligencePage() {
  const queryClient = useQueryClient();
  const { activeOrganization } = useWorkspace();
  const orgId = activeOrganization?.id || "org-default";

  const [activeTab, setActiveTab] = useState("overview");

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["customer-intelligence-overview", orgId],
    queryFn: () => customerIntelligenceService.getDashboard(orgId),
    staleTime: 30_000,
  });

  // 2. Journey Timeline
  const {
    data: timeline = [],
    isLoading: isLoadingTimeline,
    refetch: refetchTimeline,
  } = useQuery({
    queryKey: ["customer-intelligence-timeline", orgId],
    queryFn: () => customerIntelligenceService.getTimeline(orgId),
    staleTime: 30_000,
  });

  // 3. Memory Vault
  const {
    data: memories = [],
    isLoading: isLoadingMemories,
    refetch: refetchMemories,
  } = useQuery({
    queryKey: ["customer-intelligence-memory", orgId],
    queryFn: () => customerIntelligenceService.getMemory(orgId),
    staleTime: 30_000,
  });

  // 4. History
  const {
    data: history,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["customer-intelligence-history", orgId],
    queryFn: () => customerIntelligenceService.getHistory(orgId),
    staleTime: 30_000,
  });

  // 5. Goals Telemetry
  const {
    data: goals,
    isLoading: isLoadingGoals,
    refetch: refetchGoals,
  } = useQuery({
    queryKey: ["customer-intelligence-goals", orgId],
    queryFn: () => customerIntelligenceService.getGoals(orgId),
    staleTime: 30_000,
  });

  // 6. Warehouse Assets
  const {
    data: warehouseItems = [],
    isLoading: isLoadingWarehouse,
    refetch: refetchWarehouse,
  } = useQuery({
    queryKey: ["customer-intelligence-warehouse", orgId],
    queryFn: () => customerIntelligenceService.getWarehouse(orgId),
    staleTime: 30_000,
  });

  // 7. Privacy Audit
  const {
    data: privacy,
    isLoading: isLoadingPrivacy,
    refetch: refetchPrivacy,
  } = useQuery({
    queryKey: ["customer-intelligence-privacy", orgId],
    queryFn: () => customerIntelligenceService.verifyPrivacy(orgId),
    staleTime: 30_000,
  });

  const handleVerifyPrivacy = async () => {
    try {
      const res = await customerIntelligenceService.verifyPrivacy(orgId);
      await refetchPrivacy();
      toast.success("Privacy Verification Passed", {
        description: `Verified zero cross-tenant leakage for organization "${res.organizationId}".`,
      });
    } catch (err: any) {
      toast.error("Privacy Audit Failed", {
        description: err?.message || "Failed to verify tenant privacy isolation.",
      });
    }
  };

  const handleRefreshAll = () => {
    refetchOverview();
    refetchTimeline();
    refetchMemories();
    refetchHistory();
    refetchGoals();
    refetchWarehouse();
    refetchPrivacy();
    toast.info("Customer Intelligence Telemetry Refreshed", {
      description: `Synchronized telemetry for organization ${orgId}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Customer Intelligence Layer
                </h1>
                <Badge
                  variant="outline"
                  className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold"
                >
                  PHASE F22
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Multi-tier tenant memory, append-only data warehouse, customer journey progression, and zero cross-tenant data leakage verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-surface-elevated/40 border-border/60 text-xs font-mono"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Org: {orgId}</span>
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="flex items-center gap-2 text-xs border-border/60 hover:bg-surface-elevated"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-muted-foreground ${
                isFetchingOverview ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-surface-elevated/60 border border-border/60 p-1 rounded-xl w-full sm:w-auto flex flex-wrap h-auto gap-1">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Overview</span>
          </TabsTrigger>

          <TabsTrigger
            value="timeline"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Journey Timeline</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
              {timeline.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="memory"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Memory Vault</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-400 font-mono">
              {memories.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="warehouse"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Warehouse</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 font-mono">
              {warehouseItems.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="privacy"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Privacy Audit</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <CustomerOverviewDashboardCard
            overview={overview}
            history={history}
            goals={goals}
            privacy={privacy}
            isLoading={isLoadingOverview}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerJourneyTimelinePanel
              timeline={timeline.slice(0, 3)}
              isLoading={isLoadingTimeline}
            />
            <CustomerMemoryVaultTable
              memories={memories.slice(0, 3)}
              isLoading={isLoadingMemories}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Timeline */}
        <TabsContent value="timeline" className="space-y-6">
          <CustomerJourneyTimelinePanel
            timeline={timeline}
            isLoading={isLoadingTimeline}
          />
        </TabsContent>

        {/* Tab 3: Memory Vault */}
        <TabsContent value="memory" className="space-y-6">
          <CustomerMemoryVaultTable
            memories={memories}
            isLoading={isLoadingMemories}
          />
        </TabsContent>

        {/* Tab 4: Warehouse */}
        <TabsContent value="warehouse" className="space-y-6">
          <CustomerWarehouseBrowser
            warehouseItems={warehouseItems}
            isLoading={isLoadingWarehouse}
          />
        </TabsContent>

        {/* Tab 5: Privacy Audit */}
        <TabsContent value="privacy" className="space-y-6">
          <CustomerPrivacyAuditConsole
            privacy={privacy}
            onVerifyPrivacy={handleVerifyPrivacy}
            isLoading={isLoadingPrivacy}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

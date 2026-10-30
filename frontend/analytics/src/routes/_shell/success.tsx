import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import {
  CustomerHealthScorecardCard,
  ChurnRiskPredictionPanel,
  SuccessJourneyMilestonesTimeline,
  ProductAdoptionMetricsCard,
  SuccessActionPlanConsole,
} from "@/components/success";
import { customerSuccessService } from "@/services";
import {
  HeartHandshake,
  HeartPulse,
  RefreshCw,
  Milestone,
  BarChart3,
  Calendar,
  ShieldAlert,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/success")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Customer Success & Churn Prediction Platform" },
      {
        name: "description",
        content:
          "Enterprise Customer Success Platform: 0-100 Account Health Scoring, Deterministic Churn Risk Prediction, Product Adoption Telemetry, and 30-Day Strategic Expansion Plans.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Customer Success & Churn Prediction Platform",
      },
      {
        property: "og:description",
        content:
          "Enterprise Customer Success Platform: 0-100 Account Health Scoring, Deterministic Churn Risk Prediction, Product Adoption Telemetry, and 30-Day Strategic Expansion Plans.",
      },
    ],
  }),
  component: CustomerSuccessPage,
});

function CustomerSuccessPage() {
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
    queryKey: ["customer-success-dashboard", orgId],
    queryFn: () => customerSuccessService.getDashboard(orgId),
    staleTime: 30_000,
  });

  // 2. Health Scorecard
  const {
    data: health,
    isLoading: isLoadingHealth,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ["customer-success-health", orgId],
    queryFn: () => customerSuccessService.getHealth(orgId),
    staleTime: 30_000,
  });

  // 3. Journey Milestones
  const {
    data: milestones = [],
    isLoading: isLoadingJourney,
    refetch: refetchJourney,
  } = useQuery({
    queryKey: ["customer-success-journey", orgId],
    queryFn: () => customerSuccessService.getJourney(orgId),
    staleTime: 30_000,
  });

  // 4. Product Adoption
  const {
    data: adoption,
    isLoading: isLoadingAdoption,
    refetch: refetchAdoption,
  } = useQuery({
    queryKey: ["customer-success-adoption", orgId],
    queryFn: () => customerSuccessService.getAdoption(orgId),
    staleTime: 30_000,
  });

  // 5. Churn Risk Prediction
  const {
    data: churn,
    isLoading: isLoadingChurn,
    refetch: refetchChurn,
  } = useQuery({
    queryKey: ["customer-success-churn", orgId],
    queryFn: () => customerSuccessService.getChurn(orgId),
    staleTime: 30_000,
  });

  // 6. Renewal Forecast
  const {
    data: renewal,
    isLoading: isLoadingRenewal,
    refetch: refetchRenewal,
  } = useQuery({
    queryKey: ["customer-success-renewal", orgId],
    queryFn: () => customerSuccessService.getRenewal(orgId),
    staleTime: 30_000,
  });

  // 7. Expansion Opportunity
  const {
    data: expansion,
    isLoading: isLoadingExpansion,
    refetch: refetchExpansion,
  } = useQuery({
    queryKey: ["customer-success-expansion", orgId],
    queryFn: () => customerSuccessService.getExpansion(orgId),
    staleTime: 30_000,
  });

  // 8. 30-Day Plan Recommendations
  const {
    data: plan,
    isLoading: isLoadingPlan,
    refetch: refetchPlan,
  } = useQuery({
    queryKey: ["customer-success-plan", orgId],
    queryFn: () => customerSuccessService.getRecommendations(orgId),
    staleTime: 30_000,
  });

  // 9. QBR Reports
  const {
    data: reports,
    isLoading: isLoadingReports,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["customer-success-reports"],
    queryFn: () => customerSuccessService.getReports(),
    staleTime: 30_000,
  });

  // 10. Dyvin Academy
  const {
    data: academy,
    isLoading: isLoadingAcademy,
    refetch: refetchAcademy,
  } = useQuery({
    queryKey: ["customer-success-academy"],
    queryFn: () => customerSuccessService.getAcademy(),
    staleTime: 30_000,
  });

  // 11. Customer Advocacy & Referrals
  const {
    data: referrals,
    isLoading: isLoadingReferrals,
    refetch: refetchReferrals,
  } = useQuery({
    queryKey: ["customer-success-referrals"],
    queryFn: () => customerSuccessService.getReferrals(),
    staleTime: 30_000,
  });

  const handleRefreshAll = () => {
    refetchOverview();
    refetchHealth();
    refetchJourney();
    refetchAdoption();
    refetchChurn();
    refetchRenewal();
    refetchExpansion();
    refetchPlan();
    refetchReports();
    refetchAcademy();
    refetchReferrals();
    toast.info("Customer Success Telemetry Refreshed", {
      description: `Synchronized health and churn forecasts for organization ${orgId}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Customer Success & Churn Prediction
                </h1>
                <Badge
                  variant="outline"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-semibold"
                >
                  PHASE F23
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Account health scorecards, deterministic churn risk telemetry, product adoption tracking, and automated 30-day expansion plans.
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
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Overview</span>
          </TabsTrigger>

          <TabsTrigger
            value="churn"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Churn Risk & Renewal</span>
          </TabsTrigger>

          <TabsTrigger
            value="adoption"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Product Adoption</span>
          </TabsTrigger>

          <TabsTrigger
            value="journey"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Milestone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Success Journey</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
              {milestones.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="action-plans"
            className="flex items-center gap-2 text-xs py-2 px-3 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Success Action Plans</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <CustomerHealthScorecardCard
            overview={overview}
            health={health}
            isLoading={isLoadingOverview || isLoadingHealth}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChurnRiskPredictionPanel
              churn={churn}
              renewal={renewal}
              expansion={expansion}
              isLoading={isLoadingChurn}
            />
            <ProductAdoptionMetricsCard
              adoption={adoption}
              isLoading={isLoadingAdoption}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Churn Risk & Renewal */}
        <TabsContent value="churn" className="space-y-6">
          <ChurnRiskPredictionPanel
            churn={churn}
            renewal={renewal}
            expansion={expansion}
            isLoading={isLoadingChurn}
          />
        </TabsContent>

        {/* Tab 3: Product Adoption */}
        <TabsContent value="adoption" className="space-y-6">
          <ProductAdoptionMetricsCard
            adoption={adoption}
            isLoading={isLoadingAdoption}
          />
        </TabsContent>

        {/* Tab 4: Journey Milestones */}
        <TabsContent value="journey" className="space-y-6">
          <SuccessJourneyMilestonesTimeline
            milestones={milestones}
            isLoading={isLoadingJourney}
          />
        </TabsContent>

        {/* Tab 5: Success Action Plans */}
        <TabsContent value="action-plans" className="space-y-6">
          <SuccessActionPlanConsole
            plan={plan}
            reports={reports}
            academy={academy}
            referrals={referrals}
            isLoading={isLoadingPlan}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  GovernanceDashboardOverviewCard,
  PolicyEngineManagerCard,
  ApprovalWorkflowQueueCard,
  ComplianceTrustCenterCard,
  ResponsibleAiExplainabilityCard,
  CreatePolicyModal,
} from "@/components/governance";
import { aiGovernanceService } from "@/services";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  FileCheck2,
  Sparkles,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CreatePolicyInput } from "@/types";

export const Route = createFileRoute("/_shell/governance")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise AI Governance & Safety Platform" },
      {
        name: "description",
        content:
          "Enterprise AI Governance, Compliance & Safety Platform: Deterministic policy boundary enforcement, responsible AI bias mitigation sweeps, dual-executive approval workflows, and immutable audit logs.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise AI Governance & Safety Platform",
      },
      {
        property: "og:description",
        content:
          "Enterprise AI Governance, Compliance & Safety Platform: Deterministic policy boundary enforcement, responsible AI bias mitigation sweeps, dual-executive approval workflows, and immutable audit logs.",
      },
    ],
  }),
  component: AIGovernancePage,
});

function AIGovernancePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Dashboard Overview
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery({
    queryKey: ["governance-dashboard"],
    queryFn: () => aiGovernanceService.getDashboard(),
    staleTime: 30_000,
  });

  // 2. Policies
  const {
    data: policies = [],
    isLoading: isLoadingPolicies,
    refetch: refetchPolicies,
  } = useQuery({
    queryKey: ["governance-policies"],
    queryFn: () => aiGovernanceService.getPolicies(),
    staleTime: 30_000,
  });

  // 3. Approvals
  const {
    data: approvals = [],
    isLoading: isLoadingApprovals,
    refetch: refetchApprovals,
  } = useQuery({
    queryKey: ["governance-approvals"],
    queryFn: () => aiGovernanceService.getApprovals(),
    staleTime: 30_000,
  });

  // 4. Risk
  const {
    data: risk,
    isLoading: isLoadingRisk,
    refetch: refetchRisk,
  } = useQuery({
    queryKey: ["governance-risk"],
    queryFn: () => aiGovernanceService.getRisk(),
    staleTime: 30_000,
  });

  // 5. Compliance
  const {
    data: compliance,
    isLoading: isLoadingCompliance,
    refetch: refetchCompliance,
  } = useQuery({
    queryKey: ["governance-compliance"],
    queryFn: () => aiGovernanceService.getCompliance(),
    staleTime: 30_000,
  });

  // 6. Audit Logs
  const {
    data: audits = [],
    isLoading: isLoadingAudits,
    refetch: refetchAudits,
  } = useQuery({
    queryKey: ["governance-audit"],
    queryFn: () => aiGovernanceService.getAudit(),
    staleTime: 30_000,
  });

  // 7. Trust Center
  const {
    data: trust,
    isLoading: isLoadingTrust,
    refetch: refetchTrust,
  } = useQuery({
    queryKey: ["governance-trust"],
    queryFn: () => aiGovernanceService.getTrust(),
    staleTime: 30_000,
  });

  // 8. Responsible AI
  const {
    data: responsibleAi,
    isLoading: isLoadingResponsibleAi,
    refetch: refetchResponsibleAi,
  } = useQuery({
    queryKey: ["governance-responsible-ai"],
    queryFn: () => aiGovernanceService.getResponsibleAi(),
    staleTime: 30_000,
  });

  // 9. Explainability
  const {
    data: explainability,
    isLoading: isLoadingExplainability,
    refetch: refetchExplainability,
  } = useQuery({
    queryKey: ["governance-explainability"],
    queryFn: () => aiGovernanceService.getExplainability(),
    staleTime: 30_000,
  });

  // 10. Statistics
  const { data: statistics } = useQuery({
    queryKey: ["governance-statistics"],
    queryFn: () => aiGovernanceService.getStatistics(),
    staleTime: 30_000,
  });

  const handleRefreshAll = async () => {
    await Promise.all([
      refetchOverview(),
      refetchPolicies(),
      refetchApprovals(),
      refetchRisk(),
      refetchCompliance(),
      refetchAudits(),
      refetchTrust(),
      refetchResponsibleAi(),
      refetchExplainability(),
    ]);
    toast.success("Governance sentinel telemetry refreshed");
  };

  const handleCreatePolicy = async (input: CreatePolicyInput) => {
    try {
      const created = await aiGovernanceService.createPolicy(input);
      toast.success(`Policy enforced: "${created.policyName}"`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["governance-policies"] }),
        queryClient.invalidateQueries({ queryKey: ["governance-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["governance-audit"] }),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create governance policy");
      throw err;
    }
  };

  const handleApproveWorkflow = async (workflowName: string, approverRole: string) => {
    try {
      const approved = await aiGovernanceService.approveWorkflow({
        organizationId: "f5bb0153-e41a-49ee-97dc-e03dc6228403",
        workflowName,
        approverRole,
      });
      toast.success(`Workflow approved: "${approved.workflowName}"`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["governance-approvals"] }),
        queryClient.invalidateQueries({ queryKey: ["governance-dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["governance-audit"] }),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Failed to approve workflow");
      throw err;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Enterprise AI Governance Platform</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                  Phase F28
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deterministic policy guardrails, responsible AI bias sweeps, dual-executive approval workflows, and immutable audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isFetchingOverview}
            className="gap-1.5 text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 text-xs h-9 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Policy</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/40 p-1 border border-border/50 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs gap-1.5 py-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="text-xs gap-1.5 py-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Policies ({policies.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs gap-1.5 py-1.5">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Approval Queue ({approvals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs gap-1.5 py-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Compliance & Trust</span>
          </TabsTrigger>
          <TabsTrigger value="responsible" className="text-xs gap-1.5 py-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Responsible AI & XAI</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <GovernanceDashboardOverviewCard
            overview={overview}
            statistics={statistics}
            isLoading={isLoadingOverview}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PolicyEngineManagerCard
              policies={policies.slice(0, 4)}
              isLoading={isLoadingPolicies}
              onCreateClick={() => setIsCreateModalOpen(true)}
            />
            <ApprovalWorkflowQueueCard
              approvals={approvals.slice(0, 4)}
              isLoading={isLoadingApprovals}
              onApprove={handleApproveWorkflow}
            />
          </div>
        </TabsContent>

        {/* Tab 2: Policies */}
        <TabsContent value="policies" className="space-y-6 mt-0">
          <PolicyEngineManagerCard
            policies={policies}
            isLoading={isLoadingPolicies}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>

        {/* Tab 3: Approvals */}
        <TabsContent value="approvals" className="space-y-6 mt-0">
          <ApprovalWorkflowQueueCard
            approvals={approvals}
            isLoading={isLoadingApprovals}
            onApprove={handleApproveWorkflow}
          />
        </TabsContent>

        {/* Tab 4: Compliance & Trust */}
        <TabsContent value="compliance" className="space-y-6 mt-0">
          <ComplianceTrustCenterCard
            compliance={compliance}
            trust={trust}
            audits={audits}
            isLoading={isLoadingCompliance || isLoadingTrust || isLoadingAudits}
          />
        </TabsContent>

        {/* Tab 5: Responsible AI & XAI */}
        <TabsContent value="responsible" className="space-y-6 mt-0">
          <ResponsibleAiExplainabilityCard
            responsibleAi={responsibleAi}
            explainability={explainability}
            isLoading={isLoadingResponsibleAi || isLoadingExplainability}
          />
        </TabsContent>
      </Tabs>

      {/* Modal: Create Policy */}
      <CreatePolicyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePolicy}
      />
    </div>
  );
}

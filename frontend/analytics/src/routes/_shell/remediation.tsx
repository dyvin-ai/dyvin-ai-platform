import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RemediationScoreCard } from "@/components/remediation/RemediationScoreCard";
import { RemediationPlaybooksPanel } from "@/components/remediation/RemediationPlaybooksPanel";
import { RemediationActionsTable } from "@/components/remediation/RemediationActionsTable";
import { RemediationSafetyDialog } from "@/components/remediation/RemediationSafetyDialog";
import { RemediationArtifactModal } from "@/components/remediation/RemediationArtifactModal";
import { useWorkspace } from "@/context/WorkspaceContext";
import { remediationService } from "@/services";
import {
  Wrench,
  RefreshCw,
  ShieldCheck,
  Play,
  Sparkles,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RemediationActionItem, RemediationPlaybookItem } from "@/types";

export const Route = createFileRoute("/_shell/remediation")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Autonomous AI Optimization & Remediation Engine" },
      {
        name: "description",
        content:
          "Autonomous playbook execution, automated citation recovery, and guarded brand knowledge remediation across AI answer engines.",
      },
      { property: "og:title", content: "Dyvin AI | Autonomous AI Optimization & Remediation Engine" },
      {
        property: "og:description",
        content:
          "Autonomous playbook execution, automated citation recovery, and guarded brand knowledge remediation across AI answer engines.",
      },
    ],
  }),
  component: RemediationPlatformPage,
});

function RemediationPlatformPage() {
  const { activeOrgId } = useWorkspace();
  const queryClient = useQueryClient();

  const [safetyDialogOpen, setSafetyDialogOpen] = useState(false);
  const [selectedActionToRun, setSelectedActionToRun] = useState<RemediationActionItem | null>(null);
  const [selectedPlaybookToDispatch, setSelectedPlaybookToDispatch] = useState<RemediationPlaybookItem | null>(null);

  const [artifactModalOpen, setArtifactModalOpen] = useState(false);
  const [selectedActionForArtifact, setSelectedActionForArtifact] = useState<RemediationActionItem | null>(null);

  // 1. Playbooks Query
  const {
    data: playbooks,
    isLoading: isLoadingPlaybooks,
    refetch: refetchPlaybooks,
    isFetching: isFetchingPlaybooks,
  } = useQuery({
    queryKey: ["remediation-playbooks"],
    queryFn: () => remediationService.getPlaybooks(),
    staleTime: 60_000,
  });

  // 2. Actions Query
  const {
    data: actions,
    isLoading: isLoadingActions,
    refetch: refetchActions,
    isFetching: isFetchingActions,
  } = useQuery({
    queryKey: ["remediation-actions", activeOrgId],
    queryFn: () => remediationService.getActions(activeOrgId ?? undefined),
    staleTime: 30_000,
  });

  // 3. Stats Query
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["remediation-stats", activeOrgId],
    queryFn: () => remediationService.getStats(activeOrgId ?? undefined),
    staleTime: 60_000,
  });

  // Mutations
  const createActionMutation = useMutation({
    mutationFn: (input: {
      organizationId: string;
      title: string;
      description?: string;
      type: string;
      priority?: string;
      triggerType?: string;
      payloadJson?: Record<string, any>;
    }) => remediationService.createAction(input),
    onSuccess: (newAction) => {
      queryClient.invalidateQueries({ queryKey: ["remediation-actions", activeOrgId] });
      queryClient.invalidateQueries({ queryKey: ["remediation-stats", activeOrgId] });
      toast.success("Autonomous remediation action queued", {
        description: `Action "${newAction.title}" registered in execution pipeline.`,
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create remediation action");
    },
  });

  const runActionMutation = useMutation({
    mutationFn: (actionId: string) => remediationService.runAction(actionId),
    onSuccess: (completed) => {
      queryClient.invalidateQueries({ queryKey: ["remediation-actions", activeOrgId] });
      queryClient.invalidateQueries({ queryKey: ["remediation-stats", activeOrgId] });
      toast.success("Remediation execution completed", {
        description: `Autonomous task "${completed.title}" generated synthesis artifacts.`,
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to run remediation action");
    },
  });

  const isRefreshing = isFetchingPlaybooks || isFetchingActions || isFetchingStats;
  const isInitialLoading = isLoadingPlaybooks && isLoadingActions && isLoadingStats;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([refetchPlaybooks(), refetchActions(), refetchStats()]);
      toast.success("Remediation telemetry synchronized");
    } catch {
      toast.error("Failed to synchronize remediation data");
    }
  };

  const handleDispatchPlaybookClick = (playbook: RemediationPlaybookItem) => {
    setSelectedPlaybookToDispatch(playbook);
    setSelectedActionToRun(null);
    setSafetyDialogOpen(true);
  };

  const handleRunActionClick = (action: RemediationActionItem) => {
    setSelectedActionToRun(action);
    setSelectedPlaybookToDispatch(null);
    setSafetyDialogOpen(true);
  };

  const handleConfirmSafetyExecution = async () => {
    const orgId = activeOrgId || "f5bb0153-e41a-49ee-97dc-e03dc6228403";

    if (selectedActionToRun) {
      await runActionMutation.mutateAsync(selectedActionToRun.id);
    } else if (selectedPlaybookToDispatch) {
      const typeMap: Record<string, string> = {
        RECOVER_VISIBILITY: "GENERATE_SCHEMA",
        BEAT_COMPETITOR: "GENERATE_COMPARISON_PAGE",
        IMPROVE_AI_SEARCH: "GENERATE_FAQ",
      };
      const actType = typeMap[selectedPlaybookToDispatch.category] || "GENERATE_SCHEMA";

      // 1. Create action
      const created = await createActionMutation.mutateAsync({
        organizationId: orgId,
        title: `${selectedPlaybookToDispatch.name} Execution`,
        description: selectedPlaybookToDispatch.description,
        type: actType,
        priority: "HIGH",
        triggerType: "MANUAL",
        payloadJson: { playbook: selectedPlaybookToDispatch.category },
      });

      // 2. Run action
      if (created?.id) {
        await runActionMutation.mutateAsync(created.id);
      }
    }
  };

  const handleViewArtifacts = (action: RemediationActionItem) => {
    setSelectedActionForArtifact(action);
    setArtifactModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Autonomous AI Optimization & Remediation Engine
            </h1>
            <Badge
              variant="outline"
              className="text-[11px] font-mono font-semibold bg-primary/10 text-primary border-primary/20"
            >
              Phase F11 Enterprise
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Multi-engine remediation playbooks, guarded execution pipelines, and automated Schema.org entity synthesis to counter AI drift and competitor expansion.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-9 gap-2"
            disabled={isRefreshing}
            onClick={handleRefreshAll}
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>{isRefreshing ? "Synchronizing..." : "Refresh Engine"}</span>
          </Button>
        </div>
      </div>

      {/* 1. Scorecard */}
      <RemediationScoreCard
        stats={stats}
        actionsCount={actions?.length}
        playbooksCount={playbooks?.length}
        isLoading={isInitialLoading || isLoadingStats}
      />

      {/* 2. Playbooks Panel */}
      <RemediationPlaybooksPanel
        playbooks={playbooks}
        isLoading={isInitialLoading || isLoadingPlaybooks}
        onDispatchPlaybook={handleDispatchPlaybookClick}
      />

      {/* 3. Actions Queue Table */}
      <RemediationActionsTable
        actions={actions}
        isLoading={isInitialLoading || isLoadingActions}
        onRunAction={handleRunActionClick}
        onViewArtifacts={handleViewArtifacts}
      />

      {/* 4. Safety Confirmation Modal */}
      <RemediationSafetyDialog
        open={safetyDialogOpen}
        onOpenChange={setSafetyDialogOpen}
        actionTitle={
          selectedActionToRun?.title ||
          selectedPlaybookToDispatch?.name ||
          "Autonomous Remediation Task"
        }
        actionDescription={
          selectedActionToRun?.description ||
          selectedPlaybookToDispatch?.description ||
          "Execute automated synthesis and alignment worker."
        }
        actionType={
          selectedActionToRun?.type ||
          selectedPlaybookToDispatch?.category ||
          "REMEDIATION"
        }
        onConfirm={handleConfirmSafetyExecution}
      />

      {/* 5. Artifact Inspection Modal */}
      <RemediationArtifactModal
        open={artifactModalOpen}
        onOpenChange={setArtifactModalOpen}
        action={selectedActionForArtifact}
      />
    </div>
  );
}

export default RemediationPlatformPage;

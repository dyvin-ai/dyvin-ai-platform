import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { UnderstandingScoreCard } from "@/components/understanding/UnderstandingScoreCard";
import { HallucinationDetectionTable } from "@/components/understanding/HallucinationDetectionTable";
import { SemanticSimilarityChart } from "@/components/understanding/SemanticSimilarityChart";
import { MissingKnowledgePanel } from "@/components/understanding/MissingKnowledgePanel";
import { useWorkspace } from "@/context/WorkspaceContext";
import { understandingService } from "@/services";
import {
  Brain,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Layers,
  Activity,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/understanding")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | AI Understanding & Trust Platform" },
      {
        name: "description",
        content:
          "Real-time AI model understanding index, hallucination detection & fact drift audit, semantic similarity alignment, and unindexed knowledge gap resolution.",
      },
      { property: "og:title", content: "Dyvin AI | AI Understanding & Trust Platform" },
      {
        property: "og:description",
        content:
          "Real-time AI model understanding index, hallucination detection & fact drift audit, semantic similarity alignment, and unindexed knowledge gap resolution.",
      },
    ],
  }),
  component: UnderstandingPlatformPage,
});

function UnderstandingPlatformPage() {
  const { activeOrgId, activeProjectId, activeOrganization, activeProject, isDemo } = useWorkspace();
  const queryClient = useQueryClient();

  // 1. Warehouse stats query
  const {
    data: warehouseStats,
    isLoading: isLoadingWarehouse,
    isError: isWarehouseError,
    refetch: refetchWarehouse,
    isFetching: isFetchingWarehouse,
  } = useQuery({
    queryKey: ["intelligence-warehouse"],
    queryFn: () => understandingService.getWarehouseStats(),
    staleTime: 60_000,
  });

  // 2. Cross model performance stats query
  const {
    data: crossModelStats,
    isLoading: isLoadingModels,
    isError: isModelsError,
    refetch: refetchModels,
    isFetching: isFetchingModels,
  } = useQuery({
    queryKey: ["intelligence-models"],
    queryFn: () => understandingService.getModels(),
    staleTime: 60_000,
  });

  // 3. Brand accuracy & hallucination audits query
  const {
    data: accuracyData,
    isLoading: isLoadingAccuracy,
    isError: isAccuracyError,
    refetch: refetchAccuracy,
    isFetching: isFetchingAccuracy,
  } = useQuery({
    queryKey: ["brand-accuracy", activeOrgId, activeProjectId],
    queryFn: () => understandingService.getAccuracy(activeProjectId || undefined),
    staleTime: 60_000,
  });

  // 4. Brand understanding query
  const {
    data: understandingData,
    isLoading: isLoadingUnderstanding,
    isError: isUnderstandingError,
    refetch: refetchUnderstanding,
    isFetching: isFetchingUnderstanding,
  } = useQuery({
    queryKey: ["brand-understanding", activeOrgId, activeProjectId],
    queryFn: () => understandingService.getUnderstanding(activeProjectId || undefined),
    staleTime: 60_000,
  });

  // 5. Replay verification mutation
  const replayMutation = useMutation({
    mutationFn: (responseId: string) => understandingService.replayResponse(responseId),
    onSuccess: () => {
      toast.success("Verification replay initiated", {
        description: "Re-executing grounded prompt against foundation models to verify consensus.",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-accuracy"] });
      queryClient.invalidateQueries({ queryKey: ["intelligence-warehouse"] });
    },
    onError: (err: any) => {
      toast.error("Replay execution failed", {
        description: err?.message || "Failed to trigger response replay on intelligence warehouse.",
      });
    },
  });

  const isInitialLoading =
    (isLoadingWarehouse && !warehouseStats) ||
    (isLoadingModels && !crossModelStats) ||
    (isLoadingAccuracy && !accuracyData);

  const isAnyFetching =
    isFetchingWarehouse || isFetchingModels || isFetchingAccuracy || isFetchingUnderstanding;

  const handleRefreshAll = () => {
    refetchWarehouse();
    refetchModels();
    refetchAccuracy();
    refetchUnderstanding();
  };

  const hasCriticalError = isWarehouseError && isModelsError && isAccuracyError;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="border-b border-border/80 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                AI Understanding & Trust Intelligence
              </h1>
              <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
                Phase F9 Enterprise
              </Badge>
              {activeProject?.name ? (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-surface-subtle border border-border text-muted-foreground">
                  Context: {activeProject.name}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
              Real-time AI model comprehension index, hallucination detection & fact drift audit, cross-model semantic similarity, and unindexed knowledge gap resolution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isAnyFetching}
              className="text-xs font-medium gap-1.5 h-8"
            >
              <RefreshCw className={`size-3.5 ${isAnyFetching ? "animate-spin" : ""}`} />
              Refresh Intelligence
            </Button>
          </div>
        </div>
      </div>

      {hasCriticalError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
          <AlertTriangle className="size-8 text-destructive mx-auto" />
          <h3 className="text-base font-semibold text-foreground">Failed to Load Intelligence Data</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Unable to connect to the Dyvin AI Intelligence Warehouse backend. Check your network or authentication session.
          </p>
          <Button size="sm" variant="outline" onClick={handleRefreshAll} className="gap-2">
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Main Score Matrix Card */}
          <UnderstandingScoreCard
            warehouseStats={warehouseStats}
            accuracyData={accuracyData}
            understandingData={understandingData}
            isLoading={isInitialLoading}
          />

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Hallucination & Fact Drift Audit */}
            <HallucinationDetectionTable
              accuracyData={accuracyData}
              isLoading={isLoadingAccuracy}
              onReplay={(id) => replayMutation.mutateAsync(id)}
              isReplaying={replayMutation.isPending}
            />

            {/* Right: Semantic Similarity & Latency Chart */}
            <SemanticSimilarityChart
              crossModelStats={crossModelStats}
              isLoading={isLoadingModels}
            />
          </div>

          {/* Knowledge Gap & Schema Void Panel */}
          <MissingKnowledgePanel
            understandingData={understandingData}
            accuracyData={accuracyData}
            isLoading={isLoadingUnderstanding}
          />
        </>
      )}
    </div>
  );
}

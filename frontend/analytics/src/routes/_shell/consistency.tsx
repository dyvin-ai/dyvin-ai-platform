import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConsistencyScoreCard } from "@/components/consistency/ConsistencyScoreCard";
import { ConflictTable, type ConflictItemData } from "@/components/consistency/ConflictTable";
import { ModelComparisonMatrix } from "@/components/consistency/ModelComparisonMatrix";
import { SemanticDifferenceViewer } from "@/components/consistency/SemanticDifferenceViewer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { consistencyService } from "@/services";
import {
  Layers,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Cpu,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/consistency")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | AI Consistency Intelligence Platform" },
      {
        name: "description",
        content:
          "Cross-model factual consistency scoring, side-by-side statement comparison, conflict resolution audit, and semantic difference alignment.",
      },
      { property: "og:title", content: "Dyvin AI | AI Consistency Intelligence Platform" },
      {
        property: "og:description",
        content:
          "Cross-model factual consistency scoring, side-by-side statement comparison, conflict resolution audit, and semantic difference alignment.",
      },
    ],
  }),
  component: ConsistencyPlatformPage,
});

function ConsistencyPlatformPage() {
  const { activeProjectId } = useWorkspace();
  const queryClient = useQueryClient();

  const [selectedConflict, setSelectedConflict] = useState<ConflictItemData | null>(null);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);

  // 1. Consistency Platform Statistics Query
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isStatsError,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useQuery({
    queryKey: ["consistency-statistics"],
    queryFn: () => consistencyService.getStatistics(),
    staleTime: 60_000,
  });

  // 2. Foundation Models Query
  const {
    data: models,
    isLoading: isLoadingModels,
    isError: isModelsError,
    refetch: refetchModels,
    isFetching: isFetchingModels,
  } = useQuery({
    queryKey: ["consistency-models"],
    queryFn: () => consistencyService.getModels(),
    staleTime: 60_000,
  });

  // 3. Competitors Benchmarks Query
  const {
    data: competitors,
    isLoading: isLoadingCompetitors,
    isError: isCompetitorsError,
    refetch: refetchCompetitors,
    isFetching: isFetchingCompetitors,
  } = useQuery({
    queryKey: ["consistency-competitors"],
    queryFn: () => consistencyService.getCompetitors(),
    staleTime: 60_000,
  });

  // 4. Research Threats Query
  const {
    data: threats,
    isLoading: isLoadingThreats,
    isError: isThreatsError,
    refetch: refetchThreats,
    isFetching: isFetchingThreats,
  } = useQuery({
    queryKey: ["consistency-threats"],
    queryFn: () => consistencyService.getThreats(),
    staleTime: 60_000,
  });

  // 5. Brand Accuracy Query
  const {
    data: accuracyData,
    isLoading: isLoadingAccuracy,
    isError: isAccuracyError,
    refetch: refetchAccuracy,
    isFetching: isFetchingAccuracy,
  } = useQuery({
    queryKey: ["consistency-accuracy", activeProjectId],
    queryFn: () => consistencyService.getAccuracy(activeProjectId ?? undefined),
    staleTime: 60_000,
  });

  const isRefreshing =
    isFetchingStats || isFetchingModels || isFetchingCompetitors || isFetchingThreats || isFetchingAccuracy;
  const isInitialLoading =
    isLoadingStats && isLoadingModels && isLoadingCompetitors && isLoadingThreats && isLoadingAccuracy;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchStats(),
        refetchModels(),
        refetchCompetitors(),
        refetchThreats(),
        refetchAccuracy(),
      ]);
      toast.success("AI Consistency Intelligence synchronized", {
        description: "All engine consensus scores, conflict audits, and competitor benchmarks refreshed.",
      });
    } catch {
      toast.error("Failed to refresh consistency metrics");
    }
  };

  const handleInspectConflict = (conflict: ConflictItemData) => {
    setSelectedConflict(conflict);
    setIsDiffViewerOpen(true);
  };

  const hasErrors =
    isStatsError && isModelsError && isCompetitorsError && isThreatsError && isAccuracyError;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Enterprise AI Consistency Intelligence Platform
            </h1>
            <Badge
              variant="outline"
              className="text-[11px] font-mono font-semibold bg-primary/10 text-primary border-primary/20"
            >
              Phase F10 Enterprise
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
            Cross-model factual consistency scoring, side-by-side statement comparison, conflict resolution audit, and semantic difference alignment.
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
            <span>{isRefreshing ? "Synchronizing..." : "Refresh Engines"}</span>
          </Button>
        </div>
      </div>

      {/* Global Error Banner if all queries failed */}
      {hasErrors && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Unable to load consistency intelligence feeds. Backend services may be temporarily unreachable.</span>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleRefreshAll}>
            Retry
          </Button>
        </div>
      )}

      {/* 1. Consistency Scorecard */}
      <ConsistencyScoreCard
        stats={stats}
        accuracyData={accuracyData}
        isLoading={isInitialLoading || isLoadingStats}
      />

      {/* 2. Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Conflict Audit Table */}
        <ConflictTable
          accuracyData={accuracyData}
          threats={threats}
          isLoading={isInitialLoading || isLoadingAccuracy || isLoadingThreats}
          onInspectDiff={handleInspectConflict}
        />

        {/* Right Column: Model Comparison Matrix */}
        <ModelComparisonMatrix
          models={models}
          competitors={competitors}
          isLoading={isInitialLoading || isLoadingModels || isLoadingCompetitors}
        />
      </div>

      {/* 3. Semantic Difference Viewer Modal */}
      <SemanticDifferenceViewer
        conflict={selectedConflict}
        open={isDiffViewerOpen}
        onOpenChange={setIsDiffViewerOpen}
      />
    </div>
  );
}
export default ConsistencyPlatformPage;

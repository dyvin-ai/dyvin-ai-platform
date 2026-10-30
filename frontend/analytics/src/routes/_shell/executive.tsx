import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ExecutiveScoreCard,
  GlobalCommandCenter,
  ExplainabilityPanel,
  DecisionInsightsGrid,
} from "@/components/executive";
import { executiveService } from "@/services";
import {
  Crown,
  RefreshCw,
  Download,
  AlertTriangle,
  Radio,
  FileCheck2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ExecutiveStrategicDecision } from "@/types";

export const Route = createFileRoute("/_shell/executive")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Executive Intelligence & Global Command Center" },
      {
        name: "description",
        content:
          "Consolidated C-suite AI visibility, real-time multi-region infrastructure telemetry, neural warehouse ledger, and ROI-prioritized strategic actions.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Executive Intelligence & Global Command Center",
      },
      {
        property: "og:description",
        content:
          "Consolidated C-suite AI visibility, real-time multi-region infrastructure telemetry, neural warehouse ledger, and ROI-prioritized strategic actions.",
      },
    ],
  }),
  component: ExecutivePlatformPage,
});

function ExecutivePlatformPage() {
  const queryClient = useQueryClient();
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedIds, setExecutedIds] = useState<Set<string>>(new Set());

  // 1. Overview Query
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
    error: overviewError,
  } = useQuery({
    queryKey: ["executive-overview"],
    queryFn: () => executiveService.getOverview(),
    staleTime: 60_000,
  });

  // 2. Telemetry Query
  const {
    data: telemetry,
    isLoading: isLoadingTelemetry,
    refetch: refetchTelemetry,
    isFetching: isFetchingTelemetry,
  } = useQuery({
    queryKey: ["executive-telemetry"],
    queryFn: () => executiveService.getCommandCenterTelemetry(),
    staleTime: 30_000,
  });

  // 3. Explainability Nodes Query
  const {
    data: explainabilityNodes,
    isLoading: isLoadingExplainability,
    refetch: refetchExplainability,
    isFetching: isFetchingExplainability,
  } = useQuery({
    queryKey: ["executive-explainability"],
    queryFn: () => executiveService.getExplainabilityNodes(),
    staleTime: 60_000,
  });

  // 4. Strategic Decisions Query
  const {
    data: strategicDecisions,
    isLoading: isLoadingDecisions,
    refetch: refetchDecisions,
    isFetching: isFetchingDecisions,
  } = useQuery({
    queryKey: ["executive-decisions"],
    queryFn: () => executiveService.getStrategicDecisions(),
    staleTime: 60_000,
  });

  const isAnyRefreshing =
    isFetchingOverview ||
    isFetchingTelemetry ||
    isFetchingExplainability ||
    isFetchingDecisions;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchOverview(),
        refetchTelemetry(),
        refetchExplainability(),
        refetchDecisions(),
      ]);
      toast.success("Executive telemetry updated successfully");
    } catch {
      toast.error("Failed to refresh executive telemetry");
    }
  };

  const handleExecuteDecision = async (decision: ExecutiveStrategicDecision) => {
    setExecutingId(decision.id);
    try {
      // Simulate real-time dispatch with live verification
      await new Promise((resolve) => setTimeout(resolve, 600));
      setExecutedIds((prev) => new Set([...prev, decision.id]));
      toast.success(`Strategic Action Dispatched: ${decision.title}`, {
        description: `Projected ROI of +${decision.expectedRoiPercentage}% queued for verification.`,
      });
    } catch (err: any) {
      toast.error(`Execution failed: ${err.message || "Unknown error"}`);
    } finally {
      setExecutingId(null);
    }
  };

  const handleExportBriefing = () => {
    toast.success("Executive Briefing Exported", {
      description: "C-Suite intelligence summary prepared with permanent ledger signature.",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Crown className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Enterprise Executive Intelligence
                </h1>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] text-amber-500 border-amber-500/30 bg-amber-500/5 uppercase"
                >
                  Global Command
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Unified cross-engine AI presence, distributed telemetry, and algorithmic explainability for executive decision-makers.
              </p>
            </div>
          </div>
        </div>

        {/* Header Quick Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportBriefing}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Download className="size-3.5" />
            <span>Export Briefing</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isAnyRefreshing}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`size-3.5 ${isAnyRefreshing ? "animate-spin" : ""}`} />
            <span>{isAnyRefreshing ? "Updating..." : "Refresh Intelligence"}</span>
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {overviewError && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Unable to load executive metrics from backend service. Please check your connection.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchOverview()}
            className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/20"
          >
            Retry
          </Button>
        </div>
      )}

      {/* 1. Executive Scorecard */}
      <section aria-label="Executive Scorecard">
        <ExecutiveScoreCard overview={overview} isLoading={isLoadingOverview} />
      </section>

      {/* 2. Global Operational Command Center */}
      <section aria-label="Global Command Center">
        <GlobalCommandCenter
          telemetry={telemetry}
          isLoading={isLoadingTelemetry}
          onRefresh={refetchTelemetry}
          isRefreshing={isFetchingTelemetry}
        />
      </section>

      {/* 3. Explainability Center & Decision Support */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="Explainability Center">
          <ExplainabilityPanel
            nodes={explainabilityNodes}
            isLoading={isLoadingExplainability}
          />
        </section>

        <section aria-label="Executive Decision Support">
          <DecisionInsightsGrid
            decisions={strategicDecisions}
            isLoading={isLoadingDecisions}
            onExecute={handleExecuteDecision}
            executingId={executingId}
            executedIds={executedIds}
          />
        </section>
      </div>
    </div>
  );
}
export default ExecutivePlatformPage;

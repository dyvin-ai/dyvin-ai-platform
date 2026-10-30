import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TraceWaterfallViewer,
  MetricsConsole,
  DependencyHealthGrid,
} from "@/components/observability";
import { observabilityService } from "@/services";
import { Activity, RefreshCw, AlertTriangle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/observability")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Observability & Distributed Tracing" },
      {
        name: "description",
        content:
          "OpenTelemetry distributed tracing waterfalls, Prometheus scraper console, and real-time dependency gateway health telemetry.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Observability & Distributed Tracing",
      },
      {
        property: "og:description",
        content:
          "OpenTelemetry distributed tracing waterfalls, Prometheus scraper console, and real-time dependency gateway health telemetry.",
      },
    ],
  }),
  component: ObservabilityPlatformPage,
});

function ObservabilityPlatformPage() {
  const queryClient = useQueryClient();

  // 1. Prometheus Metrics Text Query
  const {
    data: metricsText = "",
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
    isFetching: isFetchingMetrics,
    error: metricsError,
  } = useQuery({
    queryKey: ["metrics-stream"],
    queryFn: () => observabilityService.getPrometheusMetricsText(),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  // 2. Dependencies Query
  const {
    data: dependencies = [],
    isLoading: isLoadingDependencies,
    refetch: refetchDependencies,
    isFetching: isFetchingDependencies,
  } = useQuery({
    queryKey: ["observability-dependencies"],
    queryFn: () => observabilityService.getDependencies(),
    staleTime: 30_000,
  });

  // 3. Traces Query
  const {
    data: traces = [],
    isLoading: isLoadingTraces,
    refetch: refetchTraces,
    isFetching: isFetchingTraces,
  } = useQuery({
    queryKey: ["observability-traces"],
    queryFn: () => observabilityService.getTraces(),
    staleTime: 30_000,
  });

  // 4. Telemetry Summary Query
  const {
    data: summary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
    isFetching: isFetchingSummary,
  } = useQuery({
    queryKey: ["observability-summary"],
    queryFn: () => observabilityService.getTelemetrySummary(),
    staleTime: 30_000,
  });

  const isAnyFetching =
    isFetchingMetrics || isFetchingDependencies || isFetchingTraces || isFetchingSummary;

  const handleRefreshAll = () => {
    refetchMetrics();
    refetchDependencies();
    refetchTraces();
    refetchSummary();
    toast.info("Refreshed observability telemetry streams.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              Enterprise Observability & Distributed Tracing
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
              Phase F15 Enterprise
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            OpenTelemetry distributed tracing waterfalls, Prometheus scraper console, and real-time dependency gateway health telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isAnyFetching}
            className="h-9 gap-1.5 text-xs border-border"
          >
            <RefreshCw className={`size-3.5 ${isAnyFetching ? "animate-spin" : ""}`} />
            <span>{isAnyFetching ? "Polling..." : "Poll Feeds"}</span>
          </Button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono">
            <Radio className="size-3.5 animate-pulse" />
            <span>TELEMETRY STREAM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {metricsError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-red-500" />
            <span>Unable to connect to live Prometheus scraper. Displaying cached metrics snapshot.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMetrics()}
            className="h-7 text-xs border-red-500/40 text-red-400 hover:bg-red-500/20"
          >
            Retry Stream
          </Button>
        </div>
      )}

      {/* Section 1: Dependency Health & KPI Strip */}
      <DependencyHealthGrid
        dependencies={dependencies}
        summary={summary}
        isLoading={isLoadingDependencies || isLoadingSummary}
      />

      {/* Section 2: OpenTelemetry Tracing Waterfall */}
      <TraceWaterfallViewer
        traces={traces}
        isLoading={isLoadingTraces}
      />

      {/* Section 3: Prometheus Metrics Scraper Console */}
      <MetricsConsole
        metricsText={metricsText}
        isLoading={isLoadingMetrics}
        onRefresh={() => refetchMetrics()}
      />
    </div>
  );
}

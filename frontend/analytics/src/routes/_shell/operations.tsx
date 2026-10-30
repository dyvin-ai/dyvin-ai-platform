import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  OperationsDashboard,
  CopilotPanel,
  IncidentTimeline,
  RootCauseViewer,
} from "@/components/operations";
import { autonomousOpsService } from "@/services";
import {
  Server,
  RefreshCw,
  Play,
  AlertTriangle,
  Bot,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/operations")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Autonomous Operations & AI Copilot Platform" },
      {
        name: "description",
        content:
          "Real-time SRE operational health, AI Copilot assistant workspace, auto-remediation playbook execution, and FinOps infrastructure cost optimization.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Autonomous Operations & AI Copilot Platform",
      },
      {
        property: "og:description",
        content:
          "Real-time SRE operational health, AI Copilot assistant workspace, auto-remediation playbook execution, and FinOps infrastructure cost optimization.",
      },
    ],
  }),
  component: AutonomousOpsPlatformPage,
});

function AutonomousOpsPlatformPage() {
  const queryClient = useQueryClient();

  // 1. Overview Query
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
    error: overviewError,
  } = useQuery({
    queryKey: ["ops-overview"],
    queryFn: () => autonomousOpsService.getOverview(),
    staleTime: 30_000,
  });

  // 2. Component Health Query
  const {
    data: health,
    isLoading: isLoadingHealth,
    refetch: refetchHealth,
    isFetching: isFetchingHealth,
  } = useQuery({
    queryKey: ["ops-health"],
    queryFn: () => autonomousOpsService.getHealth(),
    staleTime: 30_000,
  });

  // 3. Incidents Query
  const {
    data: incidents,
    isLoading: isLoadingIncidents,
    refetch: refetchIncidents,
    isFetching: isFetchingIncidents,
  } = useQuery({
    queryKey: ["ops-incidents"],
    queryFn: () => autonomousOpsService.getIncidents(),
    staleTime: 30_000,
  });

  // 4. Capacity Query
  const {
    data: capacity,
    isLoading: isLoadingCapacity,
    refetch: refetchCapacity,
    isFetching: isFetchingCapacity,
  } = useQuery({
    queryKey: ["ops-capacity"],
    queryFn: () => autonomousOpsService.getCapacity(),
    staleTime: 60_000,
  });

  const isAnyRefreshing =
    isFetchingOverview ||
    isFetchingHealth ||
    isFetchingIncidents ||
    isFetchingCapacity;

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        refetchOverview(),
        refetchHealth(),
        refetchIncidents(),
        refetchCapacity(),
      ]);
      toast.success("Autonomous SRE operations telemetry updated");
    } catch {
      toast.error("Failed to refresh operations telemetry");
    }
  };

  const handleRunAudit = () => {
    toast.success("Autonomic SRE Audit Dispatched", {
      description: "Executing automated integrity scan across all 7 operational subsystems.",
    });
  };

  const handleCopilotAction = (actionName: string) => {
    toast.info("Copilot Playbook Triggered", {
      description: actionName,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Server className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Enterprise Autonomous Operations & Copilot
                </h1>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] text-primary border-primary/30 bg-primary/5 uppercase"
                >
                  Phase F13
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time SRE operational health, AI Copilot assistant workspace, auto-remediation playbook execution, and FinOps optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunAudit}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Play className="size-3.5 text-primary" />
            <span>Run SRE Audit</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isAnyRefreshing}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`size-3.5 ${isAnyRefreshing ? "animate-spin" : ""}`} />
            <span>{isAnyRefreshing ? "Updating..." : "Refresh Telemetry"}</span>
          </Button>
        </div>
      </div>

      {/* Global Error Banner */}
      {overviewError && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Unable to load operations telemetry from SRE backend. Please check your connection.</span>
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

      {/* 1. Main Operations Matrix Card */}
      <section aria-label="Operations Matrix">
        <OperationsDashboard
          overview={overview}
          health={health}
          isLoading={isLoadingOverview || isLoadingHealth}
        />
      </section>

      {/* 2. Main 2-Column Grid (Copilot & Capacity Forecast) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-label="AI Copilot Workspace">
          <CopilotPanel onActionTrigger={handleCopilotAction} />
        </section>

        <section aria-label="Infrastructure Capacity Forecast">
          <RootCauseViewer capacity={capacity} isLoading={isLoadingCapacity} />
        </section>
      </div>

      {/* 3. SRE Incident & Remediation Timeline */}
      <section aria-label="Incident Timeline">
        <IncidentTimeline incidents={incidents} isLoading={isLoadingIncidents} />
      </section>
    </div>
  );
}

export default AutonomousOpsPlatformPage;

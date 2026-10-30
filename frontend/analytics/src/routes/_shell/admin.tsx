import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  TenantAdminPanel,
  FeatureFlagManager,
  SupportAuditCenter,
} from "@/components/admin";
import { platformAdminService } from "@/services";
import { Building2, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  CreateFeatureFlagPayload,
  CreateSupportTicketPayload,
  TenantQuotaOverridePayload,
  UpdateFeatureFlagPayload,
} from "@/types";

export const Route = createFileRoute("/_shell/admin")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Enterprise Multi-Tenant Administration & Governance" },
      {
        name: "description",
        content:
          "Enterprise multi-tenant management, resource quota controls, dynamic feature flags, support center, and append-only audit trail.",
      },
      {
        property: "og:title",
        content: "Dyvin AI | Enterprise Multi-Tenant Administration & Governance",
      },
      {
        property: "og:description",
        content:
          "Enterprise multi-tenant management, resource quota controls, dynamic feature flags, support center, and append-only audit trail.",
      },
    ],
  }),
  component: PlatformAdminPage,
});

function PlatformAdminPage() {
  const queryClient = useQueryClient();

  // 1. Tenants Query
  const {
    data: tenants = [],
    isLoading: isLoadingTenants,
    refetch: refetchTenants,
    isFetching: isFetchingTenants,
    error: tenantsError,
  } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: () => platformAdminService.getTenants(),
    staleTime: 30_000,
  });

  // 2. Feature Flags Query
  const {
    data: flags = [],
    isLoading: isLoadingFlags,
    refetch: refetchFlags,
    isFetching: isFetchingFlags,
  } = useQuery({
    queryKey: ["admin-flags"],
    queryFn: () => platformAdminService.getFeatureFlags(),
    staleTime: 30_000,
  });

  // 3. Support Tickets Query
  const {
    data: tickets = [],
    isLoading: isLoadingTickets,
    refetch: refetchTickets,
    isFetching: isFetchingTickets,
  } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => platformAdminService.getSupportTickets(),
    staleTime: 30_000,
  });

  // 4. Audit Logs Query
  const {
    data: auditLogs = [],
    isLoading: isLoadingAudit,
    refetch: refetchAudit,
    isFetching: isFetchingAudit,
  } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => platformAdminService.getAuditLogs(),
    staleTime: 30_000,
  });

  // Mutations
  const overrideQuotaMutation = useMutation({
    mutationFn: (payload: TenantQuotaOverridePayload) =>
      platformAdminService.overrideQuota(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tenants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: (payload: CreateFeatureFlagPayload) =>
      platformAdminService.createFeatureFlag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    },
  });

  const updateFlagMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeatureFlagPayload }) =>
      platformAdminService.updateFeatureFlag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-flags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (payload: CreateSupportTicketPayload) =>
      platformAdminService.createSupportTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
    },
  });

  const startImpersonationMutation = useMutation({
    mutationFn: ({ tenantId, reason }: { tenantId: string; reason: string }) =>
      platformAdminService.startImpersonation({ targetTenantId: tenantId, reason }),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-audit"] });
      toast.success(
        `Impersonation session established for target partition: ${vars.tenantId}. Active token: ${
          res?.sessionToken?.slice(0, 14) || "imp_token_live"
        }...`
      );
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to start impersonation session");
    },
  });

  const isAnyFetching =
    isFetchingTenants || isFetchingFlags || isFetchingTickets || isFetchingAudit;

  const handleRefreshAll = () => {
    refetchTenants();
    refetchFlags();
    refetchTickets();
    refetchAudit();
    toast.info("Refreshing enterprise administration control plane...");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display">
              Enterprise Multi-Tenant Administration
            </h1>
            <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/10">
              Phase F14 Enterprise
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Multi-tenant partition management, resource quota controls, dynamic feature flags, support center, and append-only audit trail.
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
            <span>{isAnyFetching ? "Syncing..." : "Sync All"}</span>
          </Button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-xs font-mono">
            <ShieldCheck className="size-3.5" />
            <span>CONTROL PLANE NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Global Error Banner */}
      {tenantsError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-red-500" />
            <span>Failed to reach control plane endpoints. Displaying cached tenant configurations.</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchTenants()}
            className="h-7 text-xs border-red-500/40 text-red-400 hover:bg-red-500/20"
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* Section 1: Multi-Tenant Administration */}
      <TenantAdminPanel
        tenants={tenants}
        isLoading={isLoadingTenants}
        onOverrideQuota={async (payload) => {
          await overrideQuotaMutation.mutateAsync(payload);
        }}
        onStartImpersonation={async (tenantId, tenantName) => {
          await startImpersonationMutation.mutateAsync({
            tenantId,
            reason: `Administrative diagnosis session for ${tenantName}`,
          });
        }}
        onRefresh={() => refetchTenants()}
      />

      {/* Section 2: Dynamic Feature Flags & Kill Switch */}
      <FeatureFlagManager
        flags={flags}
        isLoading={isLoadingFlags}
        onCreateFlag={async (payload) => {
          await createFlagMutation.mutateAsync(payload);
        }}
        onUpdateFlag={async (id, payload) => {
          await updateFlagMutation.mutateAsync({ id, payload });
        }}
        onRefresh={() => refetchFlags()}
      />

      {/* Section 3: Support Tickets & Audit Log */}
      <SupportAuditCenter
        tickets={tickets}
        auditLogs={auditLogs}
        isLoading={isLoadingTickets || isLoadingAudit}
        onCreateTicket={async (payload) => {
          await createTicketMutation.mutateAsync(payload);
        }}
        onRefresh={() => {
          refetchTickets();
          refetchAudit();
        }}
      />
    </div>
  );
}

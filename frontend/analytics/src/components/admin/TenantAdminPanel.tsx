import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, Sliders, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";
import type { TenantAdminItem, TenantQuotaOverridePayload } from "@/types";
import { toast } from "sonner";

interface TenantAdminPanelProps {
  tenants: TenantAdminItem[];
  isLoading?: boolean;
  onOverrideQuota: (payload: TenantQuotaOverridePayload) => Promise<void>;
  onStartImpersonation: (tenantId: string, tenantName: string) => Promise<void>;
  onRefresh?: () => void;
}

export function TenantAdminPanel({
  tenants = [],
  isLoading,
  onOverrideQuota,
  onStartImpersonation,
  onRefresh,
}: TenantAdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTenantForQuota, setSelectedTenantForQuota] = useState<TenantAdminItem | null>(null);
  const [overrideResource, setOverrideResource] = useState("ai_prompts_daily");
  const [overrideValue, setOverrideValue] = useState("250000");
  const [isSubmittingQuota, setIsSubmittingQuota] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyOverride = async () => {
    if (!selectedTenantForQuota) return;
    try {
      setIsSubmittingQuota(true);
      await onOverrideQuota({
        tenantId: selectedTenantForQuota.id,
        resourceName: overrideResource,
        maxAllowed: parseInt(overrideValue, 10) || 100000,
      });
      toast.success(`Quota override applied to ${selectedTenantForQuota.name}`);
      setSelectedTenantForQuota(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to override quota");
    } finally {
      setIsSubmittingQuota(false);
    }
  };

  const handleImpersonate = async (tenant: TenantAdminItem) => {
    try {
      setImpersonatingId(tenant.id);
      await onStartImpersonation(tenant.id, tenant.name);
    } finally {
      setImpersonatingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-5">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="size-5 text-primary shrink-0" />
            <span>Multi-Tenant Administration & Quota Governance</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Isolated enterprise tenant partitions, resource quota overrides, license enforcement, and administrative impersonation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-8 gap-1 text-xs border-border"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh</span>
            </Button>
          )}
          <Badge variant="outline" className="font-mono text-xs">
            {tenants.length} Active Tenants
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search enterprise tenants by name, domain, or partition ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Tenant List */}
        {filteredTenants.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
            No tenants match your search query.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="p-4 rounded-xl border border-border bg-muted/10 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{tenant.name}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {tenant.plan}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px] font-mono"
                    >
                      {tenant.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted/30 px-2 py-0.5 rounded">
                      {tenant.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>
                      Partition: <code className="font-mono text-foreground text-[11px]">{tenant.id}</code>
                    </span>
                    {tenant.domain && <span>Domain: {tenant.domain}</span>}
                    <span>Users: <strong className="text-foreground">{tenant.usersCount}</strong></span>
                  </div>

                  {/* Quota Highlights */}
                  {tenant.quotas && tenant.quotas.length > 0 && (
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-mono">
                      {tenant.quotas.map((q, idx) => (
                        <span key={idx} className="bg-surface border border-border px-2 py-0.5 rounded text-[10px]">
                          {q.resourceName}: {q.used?.toLocaleString() ?? 0} / {q.maxAllowed.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTenantForQuota(tenant)}
                    className="h-8 gap-1.5 text-xs border-border"
                  >
                    <Sliders className="size-3.5" />
                    <span>Override Quota</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={impersonatingId === tenant.id}
                    onClick={() => handleImpersonate(tenant)}
                    className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <UserCheck className="size-3.5" />
                    <span>{impersonatingId === tenant.id ? "Connecting..." : "Impersonate"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quota Override Modal */}
        {selectedTenantForQuota && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Sliders className="size-4 text-primary" />
                  <span>Override Quota for {selectedTenantForQuota.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedTenantForQuota(null)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Target Resource</label>
                  <select
                    value={overrideResource}
                    onChange={(e) => setOverrideResource(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="ai_prompts_daily">AI Evaluation Prompts (Daily)</option>
                    <option value="crawler_pages_monthly">Web Crawl Pages (Monthly)</option>
                    <option value="api_rate_limit_rps">API Rate Limit (Requests/Sec)</option>
                    <option value="max_projects">Max Concurrent Projects</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">New Allocation Limit</label>
                  <input
                    type="number"
                    value={overrideValue}
                    onChange={(e) => setOverrideValue(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTenantForQuota(null)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isSubmittingQuota}
                  onClick={handleApplyOverride}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmittingQuota ? "Applying..." : "Save Override"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

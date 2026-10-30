import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, Plus, Search, AlertOctagon, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import type { FeatureFlagItem, CreateFeatureFlagPayload, UpdateFeatureFlagPayload } from "@/types";
import { toast } from "sonner";

interface FeatureFlagManagerProps {
  flags: FeatureFlagItem[];
  isLoading?: boolean;
  onCreateFlag: (payload: CreateFeatureFlagPayload) => Promise<void>;
  onUpdateFlag: (id: string, payload: UpdateFeatureFlagPayload) => Promise<void>;
  onRefresh?: () => void;
}

export function FeatureFlagManager({
  flags = [],
  isLoading,
  onCreateFlag,
  onUpdateFlag,
  onRefresh,
}: FeatureFlagManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStrategy, setNewStrategy] = useState("BOOLEAN");
  const [newPercentage, setNewPercentage] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredFlags = flags.filter(
    (f) =>
      f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = async (flag: FeatureFlagItem) => {
    try {
      setUpdatingId(flag.id);
      await onUpdateFlag(flag.id, {
        isEnabled: !flag.isEnabled,
      });
      toast.success(`Flag "${flag.key}" set to ${!flag.isEnabled ? "ENABLED" : "DISABLED"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update feature flag");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleKillSwitch = async (flag: FeatureFlagItem) => {
    try {
      setUpdatingId(flag.id);
      const nextKillState = !flag.isKillSwitched;
      await onUpdateFlag(flag.id, {
        isKillSwitched: nextKillState,
        isEnabled: nextKillState ? false : flag.isEnabled,
      });
      if (nextKillState) {
        toast.warning(`KILL SWITCH ACTIVE: Flag "${flag.key}" instantly terminated across all clusters!`);
      } else {
        toast.info(`Kill switch deactivated for "${flag.key}".`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update kill switch");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newName.trim()) {
      toast.error("Flag Key and Display Name are required");
      return;
    }
    try {
      setIsSubmitting(true);
      await onCreateFlag({
        key: newKey.trim(),
        name: newName.trim(),
        description: newDesc.trim() || undefined,
        strategy: newStrategy,
        percentage: Number(newPercentage) || 100,
        isEnabled: true,
      });
      toast.success(`Feature flag "${newKey}" created and registered.`);
      setIsCreatingModalOpen(false);
      setNewKey("");
      setNewName("");
      setNewDesc("");
    } catch (err: any) {
      toast.error(err.message || "Failed to create feature flag");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
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
            <SlidersHorizontal className="size-5 text-primary shrink-0" />
            <span>Dynamic Feature Flags & Instant Kill Switch</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Distributed rollout controls, canary staging, tenant targeting, and emergency platform circuit breakers.
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
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCreatingModalOpen(true)}
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            <span>New Feature Flag</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search feature flags by key, name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Flag List */}
        {filteredFlags.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
            No feature flags found. Click "New Feature Flag" to register dynamic switches.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFlags.map((flag) => {
              const isUpdating = updatingId === flag.id;
              const isEnabled = flag.isEnabled && !flag.isKillSwitched;

              return (
                <div
                  key={flag.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    flag.isKillSwitched
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-border bg-muted/10 hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="font-mono text-xs font-bold text-foreground bg-muted/30 px-2 py-0.5 rounded border border-border">
                        {flag.key}
                      </code>
                      <span className="font-semibold text-xs text-foreground">{flag.name}</span>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {flag.strategy}
                      </Badge>
                      {flag.strategy === "PERCENTAGE" && flag.percentage !== undefined && (
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {flag.percentage}% Rollout
                        </span>
                      )}
                      {flag.isKillSwitched && (
                        <Badge variant="destructive" className="text-[10px] font-mono animate-pulse">
                          KILL SWITCH ACTIVE
                        </Badge>
                      )}
                    </div>
                    {flag.description && (
                      <p className="text-xs text-muted-foreground">{flag.description}</p>
                    )}
                  </div>

                  {/* Toggles & Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {/* Toggle State */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating || flag.isKillSwitched}
                      onClick={() => handleToggle(flag)}
                      className={`h-8 gap-1.5 text-xs font-mono border-border ${
                        isEnabled
                          ? "text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/30"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {isEnabled ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-muted-foreground" />
                          <span>DISABLED</span>
                        </>
                      )}
                    </Button>

                    {/* Kill Switch */}
                    <Button
                      variant={flag.isKillSwitched ? "destructive" : "outline"}
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => handleKillSwitch(flag)}
                      className={`h-8 gap-1.5 text-xs font-mono ${
                        flag.isKillSwitched
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "border-border text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
                      }`}
                      title={flag.isKillSwitched ? "Deactivate kill switch" : "Emergency kill switch"}
                    >
                      <AlertOctagon className="size-3.5" />
                      <span>{flag.isKillSwitched ? "KILL ENGAGED" : "KILL SWITCH"}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create Feature Flag */}
        {isCreatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <form
              onSubmit={handleCreateSubmit}
              className="bg-card border border-border rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Plus className="size-4 text-primary" />
                  <span>Create Enterprise Feature Flag</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">
                    Flag Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ff-new-evaluator-engine"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">
                    Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen Evaluator Engine"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe rollout conditions, dependencies, and expected behaviour..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground mb-1">Rollout Strategy</label>
                    <select
                      value={newStrategy}
                      onChange={(e) => setNewStrategy(e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                    >
                      <option value="BOOLEAN">Boolean (On/Off)</option>
                      <option value="PERCENTAGE">Percentage Rollout</option>
                      <option value="TARGET_AUDIENCE">Tenant Audience</option>
                      <option value="CANARY">Canary Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-muted-foreground mb-1">Target Percentage</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={newPercentage}
                      onChange={(e) => setNewPercentage(Number(e.target.value))}
                      className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground font-mono focus:outline-hidden focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Registering..." : "Create Flag"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

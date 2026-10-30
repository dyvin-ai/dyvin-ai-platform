import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { workspaceService, analyticsService, billingService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import { toast } from "sonner";
import type { User, Workspace, ScanStatus, SubscriptionState, SubscriptionPlan, UsageMetric, InvoiceItem } from "@/types";
import { Loader2, AlertCircle, RefreshCw, Shield, Lock, CreditCard } from "lucide-react";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Settings" },
      { name: "description", content: "Workspace, tracking and team settings for your Dyvin AI search intelligence workspace." },
      { property: "og:title", content: "Dyvin AI | Settings" },
      { property: "og:description", content: "Workspace, tracking and team settings for your Dyvin AI search intelligence workspace." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { refreshWorkspace, activeOrganization } = useWorkspace();

  // Workspace & Project state
  const [, setWorkspace] = useState<Workspace | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  // Scan status
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);

  // Subscription & Billing state
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isLoadingBilling, setIsLoadingBilling] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);

  const loadBilling = useCallback(async () => {
    setIsLoadingBilling(true);
    setBillingError(null);
    try {
      const orgId = activeOrganization?.id;
      const [subRes, plansRes, usageRes, invoicesRes] = await Promise.allSettled([
        billingService.getSubscription(orgId),
        billingService.getPlans(),
        billingService.getUsage(orgId),
        billingService.getInvoices(orgId),
      ]);

      if (subRes.status === "fulfilled") {
        setSubscriptionState(subRes.value);
      } else {
        const errorMsg = subRes.reason instanceof Error ? subRes.reason.message : "Failed to load subscription";
        setBillingError(errorMsg);
      }

      if (plansRes.status === "fulfilled" && Array.isArray(plansRes.value)) {
        setPlans(plansRes.value);
      }

      if (usageRes.status === "fulfilled" && Array.isArray(usageRes.value)) {
        setUsageMetrics(usageRes.value);
      }

      if (invoicesRes.status === "fulfilled" && Array.isArray(invoicesRes.value)) {
        setInvoices(invoicesRes.value);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load billing information";
      setBillingError(errorMsg);
    } finally {
      setIsLoadingBilling(false);
    }
  }, [activeOrganization?.id]);

  const loadWorkspace = useCallback(async () => {
    setIsLoadingWorkspace(true);
    setWorkspaceError(null);
    try {
      const ws = await workspaceService.getWorkspace();
      if (ws) {
        setWorkspace(ws);
        setWorkspaceName(ws.name || "");
        setDomain(ws.domain || "");
        setIndustry(ws.industry || "");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load workspace settings";
      setWorkspaceError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingWorkspace(false);
    }
  }, []);

  const loadTeamMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    setMembersError(null);
    try {
      const tm = await workspaceService.getTeamMembers();
      setTeamMembers(Array.isArray(tm) ? tm : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load team members";
      setMembersError(msg);
      toast.error(msg);
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
    loadTeamMembers();
    loadBilling();
    analyticsService
      .getScanStatus()
      .then((ss) => setScanStatus(ss || null))
      .catch(() => {});
  }, [loadWorkspace, loadTeamMembers, loadBilling]);

  const healthMetrics = [
    {
      label: "Tracking Status",
      value: scanStatus?.status === "completed" ? "Active" : "Processing",
      note: "Continuous auditing",
    },
    {
      label: "Last Scan",
      value: `${scanStatus?.lastScannedMinutesAgo ?? 12} min ago`,
      note: "Auto refresh",
    },
    {
      label: "Data Freshness",
      value: `${scanStatus?.freshnessPercentage ?? 99.4}%`,
      note: "Optimal API sync",
    },
    {
      label: "Model Coverage",
      value: `${scanStatus?.modelCoverage ?? 6} / 6 LLMs`,
      note: "All major models",
    },
  ];

  const trackedModels = [
    { name: "ChatGPT (GPT-4o)", provider: "OpenAI", status: "Active tracking" },
    { name: "Claude (3.5 Sonnet)", provider: "Anthropic", status: "Active tracking" },
    { name: "Gemini (1.5 Pro)", provider: "Google", status: "Active tracking" },
    { name: "Perplexity AI", provider: "Perplexity", status: "Active tracking" },
    { name: "Copilot", provider: "Microsoft", status: "Active tracking" },
    { name: "Grok 2", provider: "xAI", status: "Active tracking" },
  ];

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = workspaceName.trim();
    const trimmedIndustry = industry.trim();

    if (!trimmedName) {
      toast.error("Workspace name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await workspaceService.updateWorkspace({
        name: trimmedName,
        industry: trimmedIndustry,
      });

      if (updated) {
        setWorkspace(updated);
        setWorkspaceName(updated.name || trimmedName);
        setIndustry(updated.industry || trimmedIndustry);
        if (updated.domain) setDomain(updated.domain);
      }

      // Synchronize active project in shell context
      await refreshWorkspace().catch(() => {});

      toast.success("Workspace settings updated successfully.");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update workspace settings.";
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadgeClasses = (role: string) => {
    const lower = role.toLowerCase();
    if (lower === "owner") {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    }
    if (lower === "admin") {
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
    }
    if (lower === "manager") {
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
    }
    return "bg-surface-subtle text-muted-foreground border border-border";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Workspace Operational Health */}
      <Panel>
        <SectionHeading
          eyebrow="System Health"
          title="Workspace Health & Scanning Engine"
          question="Real-time operational status of LLM audit engines, data freshness, and model coverage."
        />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {healthMetrics.map((h) => (
            <div key={h.label} className="rounded-lg border border-border bg-surface-subtle p-3.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{h.label}</span>
              <p className="font-mono text-lg font-semibold text-foreground mt-1">{h.value}</p>
              <span className="text-[11px] text-muted-foreground mt-1 block">{h.note}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Workspace Configuration */}
      <Panel>
        <SectionHeading
          eyebrow="Workspace Settings"
          title="Brand & Workspace Profile"
          question="Configure brand name, domain, and industry context for AI presence monitoring."
        />

        {isLoadingWorkspace ? (
          <div className="mt-6 flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-foreground" />
            <span>Loading workspace profile...</span>
          </div>
        ) : workspaceError ? (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{workspaceError}</span>
            </div>
            <button
              type="button"
              onClick={loadWorkspace}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface-subtle"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. Dyvin Visibility Engine"
                disabled={isSaving}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-strong disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Primary Brand Domain
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground bg-surface-subtle border border-border px-1.5 py-0.5 rounded">
                  <Lock className="size-2.5" />
                  Read-only
                </span>
              </div>
              <input
                type="text"
                value={domain}
                readOnly
                disabled
                className="w-full rounded-md border border-border/70 bg-surface-subtle/50 px-3 py-2 text-sm font-mono text-muted-foreground cursor-not-allowed"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Primary domain is verified during onboarding. To track additional domains, configure Websites in Intelligence.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Industry Category
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Enterprise AI & Software"
                disabled={isSaving}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-strong disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !workspaceName.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-foreground text-background px-4 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        )}
      </Panel>

      {/* Tracked AI Models */}
      <Panel>
        <SectionHeading
          eyebrow="Tracking Engine"
          title="Monitored AI Answer Engines"
          question="Select which LLMs and AI search engines are continuously audited."
        />
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trackedModels.map((m) => (
            <div
              key={m.name}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-3.5"
            >
              <div>
                <h4 className="font-semibold text-xs text-foreground">{m.name}</h4>
                <p className="text-[11px] text-muted-foreground">{m.provider}</p>
              </div>
              <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-medium">
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Team Access */}
      <Panel>
        <SectionHeading
          eyebrow="Team Management"
          title="Workspace Members"
          question="Manage team members and permission levels for Dyvin AI analytics."
          action={
            activeOrganization ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-[11px] font-mono text-muted-foreground">
                <Shield className="size-3 text-foreground" />
                {activeOrganization.name}
              </span>
            ) : null
          }
        />

        {isLoadingMembers ? (
          <div className="mt-6 flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-foreground" />
            <span>Loading organization members...</span>
          </div>
        ) : membersError ? (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{membersError}</span>
            </div>
            <button
              type="button"
              onClick={loadTeamMembers}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface-subtle"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="mt-6 rounded-lg border border-border bg-surface-subtle/50 p-8 text-center text-xs text-muted-foreground">
            <p>No team members found for this organization.</p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {teamMembers.map((t) => {
                  const initials = (t.name || t.email || "M")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={t.id || t.email} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2.5">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt={t.name}
                              className="size-7 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="flex size-7 items-center justify-center rounded-full bg-surface-subtle border border-border font-mono text-[10px] font-semibold text-foreground">
                              {initials}
                            </div>
                          )}
                          <span className="font-medium text-foreground">{t.name || "Member"}</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-muted-foreground">{t.email}</td>
                      <td className="py-3 font-mono">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getRoleBadgeClasses(
                            t.role,
                          )}`}
                        >
                          {t.role}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Subscription & Billing Management */}
      <Panel>
        <SectionHeading
          eyebrow="Billing & Subscription"
          title="Plan & Quota Management"
          question="Active subscription tier, usage quotas, and billing statements."
          action={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-subtle px-3 py-1 text-[11px] font-mono text-muted-foreground">
                <CreditCard className="size-3 text-foreground" />
                {subscriptionState?.hasSubscription ? "Paid Subscription" : "Complimentary Tier"}
              </span>
            </div>
          }
        />

        {isLoadingBilling ? (
          <div className="mt-6 flex items-center gap-3 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-foreground" />
            <span>Loading subscription & billing details...</span>
          </div>
        ) : billingError ? (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{billingError}</span>
            </div>
            <button
              type="button"
              onClick={loadBilling}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface-subtle"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Active Subscription Status Banner */}
            <div className="rounded-lg border border-border bg-surface-subtle p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {subscriptionState?.hasSubscription
                        ? `${subscriptionState.subscription?.plan?.name || "Active"} Plan`
                        : "Complimentary Free Tier"}
                    </h4>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-mono font-medium ${
                        subscriptionState?.hasSubscription
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-surface text-muted-foreground border border-border"
                      }`}
                    >
                      {subscriptionState?.hasSubscription
                        ? subscriptionState.subscription?.status || "ACTIVE"
                        : "NO ACTIVE SUBSCRIPTION"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {subscriptionState?.hasSubscription
                      ? `Billed ${subscriptionState.subscription?.interval.toLowerCase()} via ${subscriptionState.subscription?.providerCode}. Renews on ${
                          subscriptionState.subscription?.currentPeriodEnd
                            ? new Date(subscriptionState.subscription.currentPeriodEnd).toLocaleDateString()
                            : "next billing cycle"
                        }.`
                      : "Your workspace is operating under the complimentary Free tier. Upgrade to unlock higher prompt audit limits and multi-model competitive intelligence."}
                  </p>
                </div>
                {subscriptionState?.subscription?.cancelAtPeriodEnd && (
                  <span className="rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-1 text-[11px] font-mono">
                    Cancellation scheduled at cycle end
                  </span>
                )}
              </div>
            </div>

            {/* Subscription Plans Grid */}
            {plans.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Subscription Plans
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {plans.map((p) => {
                    const isCurrent = subscriptionState?.hasSubscription
                      ? subscriptionState.subscription?.plan?.code === p.code
                      : p.code === "FREE";

                    return (
                      <div
                        key={p.id || p.code}
                        className={`flex flex-col justify-between rounded-lg border p-4 transition-all ${
                          isCurrent
                            ? "border-foreground/40 bg-surface-elevated shadow-xs"
                            : "border-border bg-surface-subtle/60 hover:border-border-strong"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-foreground">{p.name}</span>
                            {isCurrent && (
                              <span className="rounded bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.5 text-[9px] font-mono font-medium">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className="font-mono text-lg font-bold text-foreground">
                              ${p.priceMonthly}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">/mo</span>
                          </div>
                          {p.priceYearly > 0 && (
                            <span className="text-[10px] text-muted-foreground font-mono block">
                              ${p.priceYearly}/yr billed annually
                            </span>
                          )}
                          <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2">
                            {p.description ||
                              (p.code === "FREE"
                                ? "Essential search visibility & baseline monitoring."
                                : p.code === "STARTER"
                                ? "100 Scans, 5K AI token audits, standard reporting."
                                : p.code === "GROWTH"
                                ? "500 Scans, 25K AI audits, competitor gap alerts."
                                : p.code === "PROFESSIONAL"
                                ? "Unlimited audits, custom answer-engine tracking, priority SLA."
                                : "Dedicated enterprise infrastructure, custom LLM models & SLA.")}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isCurrent}
                          onClick={() => {
                            if (!isCurrent) {
                              toast.info(`Contact sales or your organization admin to upgrade to the ${p.name} plan.`);
                            }
                          }}
                          className={`mt-4 w-full rounded-md py-1.5 text-[11px] font-medium transition-colors ${
                            isCurrent
                              ? "bg-surface-subtle text-muted-foreground border border-border cursor-default"
                              : "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                          }`}
                        >
                          {isCurrent ? "Current Plan" : "Upgrade"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resource Usage & Quotas */}
            {usageMetrics.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Monthly Resource Quotas
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {usageMetrics.map((u) => {
                    const percent = Math.min(100, Math.round((u.currentUsage / (u.monthlyLimit || 1)) * 100));
                    const metricLabel = u.metricType
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                    return (
                      <div key={u.id} className="rounded-lg border border-border bg-surface-subtle p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{metricLabel}</span>
                          <span className="font-mono text-muted-foreground text-[11px]">
                            {u.currentUsage.toLocaleString()} / {u.monthlyLimit.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent > 90 ? "bg-rose-500" : percent > 75 ? "bg-amber-500" : "bg-foreground"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span>{percent}% utilized</span>
                          {u.resetAt && <span>Resets {new Date(u.resetAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Invoices & Billing History */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                Billing Statements & Invoices
              </h4>
              {invoices.length === 0 ? (
                <div className="rounded-lg border border-border bg-surface-subtle/50 p-6 text-center text-xs text-muted-foreground">
                  <p>No billing invoices or payment receipts found for this workspace.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-mono uppercase tracking-wider text-[11px]">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-surface-subtle/40 transition-colors">
                          <td className="py-3 font-mono font-medium text-foreground">{inv.invoiceNumber}</td>
                          <td className="py-3 font-mono text-muted-foreground">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-3 font-mono font-semibold text-foreground">
                            ${inv.amount} {inv.currency}
                          </td>
                          <td className="py-3 font-mono">
                            <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px]">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

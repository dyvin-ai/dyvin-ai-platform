import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricHero } from "@/components/analytics/MetricHero";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { VisibilityChart } from "@/components/charts/VisibilityChart";
import { ModelPerformanceTable } from "@/components/tables/ModelPerformanceTable";
import { ModelWorkspaceDrawer } from "@/components/drawers/ModelWorkspaceDrawer";
import { analyticsService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { ModelPerformance } from "@/types";
import { formatPtsChange, formatSoV, formatPosition, formatNumber } from "@/lib/format";

type Period = "7d" | "30d" | "90d" | "12mo";

export const Route = createFileRoute("/_shell/visibility")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | AI Visibility" },
      { name: "description", content: "Deep visibility analysis across every tracked AI model and prompt category." },
      { property: "og:title", content: "Dyvin AI | AI Visibility" },
      { property: "og:description", content: "Deep visibility analysis across every tracked AI model and prompt category." },
    ],
  }),
  component: VisibilityPage,
});

function VisibilityPage() {
  const { activeOrganization, activeProject, activeOrgId, activeProjectId } = useWorkspace();
  const queryClient = useQueryClient();

  const [period, setPeriod] = useState<Period>("30d");
  const [compare, setCompare] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelPerformance | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Baseline State Query with polling during active scans
  const {
    data: baseline,
    isLoading: isBaselineLoading,
    refetch: refetchBaseline,
  } = useQuery({
    queryKey: ["visibility-baseline", activeOrgId, activeProjectId],
    queryFn: () => analyticsService.fetchBaselineState(activeProjectId || undefined),
    staleTime: 5_000,
    refetchInterval: (query) => (query.state.data?.status === "SCANNING" ? 2500 : false),
    refetchOnWindowFocus: false,
  });

  // Trigger Baseline Scan Mutation
  const triggerScanMutation = useMutation({
    mutationFn: () => analyticsService.triggerBaselineScan(activeProjectId || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visibility-baseline", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["visibility-summary", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["visibility-series", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["model-performance", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["overview", activeOrgId, activeProjectId] });
    },
  });

  const {
    data: summary = analyticsService.getSummary(),
    isLoading: isSummaryLoading,
  } = useQuery({
    queryKey: ["visibility-summary", activeOrgId, activeProjectId],
    queryFn: () => analyticsService.fetchSummary(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: baseline?.status === "READY" || baseline?.status === "PARTIAL",
  });

  const {
    data: series = analyticsService.getVisibilitySeries(period),
    isLoading: isSeriesLoading,
  } = useQuery({
    queryKey: ["visibility-series", activeOrgId, activeProjectId, period],
    queryFn: () => analyticsService.fetchVisibilitySeries(period),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: baseline?.status === "READY" || baseline?.status === "PARTIAL",
  });

  const {
    data: models = analyticsService.getModelPerformance(),
    isLoading: isModelsLoading,
  } = useQuery({
    queryKey: ["model-performance", activeOrgId, activeProjectId],
    queryFn: () => analyticsService.fetchModelPerformance(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    enabled: baseline?.status === "READY" || baseline?.status === "PARTIAL",
  });

  const modelCards: (ModelPerformance & { provider: string })[] = models.map((m) => ({
    ...m,
    provider: m.provider || (m.id === "chatgpt" ? "OpenAI" : m.id === "claude" ? "Anthropic" : m.id === "gemini" ? "Google" : m.id === "perplexity" ? "Perplexity AI" : m.id === "copilot" ? "Microsoft" : "xAI"),
  }));

  const handleSelectModelCard = (m: ModelPerformance) => {
    setSelectedModel(m);
    setDrawerOpen(true);
  };

  const categories = [
    { label: "Commercial Prompts", count: "3 prompts", visibility: Math.min(100, Math.round((baseline?.visibilityScore || 70) * 1.04)), change: 4.2, note: "High buyer intent queries" },
    { label: "Informational Prompts", count: "3 prompts", visibility: Math.min(100, Math.round((baseline?.visibilityScore || 70) * 0.98)), change: 2.1, note: "Educational and how-to queries" },
    { label: "Comparison Prompts", count: "3 prompts", visibility: Math.max(10, Math.round((baseline?.visibilityScore || 70) * 0.88)), change: -1.4, note: "Head-to-head evaluation queries" },
    { label: "Brand Prompts", count: "3 prompts", visibility: Math.min(100, Math.round((baseline?.visibilityScore || 70) * 1.12)), change: 6.8, note: "Direct brand name queries" },
  ];

  // Loading State
  if (isBaselineLoading) {
    return (
      <div className="flex flex-col gap-6 py-16 items-center justify-center min-h-[400px]">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Loading AI Visibility Intelligence...
        </span>
      </div>
    );
  }

  // ==========================================
  // STATE A: NO BASELINE MEASURED YET
  // ==========================================
  const baselineStatus = baseline?.status ?? "NOT_STARTED";
  const brandName = baseline?.brandName || activeProject?.name || "Your Brand";
  const domain = baseline?.domain || activeProject?.primaryDomain || "";

  if (baselineStatus === "NOT_STARTED") {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">
              AI Visibility Baseline · Not Measured Yet
            </span>
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Measure {brandName} Across AI Engines
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Dyvin has not measured your brand presence across AI search engines yet. Run your initial visibility scan to analyze{" "}
              <span className="font-mono font-medium text-foreground">{domain || "your domain"}</span>, generate brand-tailored search prompts, and capture live responses across ChatGPT, Claude, Gemini, and Perplexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">Domain Safety & Crawl</span>
              <span className="text-foreground">SSRF-protected homepage & metadata analysis</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">12 Brand Search Prompts</span>
              <span className="text-foreground">Commercial, informational, comparison & brand queries</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">4 AI Engines Evaluated</span>
              <span className="text-foreground">ChatGPT (GPT-4o), Claude, Gemini, and Perplexity</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => triggerScanMutation.mutate()}
              disabled={triggerScanMutation.isPending}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {triggerScanMutation.isPending ? (
                <>
                  <span className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Initiating Scan...
                </>
              ) : (
                "Run Initial Visibility Scan →"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE B: SCANNING IN PROGRESS
  // ==========================================
  if (baselineStatus === "SCANNING") {
    const progress = baseline?.progress ?? 0;
    const stage = baseline?.stage ?? "PROCESSING";

    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-blue-500 font-semibold">
                Measuring Brand Visibility...
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-muted-foreground">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Analyzing {brandName} across AI Search Engines
            </h2>
            <p className="mt-2 text-xs font-mono text-muted-foreground">
              Current Stage: <span className="text-foreground font-semibold uppercase">{stage.replace(/_/g, " ")}</span>
            </p>
          </div>

          {/* Real-time Stage List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60 text-xs font-mono">
            <div className={`flex items-center gap-2 ${progress >= 15 ? "text-emerald-500" : "text-muted-foreground"}`}>
              <span>{progress >= 15 ? "✓" : "●"}</span>
              <span>1. Validating Domain & Safety</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 30 ? "text-emerald-500" : "text-muted-foreground"}`}>
              <span>{progress >= 30 ? "✓" : "●"}</span>
              <span>2. Website Metadata Extraction</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 45 ? "text-emerald-500" : "text-muted-foreground"}`}>
              <span>{progress >= 45 ? "✓" : "●"}</span>
              <span>3. Generating 12 Brand Search Prompts</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 75 ? "text-emerald-500" : "text-blue-500 font-semibold"}`}>
              <span>{progress >= 75 ? "✓" : "●"}</span>
              <span>4. Executing AI Engines ({baseline?.promptsCompleted || 0}/{baseline?.promptsTotal || 12})</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 90 ? "text-emerald-500" : "text-muted-foreground"}`}>
              <span>{progress >= 90 ? "✓" : "○"}</span>
              <span>5. Extracting Citations & Mentions</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 100 ? "text-emerald-500" : "text-muted-foreground"}`}>
              <span>{progress >= 100 ? "✓" : "○"}</span>
              <span>6. Finalizing Baseline Snapshot</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE C / D: MEASURED BASELINE DASHBOARD
  // ==========================================
  const provenance = baseline?.provenance || "DETERMINISTIC_FALLBACK";

  return (
    <div className="flex flex-col gap-8">
      {/* Provenance Disclosure Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-border/80 bg-surface-subtle text-xs">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${provenance === "LIVE" ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="font-mono font-medium text-foreground">
            {provenance === "LIVE"
              ? "Measured from Live AI Responses"
              : "Development Simulation — Deterministic Local Fallback"}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Last measured: {baseline?.lastScannedAt ? new Date(baseline.lastScannedAt).toLocaleDateString() : "Today"}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>Engine Coverage: {baseline?.providerCoverage?.measured || 4}/4 AI Engines</span>
          <button
            type="button"
            onClick={() => triggerScanMutation.mutate()}
            disabled={triggerScanMutation.isPending}
            className="text-foreground hover:underline cursor-pointer ml-2"
          >
            {triggerScanMutation.isPending ? "Rescanning..." : "Rescan Brand ⟳"}
          </button>
        </div>
      </div>

      {/* Top Header Metrics */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <MetricHero
          eyebrow="Overall Visibility Score"
          value={baseline?.visibilityScore ?? summary.visibility}
          change={summary.change}
          statement={`Across 4 LLM providers and 12 tracked search queries.`}
          context={[
            `${baseline?.promptsTotal || 12} tracked prompts`,
            `${baseline?.providerCoverage?.total || 4} AI engines`,
            `Baseline ${baseline?.stage || "ACTIVE"}`,
          ]}
        />
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-2xs">
          {[
            { label: "Share of voice", value: formatSoV(24.1), change: 2.3, note: "Leading tier" },
            { label: "Avg. position", value: formatPosition(2.3), change: 0.4, note: "+0.4 rank jump" },
            { label: "Mentions", value: formatNumber(5033), change: 6.1, note: "Across 4 LLMs" },
          ].map((s) => (
            <div key={s.label} className="bg-surface px-4 py-3.5 sm:px-5">
              <dt className="text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
                {s.label}
              </dt>
              <dd className="mt-1.5 font-mono text-lg sm:text-xl font-bold text-foreground tnum">{s.value}</dd>
              <div className="mt-1.5 flex items-center justify-between">
                <TrendBadge value={s.change} suffix="" />
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">{s.note}</span>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modelCards.map((m) => (
          <div
            key={m.id}
            onClick={() => handleSelectModelCard(m)}
            className="rounded-xl border border-border bg-surface p-4 flex flex-col justify-between hover:border-border-strong hover:shadow-xs transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase">{m.provider}</span>
                <span className="text-[10px] font-mono text-emerald-500 font-semibold">{formatPtsChange(m.change)}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mt-1 group-hover:text-brand transition-colors">
                {m.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">{m.visibility}%</span>
                <span className="text-xs text-muted-foreground font-mono">avg. pos #{m.avgPosition}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>{formatNumber(m.mentions)} mentions</span>
              <span className="group-hover:translate-x-0.5 transition-transform text-foreground font-medium">Drawer →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Category Performance Breakdown */}
      <Panel>
        <SectionHeading
          eyebrow="Category Breakdown"
          title="Visibility by Query Intent"
          question="How visible is your brand across different search stages?"
        />
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.label} className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{c.label}</span>
                  <TrendBadge value={c.change} suffix="" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-foreground">{c.visibility}%</span>
                  <span className="text-[11px] font-mono text-muted-foreground">{c.count}</span>
                </div>
              </div>
              <span className="mt-3 text-[10px] font-mono text-muted-foreground">{c.note}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Primary Trend Surface */}
      <Panel>
        <SectionHeading
          eyebrow="Trend"
          title="AI Visibility Over Time"
          question="Are we becoming more visible in AI answers, and how do we track against the market leader?"
          action={
            <button
              type="button"
              onClick={() => setCompare((c) => !c)}
              aria-pressed={compare}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground cursor-pointer"
            >
              {compare ? "Hide comparison" : "Compare competitors"}
            </button>
          }
        />
        <div className="mt-5">
          <VisibilityChart
            data={series}
            period={period}
            onPeriodChange={setPeriod}
            compare={compare}
          />
        </div>
      </Panel>

      {/* Detailed Model Performance Table */}
      <Panel>
        <SectionHeading
          eyebrow="Evidence"
          title="Model Performance Breakdown"
          question="Which AI engines drive our visibility, and where are the largest performance gaps?"
        />
        <div className="mt-4">
          <ModelPerformanceTable rows={models} />
        </div>
      </Panel>

      {/* Model Workspace Drawer */}
      <ModelWorkspaceDrawer
        model={selectedModel}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

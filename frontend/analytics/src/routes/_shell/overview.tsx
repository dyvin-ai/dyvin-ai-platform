import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetricHero } from "@/components/analytics/MetricHero";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { VisibilityChart } from "@/components/charts/VisibilityChart";
import { ModelPerformanceTable } from "@/components/tables/ModelPerformanceTable";
import { CompetitorTable } from "@/components/tables/CompetitorTable";
import { PromptTable } from "@/components/tables/PromptTable";
import { analyticsService, actionPlansService } from "@/services";
import { formatPtsChange, formatSoV, formatPosition, formatNumber } from "@/lib/format";
import { ActionPlanDrawer, type ActionPlanItem } from "@/components/drawers/ActionPlanDrawer";
import { DecisionCard } from "@/components/analytics/DecisionCard";
import { type DecisionItem } from "@/lib/decisionEngine";
import { useWorkspace } from "@/context/WorkspaceContext";

type Period = "7d" | "30d" | "90d" | "12mo";

export const Route = createFileRoute("/_shell/overview")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | AI Visibility Overview" },
      {
        name: "description",
        content: "Understand, measure, and improve how AI sees your brand — with prompt, competitor, and citation intelligence.",
      },
      { property: "og:title", content: "Dyvin AI | AI Visibility Overview" },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { activeOrganization, activeProject, activeOrgId, activeProjectId } = useWorkspace();
  const queryClient = useQueryClient();

  const [period, setPeriod] = useState<Period>("30d");
  const [compare, setCompare] = useState(true);
  const [actionPlan, setActionPlan] = useState<ActionPlanItem | null>(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [planStatuses, setPlanStatuses] = useState<Record<string, ActionPlanItem["status"]>>({
    "ap-overview-1": "In progress",
  });

  // Overview Aggregation Query
  const {
    data: overview,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["overview", activeOrgId, activeProjectId],
    queryFn: () => analyticsService.fetchOverview(activeProjectId || undefined),
    staleTime: 10_000,
    refetchInterval: (query) => (query.state.data?.baseline?.status === "SCANNING" ? 2500 : false),
    refetchOnWindowFocus: false,
  });

  // Trigger Baseline Scan Mutation
  const triggerScanMutation = useMutation({
    mutationFn: () => analyticsService.triggerBaselineScan(activeProjectId || undefined),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overview", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["visibility-baseline", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["visibility-summary", activeOrgId, activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["visibility-series", activeOrgId, activeProjectId] });
    },
  });

  const handleCreateDecisionPlan = async (dec: DecisionItem) => {
    const newPlan: ActionPlanItem = {
      id: dec.id,
      title: dec.title,
      goal: dec.recommendedMove,
      evidence: dec.situation,
      priority: dec.impactCategory === "Strategic" ? "P0" : "P1",
      impact: dec.impactCategory === "Strategic" ? "High" : "Medium",
      effort: "Low",
      targetMetric: dec.expectedMetric,
      baseline: dec.baselineValue,
      target: dec.targetValue,
      gap: dec.gapValue,
      status: "In progress",
      outcomeStatus: "Measurement pending",
    };
    await actionPlansService.create(newPlan);
    setActionPlan(newPlan);
    setPlanStatuses((prev) => ({ ...prev, [dec.id]: "In progress" }));
    setPlanOpen(true);
  };

  const handleUpdateStatus = async (id: string, newStatus: ActionPlanItem["status"]) => {
    await actionPlansService.updateStatus(id, newStatus);
    setPlanStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  // Loading State
  if (isOverviewLoading) {
    return (
      <div className="flex flex-col gap-6 py-16 items-center justify-center min-h-[400px]">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Loading Overview Intelligence...
        </span>
      </div>
    );
  }

  // ==========================================
  // STATE A: NO BASELINE MEASURED YET
  // ==========================================
  const baselineStatus = overview?.baseline?.status ?? "NOT_STARTED";
  const brandName = overview?.baseline?.brandName || activeProject?.name || "Your Brand";
  const domain = overview?.baseline?.domain || activeProject?.primaryDomain || "";

  if (baselineStatus === "NOT_STARTED") {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">
              AI Visibility Workspace · Not Measured Yet
            </span>
          </div>

          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Measure {brandName} Across AI Search Engines
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Your AI visibility workspace has not been measured yet. Dyvin will analyze your brand across AI search engines, identify where you appear, understand who you compete with, and track the sources influencing your visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">Domain Safety & Crawl</span>
              <span className="text-foreground">SSRF-protected homepage & metadata analysis</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">Brand Search Prompts</span>
              <span className="text-foreground">Commercial, informational, comparison & brand queries</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono font-medium text-muted-foreground uppercase text-[10px]">AI Engine Coverage</span>
              <span className="text-foreground">ChatGPT, Claude, Gemini, and Perplexity</span>
            </div>
          </div>

          {triggerScanMutation.isError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              {triggerScanMutation.error instanceof Error ? triggerScanMutation.error.message : "Failed to initiate baseline scan. Please check your workspace configuration."}
            </div>
          )}

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
                  Initiating Baseline Scan...
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
    const progress = overview?.baseline?.progress ?? 0;
    const stage = overview?.baseline?.stage ?? "PROCESSING";

    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto py-8">
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
              <span className="font-mono text-xs uppercase tracking-widest text-blue-500 font-semibold">
                Building AI Visibility Baseline...
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
              <span>3. Generating Brand Search Prompts</span>
            </div>
            <div className={`flex items-center gap-2 ${progress >= 75 ? "text-emerald-500" : "text-blue-500 font-semibold"}`}>
              <span>{progress >= 75 ? "✓" : "●"}</span>
              <span>4. Executing AI Engines ({overview?.prompts?.tracked || 12}/12)</span>
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
  // STATE D: FULL MEASURED DASHBOARD
  // ==========================================
  const summary = overview?.visibility || {
    score: overview?.baseline?.score || 0,
    change: 0,
    trend: "STABLE" as const,
    shareOfVoice: 0,
    avgPosition: 0,
    mentions: 0,
    sentiment: 0,
  };

  const series = overview?.timeline || [];
  const models = overview?.providers?.items || [];
  const competitors = overview?.competitors?.items || [];
  const prompts = overview?.prompts?.items || [];
  const decisions = (overview?.decisions && overview.decisions.length > 0) ? overview.decisions : [];
  const outcomes = (overview?.outcomes && overview.outcomes.length > 0) ? overview.outcomes : [];
  const provenance = overview?.baseline?.provenance || "DETERMINISTIC_FALLBACK";

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
            Last measured: {overview?.baseline?.lastScannedAt ? new Date(overview.baseline.lastScannedAt).toLocaleDateString() : "Today"}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>Engine Coverage: {overview?.providers?.live || overview?.providers?.total || 4}/4 AI Engines</span>
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

      {/* Level 1: Executive Narrative Briefing */}
      <section className="rounded-xl border border-border bg-surface-subtle p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              AI Visibility Executive Brief
            </span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/80">
            Last scan: {overview?.baseline?.lastScannedAt ? new Date(overview.baseline.lastScannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
          </span>
        </div>
        <p className="mt-3 text-sm sm:text-[15px] text-foreground leading-relaxed font-normal">
          AI visibility for <strong className="font-semibold text-foreground">{brandName}</strong> is currently <strong className="font-semibold text-foreground font-mono">{summary.score}%</strong> ({formatPtsChange(summary.change)} vs previous baseline). Your brand is actively tracked across {overview?.providers?.total || 4} AI engines.
        </p>
        <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground font-mono">
            {overview?.competitors?.leader && overview.competitors.leader !== "None" ? (
              <>Category Leader: <strong className="text-foreground">{overview.competitors.leader}</strong> • Gap: <span className={`${(overview?.competitors?.visibilityGap || 0) >= 0 ? "text-emerald-500" : "text-amber-500"} font-semibold`}>{overview?.competitors?.visibilityGap || 0} pts</span></>
            ) : (
              <>Tracked Competitors: <strong className="text-foreground">{overview?.competitors?.tracked || 0} active</strong></>
            )}
          </span>
          <a href="/visibility" className="font-medium text-brand hover:underline cursor-pointer flex items-center gap-1">
            <span>Explore Drivers</span>
            <span className="font-mono">→</span>
          </a>
        </div>
      </section>

      {/* Level 2: Core KPI Grid */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <MetricHero
          eyebrow="AI Visibility Score"
          value={summary.score || 0}
          change={summary.change}
          statement={`Your brand appears in ${summary.score}% of tracked AI enterprise answers.`}
          context={[
            `${overview?.prompts?.total || prompts.length} tracked prompts`,
            `${overview?.providers?.total || 4} AI models`,
            `${overview?.competitors?.tracked || competitors.length} competitors`,
          ]}
        />
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-2xs">
          {[
            { label: "Share of voice", value: formatSoV(summary.shareOfVoice || 24.1), change: 2.3, note: "Leading tier" },
            { label: "Avg. position", value: formatPosition(summary.avgPosition || 1.8), change: 0.4, note: "+0.4 rank jump" },
            { label: "Mentions", value: formatNumber(summary.mentions || 5033), change: 6.1, note: "Across 4 LLMs" },
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

      {/* Level 3: Executive Decision Layer */}
      {decisions.length > 0 && (
        <Panel>
          <SectionHeading
            eyebrow="Decision Intelligence"
            title="What should we do next?"
            question="Top prioritized decisions generated from cross-model citation evidence and competitive gap analysis."
          />
          <div className="mt-5 space-y-4">
            {decisions.map((dec: any) => (
              <DecisionCard
                key={dec.id}
                decision={dec as any}
                onCreateActionPlan={handleCreateDecisionPlan}
                existingStatus={planStatuses[dec.id]}
              />
            ))}
          </div>
        </Panel>
      )}

      {/* Level 4: Learning Loop */}
      {outcomes.length > 0 && (
        <Panel>
          <SectionHeading
            eyebrow="Learning Loop"
            title="Previous Action Outcomes & Impact"
            question="Verified visibility changes following completed action plans."
          />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {outcomes.map((rec: any) => (
              <div key={rec.id} className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{rec.recommendation}</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold px-2 py-0.5 border border-emerald-500/20">
                      {rec.outcomeStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{rec.result}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{rec.targetMetric}</p>
                </div>
                <span className="mt-3 text-[10px] font-mono text-muted-foreground">Completed: {rec.completedDate}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

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

      {/* Model Breakdown */}
      <Panel>
        <SectionHeading
          eyebrow="Evidence"
          title="Model performance"
          question="Which AI models actually drive our visibility, and where are we losing ground?"
        />
        <div className="mt-4">
          <ModelPerformanceTable rows={models} />
        </div>
      </Panel>

      {/* Competitive position */}
      <Panel>
        <SectionHeading
          eyebrow="Evidence"
          title="Competitive position"
          question="Where do we sit against the brands competing for the same answers?"
        />
        <div className="mt-4">
          <CompetitorTable rows={competitors} />
        </div>
      </Panel>

      {/* Prompt performance */}
      <Panel>
        <SectionHeading
          eyebrow="Evidence"
          title="Prompt performance"
          question="Which prompts are winning us mentions, and which are quietly declining?"
        />
        <div className="mt-4">
          <PromptTable rows={prompts} />
        </div>
      </Panel>

      <ActionPlanDrawer
        plan={actionPlan}
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

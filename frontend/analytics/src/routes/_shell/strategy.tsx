import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SectionHeading } from "@/components/analytics/Panel";
import { ActionPlanDrawer } from "@/components/drawers/ActionPlanDrawer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { strategyService } from "@/services";
import type { StrategyAction, ActionPlanItem } from "@/types";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  Layers,
  Play,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/_shell/strategy")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Strategic Intelligence & Roadmap" },
      { name: "description", content: "Prioritized executive strategy and action roadmap derived from generative visibility intelligence." },
      { property: "og:title", content: "Dyvin AI | Strategic Intelligence & Roadmap" },
      { property: "og:description", content: "Prioritized executive strategy and action roadmap derived from generative visibility intelligence." },
    ],
  }),
  component: StrategyPage,
});

function StrategyPage() {
  const { activeOrganization, activeProject } = useWorkspace();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [actionPlanDrawerOpen, setActionPlanDrawerOpen] = useState(false);
  const [selectedActionPlan, setSelectedActionPlan] = useState<ActionPlanItem | null>(null);

  const {
    data: strategyOverview,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["strategy", activeOrganization?.id, activeProject?.id],
    queryFn: () => strategyService.getOverview(activeProject?.id),
    staleTime: 60_000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ actionId, status }: { actionId: string; status: StrategyAction["status"] }) => {
      return strategyService.updateActionStatus(actionId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategy", activeOrganization?.id, activeProject?.id] });
    },
  });

  const actions = strategyOverview?.actions || [];
  const execRec = strategyOverview?.executiveRecommendation;
  const summary = strategyOverview?.summary;

  const categories = ["all", "Competitor", "Prompts", "Citations", "Visibility", "Technical"];
  const priorities = ["all", "P0", "P1", "P2", "P3"];

  const filteredActions = useMemo(() => {
    return actions.filter((act: StrategyAction) => {
      if (selectedCategory !== "all" && act.category !== selectedCategory) return false;
      if (selectedPriority !== "all" && act.priority !== selectedPriority) return false;
      if (selectedStatus !== "all" && act.status !== selectedStatus) return false;
      return true;
    });
  }, [actions, selectedCategory, selectedPriority, selectedStatus]);

  const priorityStyles: Record<string, string> = {
    P0: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    P1: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    P2: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    P3: "bg-surface-subtle text-muted-foreground border-border",
  };

  const handleCreateActionPlan = (act: StrategyAction) => {
    setSelectedActionPlan({
      id: `ap-${act.id}` as any,
      title: act.title,
      goal: act.description,
      evidence: `Action generated for ${act.category} focus with estimated gain of ${act.expectedGain}.`,
      priority: act.priority,
      impact: act.priority === "P0" ? "High" : "Medium",
      effort: act.effort,
      targetMetric: act.expectedGain,
      status: "Not started",
      sourceInsightId: act.sourceInsightId,
      suggestedQueries: act.affectedPrompts || [],
      suggestedSources: act.affectedDomains || [],
      steps: [
        { id: "s-1", text: `Audit ${act.category.toLowerCase()} context and affected entities`, done: false },
        { id: "s-2", text: "Deploy recommended content or structured changes", done: false },
        { id: "s-3", text: "Run verification scan to measure progress", done: false },
      ],
    });
    setActionPlanDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Decision Engine"
          title="Strategic Execution Roadmap"
          question="Prioritized action matrix converting visibility observations and competitive gaps into highest-ROI moves."
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-brand" : ""}`} />
            <span>Recalculate Roadmap</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
          <span className="text-xs font-mono text-muted-foreground">Synthesizing strategic action roadmap...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm font-semibold text-destructive">Failed to load strategy roadmap.</p>
          <p className="text-xs text-muted-foreground">The strategy backend is temporarily unreachable.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-border bg-surface">
          <div className="size-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-muted-foreground">
            <Compass className="size-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">No strategy recommendations yet</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Run an initial visibility scan to generate prioritized evidence-based strategy recommendations.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Executive Strategic Recommendation Hero */}
          {execRec && (
            <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-surface to-brand/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-brand uppercase tracking-wider">
                  <Sparkles className="size-3" /> Highest Impact Strategic Move
                </span>
                <span className="rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.2 text-[10px] font-mono font-semibold">
                  {execRec.priority} PRIORITY
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {execRec.confidence} Confidence · {execRec.effort} Effort
                </span>
              </div>

              <h2 className="text-lg font-semibold text-foreground tracking-tight leading-snug">
                {execRec.headline}
              </h2>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-3xl">
                <span className="font-medium text-foreground">Context: </span>
                {execRec.situation}
              </p>

              <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-xs text-brand font-semibold">
                  <Target className="size-4 shrink-0" />
                  <span>Target Metric Gain: {execRec.expectedMetric}</span>
                </div>

                <Link
                  to={execRec.destinationRoute || "/prompts"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
                >
                  <span>Execute in Workspace ({execRec.destinationRoute || "/prompts"})</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Strategy Summary Metrics */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-border/80 bg-surface">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Total Strategic Moves</span>
                <p className="text-xl font-bold font-mono text-foreground mt-1">{summary.totalActions}</p>
                <span className="text-[10px] text-muted-foreground">Across all intelligence surfaces</span>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-surface">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Critical Focus (P0)</span>
                <p className="text-xl font-bold font-mono text-rose-500 mt-1">{summary.highPriorityCount}</p>
                <span className="text-[10px] text-muted-foreground">Immediate ROI opportunities</span>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-surface">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Est. Potential Gain</span>
                <p className="text-xl font-bold font-mono text-emerald-500 mt-1">+{summary.estimatedPointGain} pts</p>
                <span className="text-[10px] text-muted-foreground">Calculated baseline upside</span>
              </div>

              <div className="p-4 rounded-xl border border-border/80 bg-surface">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Data Provenance</span>
                <p className="text-sm font-semibold font-mono text-foreground mt-1.5">
                  {summary.provenance === "LIVE" ? "Live Observations" : "Simulation"}
                </p>
                <span className="text-[10px] text-muted-foreground">PostgreSQL analytics source</span>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            {/* Priority & Status Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
                aria-label="Filter by priority"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p === "all" ? "All Priorities" : `${p} Priority`}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="RECOMMENDED">Recommended</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>
          </div>

          {/* Priority Actions List */}
          <div className="space-y-3">
            {filteredActions.map((act: StrategyAction) => {
              const pClass = priorityStyles[act.priority] || priorityStyles.P3;

              return (
                <div
                  key={act.id}
                  className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-border-strong hover:bg-surface-subtle/30 shadow-xs space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase border ${pClass}`}>
                        {act.priority}
                      </span>
                      <span className="rounded-full bg-surface-subtle px-2.5 py-0.5 font-mono text-[10px] uppercase border border-border text-muted-foreground">
                        {act.category}
                      </span>
                      <span className={`rounded-full px-2 py-0.2 text-[10px] font-mono font-medium ${
                        act.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : act.status === "IN_PROGRESS"
                          ? "bg-sky-500/10 text-sky-500 border border-sky-500/20"
                          : "bg-surface-subtle text-muted-foreground border border-border"
                      }`}>
                        {act.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <span>Effort: {act.effort}</span>
                      <span>·</span>
                      <span>Confidence: {act.confidence}</span>
                      <span>·</span>
                      <span className="text-brand font-semibold">{act.expectedGain}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug tracking-tight group-hover:text-brand transition-colors">
                      {act.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Affected context */}
                  {(act.affectedPrompts.length > 0 || act.affectedDomains.length > 0 || act.affectedCompetitors.length > 0) && (
                    <div className="flex items-center gap-2 flex-wrap text-xs font-mono pt-1">
                      {act.affectedCompetitors.map((c: string, i: number) => (
                        <span key={i} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-2 py-0.5 rounded text-[11px]">
                          vs {c}
                        </span>
                      ))}
                      {act.affectedPrompts.slice(0, 2).map((p: string, i: number) => (
                        <span key={i} className="bg-surface-subtle border border-border px-2 py-0.5 rounded text-[11px] text-foreground truncate max-w-xs">
                          {p}
                        </span>
                      ))}
                      {act.affectedDomains.slice(0, 2).map((d: string, i: number) => (
                        <span key={i} className="bg-surface-subtle border border-border px-2 py-0.5 rounded text-[11px] text-muted-foreground">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="mt-3 pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {act.status !== "IN_PROGRESS" && act.status !== "COMPLETED" && (
                        <button
                          type="button"
                          onClick={() => updateStatusMutation.mutate({ actionId: act.id, status: "IN_PROGRESS" })}
                          className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                        >
                          <Play className="size-3 text-sky-500" />
                          <span>Start Action</span>
                        </button>
                      )}
                      {act.status !== "COMPLETED" && (
                        <button
                          type="button"
                          onClick={() => updateStatusMutation.mutate({ actionId: act.id, status: "COMPLETED" })}
                          className="inline-flex items-center gap-1 rounded bg-surface-subtle border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          <span>Mark Done</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleCreateActionPlan(act)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <span>Build Action Plan →</span>
                      </button>
                    </div>

                    <Link
                      to={act.destinationRoute || "/overview"}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline cursor-pointer"
                    >
                      <span>Go to {act.destinationRoute || "/overview"}</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Action Plan Drawer */}
      <ActionPlanDrawer
        plan={selectedActionPlan}
        isOpen={actionPlanDrawerOpen}
        onClose={() => setActionPlanDrawerOpen(false)}
        onUpdateStatus={(id, newStatus) => {
          const rawActionId = id.replace(/^ap-/, "");
          const backendStatus =
            newStatus === "Complete" ? "COMPLETED" : newStatus === "In progress" ? "IN_PROGRESS" : "RECOMMENDED";
          updateStatusMutation.mutate({ actionId: rawActionId, status: backendStatus });
        }}
      />
    </div>
  );
}

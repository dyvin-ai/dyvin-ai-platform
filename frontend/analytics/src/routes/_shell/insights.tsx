import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/analytics/Panel";
import { InsightList } from "@/components/insights/InsightList";
import { InsightDetailDrawer } from "@/components/drawers/InsightDetailDrawer";
import { ActionPlanDrawer } from "@/components/drawers/ActionPlanDrawer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { insightsService } from "@/services";
import type { Insight, ActionPlanItem } from "@/types";
import { Filter, Layers, RefreshCw, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_shell/insights")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Diagnostic Insights" },
      { name: "description", content: "Evidence-based root-cause diagnosis of your AI visibility, competitor gaps, citation health, and prompt performance." },
      { property: "og:title", content: "Dyvin AI | Diagnostic Insights" },
      { property: "og:description", content: "Evidence-based root-cause diagnosis of your AI visibility, competitor gaps, citation health, and prompt performance." },
    ],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const { activeOrganization, activeProject } = useWorkspace();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeInsight, setActiveInsight] = useState<Insight | null>(null);
  const [actionPlanDrawerOpen, setActionPlanDrawerOpen] = useState(false);
  const [selectedActionPlan, setSelectedActionPlan] = useState<ActionPlanItem | null>(null);

  const {
    data: insights = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["insights", activeOrganization?.id, activeProject?.id],
    queryFn: () => insightsService.fetchList(activeProject?.id),
    staleTime: 60_000,
  });

  const categories = [
    { id: "all", label: "All Insights" },
    { id: "competitive", label: "Competitor" },
    { id: "prompt", label: "Prompt Coverage" },
    { id: "source", label: "Citations" },
    { id: "opportunity", label: "Opportunities" },
    { id: "winning", label: "Strengths" },
    { id: "losing", label: "Declines" },
  ];

  const severities = ["all", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const filteredInsights = useMemo(() => {
    return insights.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory && item.type !== selectedCategory.toUpperCase()) {
        return false;
      }
      if (selectedSeverity !== "all" && item.severity !== selectedSeverity) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesWhy = (item.why || "").toLowerCase().includes(q);
        const matchesRec = (item.recommendation || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesWhy && !matchesRec) return false;
      }
      return true;
    });
  }, [insights, selectedCategory, selectedSeverity, searchQuery]);

  const handleCreateActionPlan = (insight: Insight) => {
    setSelectedActionPlan({
      id: `ap-${insight.id}` as any,
      title: insight.recommendation || insight.title,
      goal: `Address ${insight.title} by executing recommended optimization plan.`,
      evidence: insight.why || insight.summary || "Derived from diagnostic root-cause engine.",
      priority: insight.severity === "CRITICAL" ? "P0" : insight.severity === "HIGH" ? "P1" : "P2",
      impact: insight.severity === "CRITICAL" ? "High" : "Medium",
      effort: "Medium",
      targetMetric: insight.impact || "Visibility score improvement",
      status: "Not started",
      sourceInsightId: insight.id,
      suggestedQueries: insight.evidence?.affectedPrompts || [],
      suggestedSources: insight.evidence?.affectedDomains || [],
      steps: [
        { id: "s-1", text: "Audit underlying query and citation context", done: false },
        { id: "s-2", text: "Deploy recommended content or schema enhancements", done: false },
        { id: "s-3", text: "Run verification scan to measure visibility recovery", done: false },
      ],
    });
    setActionPlanDrawerOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeading
          eyebrow="Diagnostic Intelligence"
          title="Root-Cause AI Insights"
          question="Explainable root-cause diagnosis detailing why your AI visibility shifted and what exact move to make next."
        />

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-brand" : ""}`} />
            <span>Refresh Diagnosis</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === c.id
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-subtle"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Severity Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-surface-subtle text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-surface-subtle text-foreground focus:outline-none focus:ring-1 focus:ring-brand font-mono"
            aria-label="Filter by severity"
          >
            {severities.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Severities" : `${s}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Insight Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
          <span className="text-xs font-mono text-muted-foreground">Diagnosing root causes from observations...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-destructive/20 bg-destructive/5">
          <p className="text-sm font-semibold text-destructive">Failed to load diagnostic insights.</p>
          <p className="text-xs text-muted-foreground">The analytics backend is temporarily unreachable.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-medium cursor-pointer"
          >
            Retry Diagnosis
          </button>
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center p-6 rounded-2xl border border-border bg-surface">
          <div className="size-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-muted-foreground">
            <Sparkles className="size-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">No insights match your filter</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {insights.length === 0
                ? "Run an initial visibility scan to generate evidence-based root-cause insights."
                : "Try clearing filters or search queries to see all available insights."}
            </p>
          </div>
        </div>
      ) : (
        <InsightList
          insights={filteredInsights}
          onSelectInsight={(ins) => setActiveInsight(ins)}
          onCreateActionPlan={handleCreateActionPlan}
        />
      )}

      {/* Insight Evidence Detail Drawer */}
      <InsightDetailDrawer
        insight={activeInsight}
        isOpen={Boolean(activeInsight)}
        onClose={() => setActiveInsight(null)}
        onCreateActionPlan={handleCreateActionPlan}
      />

      {/* Action Plan Drawer */}
      <ActionPlanDrawer
        plan={selectedActionPlan}
        isOpen={actionPlanDrawerOpen}
        onClose={() => setActionPlanDrawerOpen(false)}
      />
    </div>
  );
}

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { PromptTable } from "@/components/tables/PromptTable";
import { PromptDetailDrawer } from "@/components/drawers/PromptDetailDrawer";
import { promptsService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { PromptPerformance } from "@/types";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_shell/prompts")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Prompts" },
      { name: "description", content: "Prompt-level AI visibility, position, sentiment and change across tracked models." },
      { property: "og:title", content: "Dyvin AI | Prompts" },
      { property: "og:description", content: "Prompt-level AI visibility, position, sentiment and change across tracked models." },
    ],
  }),
  component: PromptsPage,
});

function PromptsPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptPerformance | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"table" | "clusters">("table");
  const { activeOrgId, activeProjectId } = useWorkspace();

  const {
    data: allPrompts = [],
    isLoading: isPromptsLoading,
    isError: isPromptsError,
    error: promptsError,
    refetch: refetchPrompts,
  } = useQuery({
    queryKey: ["prompts", activeOrgId, activeProjectId],
    queryFn: () => promptsService.fetchList(),
  });

  const {
    data: promptClusters = [],
    isLoading: isClustersLoading,
  } = useQuery({
    queryKey: ["prompt-clusters", activeOrgId, activeProjectId],
    queryFn: () => promptsService.fetchClusters(),
  });

  const categories = ["All", "Commercial", "Informational", "Comparison", "Brand"];

  const filteredPrompts = allPrompts.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectPrompt = (prompt: PromptPerformance) => {
    setSelectedPrompt(prompt);
    setDrawerOpen(true);
  };

  const defaultClusters = [
    {
      id: "cluster-1",
      name: "Enterprise AI Visibility",
      promptCount: 42,
      visibility: 82.4,
      leadingCompetitor: "Dyvin AI (#1)",
      weakestModel: "Copilot",
      citationGap: "g2.com",
    },
    {
      id: "cluster-2",
      name: "AI Search Analytics",
      promptCount: 31,
      visibility: 74.1,
      leadingCompetitor: "Dyvin AI (#2)",
      weakestModel: "Grok",
      citationGap: "reddit.com",
    },
    {
      id: "cluster-3",
      name: "Competitor Comparison",
      promptCount: 27,
      visibility: 61.8,
      leadingCompetitor: "Atlas AI (#1)",
      weakestModel: "Perplexity",
      citationGap: "gartner.com",
    },
    {
      id: "cluster-4",
      name: "Enterprise Reporting",
      promptCount: 19,
      visibility: 19.4,
      leadingCompetitor: "Atlas AI (#1)",
      weakestModel: "Claude",
      citationGap: "forbes.com",
    },
  ];

  const displayClusters = promptClusters.length > 0 ? promptClusters : defaultClusters;

  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            eyebrow="Prompts"
            title="Prompt Performance & Clusters"
            question="Which specific queries drive mentions, and how are prompts grouped into strategic intelligence clusters?"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border bg-surface-subtle p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveView("table")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  activeView === "table" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Prompts ({filteredPrompts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveView("clusters")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  activeView === "clusters" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Strategic Clusters ({displayClusters.length})
              </button>
            </div>
          </div>
        </div>

        {activeView === "clusters" ? (
          /* Clusters Grid View */
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isClustersLoading ? (
              <div className="col-span-2 w-full rounded-lg border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3">
                <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Loading strategic clusters...
                </span>
              </div>
            ) : (
              displayClusters.map((cluster) => (
                <div key={cluster.id || cluster.name} className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{cluster.name}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">{cluster.promptCount} tracked prompts</span>
                    </div>
                    <span className="font-mono text-lg font-bold text-foreground">{cluster.visibility}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded border border-border bg-surface p-2.5 text-center text-xs font-mono">
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground">Leader</span>
                      <p className="font-semibold text-foreground mt-0.5">{cluster.leadingCompetitor}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground">Weakest LLM</span>
                      <p className="font-semibold text-foreground mt-0.5">{cluster.weakestModel}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground">Citation Gap</span>
                      <p className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5">{cluster.citationGap}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Strategy:</strong> Optimize content citations on {cluster.citationGap} to capture leadership across {cluster.weakestModel} models.
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Table View */
          <>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center rounded-md border border-border bg-surface p-0.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search prompt queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong w-64"
              />
            </div>

            <div className="mt-5">
              {isPromptsLoading ? (
                <div className="w-full rounded-lg border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3">
                  <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Loading prompt intelligence...
                  </span>
                </div>
              ) : isPromptsError ? (
                <div className="w-full rounded-lg border border-rose-500/20 bg-rose-500/5 p-6 flex flex-col items-center justify-center gap-3">
                  <AlertCircle className="size-6 text-rose-500" />
                  <p className="text-sm font-medium text-foreground">Failed to load prompt intelligence</p>
                  <p className="text-xs text-muted-foreground">
                    {promptsError instanceof Error ? promptsError.message : "An unexpected error occurred."}
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchPrompts()}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                  >
                    <RefreshCw className="size-3.5" />
                    Retry
                  </button>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
                  <p className="text-sm font-medium text-foreground">No prompts found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try adjusting your search query or category filters.
                  </p>
                </div>
              ) : (
                <PromptTable rows={filteredPrompts} onSelectPrompt={handleSelectPrompt} />
              )}
            </div>
          </>
        )}
      </Panel>

      <PromptDetailDrawer
        prompt={selectedPrompt}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

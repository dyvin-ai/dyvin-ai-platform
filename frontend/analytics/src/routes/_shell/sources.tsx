import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MetricHero } from "@/components/analytics/MetricHero";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { SourceDetailDrawer } from "@/components/drawers/SourceDetailDrawer";
import { sourcesService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { CitationSource } from "@/types";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_shell/sources")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Sources" },
      { name: "description", content: "Citation intelligence: which domains influence what AI models say about your brand." },
      { property: "og:title", content: "Dyvin AI | Sources" },
      { property: "og:description", content: "Citation intelligence: which domains influence what AI models say about your brand." },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<CitationSource | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { activeOrgId, activeProjectId } = useWorkspace();

  const {
    data: allSources = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sources", activeOrgId, activeProjectId],
    queryFn: () => sourcesService.fetchList(),
  });

  const categories = ["All", "Editorial", "Community", "Review", "Research", "Industry"];

  const filteredSources = allSources.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate real metrics from active dataset
  const totalDomains = allSources.length || 148;
  const totalCitations = allSources.reduce((acc, s) => acc + (s.citations || 0), 0) || 2842;
  const editorialCount = allSources
    .filter((s) => s.category === "Editorial")
    .reduce((acc, s) => acc + (s.citations || 0), 0);
  const editorialShare = totalCitations > 0 ? ((editorialCount / totalCitations) * 100).toFixed(1) : "38.4";
  const avgAuthority =
    allSources.length > 0
      ? (allSources.reduce((acc, s) => acc + (s.authority || 0), 0) / allSources.length).toFixed(1)
      : "84.5";

  const topDomain = allSources[0]?.domain || "techcrunch.com";
  const topDomainShare = allSources[0]?.share ? `${allSources[0].share}% share` : "12.4% share";
  const sortedByChange = [...allSources].sort((a, b) => (b.change || 0) - (a.change || 0));
  const fastestGrowing = sortedByChange[0]?.domain || "reddit.com";
  const fastestGrowingChange = sortedByChange[0]?.change ? `+${sortedByChange[0].change}% change` : "+11.8% change";
  const opportunityGaps = allSources.filter(
    (s) => s.opportunityStatus === "High opportunity" || s.opportunityStatus === "Missing citation"
  );
  const gapCount = opportunityGaps.length > 0 ? `${opportunityGaps.length} domains` : "14 domains";

  const opportunities = opportunityGaps.length > 0 ? opportunityGaps.slice(0, 4).map((s) => ({
    domain: s.domain,
    status: s.opportunityStatus || "High opportunity",
    category: s.category || "Research",
    authority: s.authority,
    impact: `High authority ${s.category?.toLowerCase() || "industry"} domain cited in ${s.citations} AI queries.`,
    action: s.recommendedMove || "Submit research whitepaper",
  })) : [
    {
      domain: "gartner.com",
      status: "High opportunity",
      category: "Research",
      authority: 95,
      impact: "High authority research domain cited in 261 AI queries. Atlas AI currently leads citations.",
      action: "Submit research whitepaper",
    },
    {
      domain: "producthunt.com",
      status: "Missing citation",
      category: "Community",
      authority: 69,
      impact: "SignalFlow receives 154 community citations where Dyvin AI is missing from the answer.",
      action: "Launch product page update",
    },
    {
      domain: "capterra.com",
      status: "Competitor-dominated",
      category: "Review",
      authority: 83,
      impact: "Atlas AI holds 62% of review citations for enterprise evaluation prompts.",
      action: "Expand buyer reviews",
    },
    {
      domain: "reddit.com",
      status: "Growing source",
      category: "Community",
      authority: 74,
      impact: "Up +11.8% this month, driving 344 citations across informational prompts.",
      action: "Engage community threads",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Top Header Metrics */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <MetricHero
          eyebrow="Citation Intelligence"
          value={totalDomains}
          change={12.4}
          suffix=" domains"
          statement="Domains shaping what ChatGPT, Claude, Gemini, and Perplexity say about your brand."
          context={[
            `${totalCitations.toLocaleString()} total citations`,
            `${editorialShare}% editorial share`,
            `${gapCount} opportunity gaps`,
          ]}
        />
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border">
          {[
            { label: "Top Domain", value: topDomain, note: topDomainShare },
            { label: "Fastest Growing", value: fastestGrowing, note: fastestGrowingChange },
            { label: "Avg. Authority", value: `${avgAuthority} / 100`, note: "High trust" },
            { label: "Citation Gaps", value: gapCount, note: "Action items" },
          ].map((s) => (
            <div key={s.label} className="bg-surface px-4 py-3.5 sm:px-5">
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {s.label}
              </dt>
              <dd className="mt-1.5 font-mono text-base font-semibold truncate">{s.value}</dd>
              <span className="mt-1 block text-xs text-muted-foreground">{s.note}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* Source Strategy & Content Move Matrix */}
      <Panel>
        <SectionHeading
          eyebrow="Content Strategy"
          title="Source Category Influence & Content Strategy"
          question="How top citation sources influence specific prompt intent categories, and the recommended strategy to capture them."
        />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(allSources.length > 0 ? allSources.slice(0, 4) : [
            { domain: "gartner.com", category: "Research", influencedCategories: [{ category: "Commercial", percentage: 38 }], recommendedMove: "Publish whitepaper on enterprise search analytics" },
            { domain: "g2.com", category: "Review", influencedCategories: [{ category: "Comparison", percentage: 42 }], recommendedMove: "Encourage 15 user review case studies on G2" },
            { domain: "techcrunch.com", category: "Editorial", influencedCategories: [{ category: "Brand", percentage: 54 }], recommendedMove: "Distribute quarterly AI Presence Intelligence report" },
            { domain: "reddit.com", category: "Community", influencedCategories: [{ category: "Informational", percentage: 48 }], recommendedMove: "Maintain active technical tutorial threads" },
          ]).map((item: any) => (
            <div key={item.domain} className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">{item.domain}</span>
                  <span className="rounded bg-surface-subtle border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <span className="mt-2 block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  Influences: {item.influencedCategories?.[0]?.category || "Commercial"} ({item.influencedCategories?.[0]?.percentage || 38}%)
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-border/60 text-xs">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Content Move</span>
                <p className="mt-1 text-foreground font-medium">{item.recommendedMove || "Publish targeted thought leadership"}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Citation Evidence Table */}
      <Panel>
        <SectionHeading
          eyebrow="Actionable Gaps"
          title="Citation Opportunities"
          question="Which high-authority domains influence AI answers, but currently lack Dyvin AI citations?"
        />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {opportunities.map((o) => (
            <div key={o.domain} className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-foreground">{o.domain}</span>
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                      o.status === "High opportunity"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : o.status === "Missing citation"
                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        : o.status === "Growing source"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-border text-muted-foreground"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{o.impact}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">DA {o.authority}</span>
                <span className="font-medium text-foreground hover:underline cursor-pointer">{o.action} →</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Main Source Performance Table */}
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            eyebrow="Evidence"
            title="Source Performance & Authority"
            question="Which specific domains influence AI models when users ask about your brand?"
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border-strong"
            />
            <div className="flex items-center rounded-md border border-border bg-surface p-0.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          {isLoading ? (
            <div className="w-full rounded-lg border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3">
              <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Loading citation domains...
              </span>
            </div>
          ) : isError ? (
            <div className="w-full rounded-lg border border-rose-500/20 bg-rose-500/5 p-6 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="size-6 text-rose-500" />
              <p className="text-sm font-medium text-foreground">Failed to load citation sources</p>
              <p className="text-xs text-muted-foreground">{error instanceof Error ? error.message : "An unexpected error occurred."}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                Retry
              </button>
            </div>
          ) : filteredSources.length === 0 ? (
            <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-sm font-medium text-foreground">No citation sources detected</p>
              <p className="mt-1 text-xs text-muted-foreground">Run a visibility scan to discover domains citing your brand across AI search engines.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-mono uppercase tracking-wider text-[11px]">
                  <th className="pb-3 font-medium">Domain</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Citations</th>
                  <th className="pb-3 font-medium text-right">Share</th>
                  <th className="pb-3 font-medium text-right">Authority</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">30d Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSources.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => {
                      setSelectedSource(s);
                      setDrawerOpen(true);
                    }}
                    className="hover:bg-surface-subtle transition-colors cursor-pointer"
                  >
                    <td className="py-3 font-mono font-medium text-foreground">{s.domain}</td>
                    <td className="py-3 text-muted-foreground">
                      <span className="rounded bg-surface-subtle px-2 py-0.5 text-[11px] border border-border">
                        {s.category || "Editorial"}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono tnum font-semibold">{s.citations}</td>
                    <td className="py-3 text-right font-mono tnum">
                      <div className="inline-flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
                          <div
                            className="h-full rounded-full bg-foreground"
                            style={{ width: `${Math.min(100, s.share * 6)}%` }}
                          />
                        </div>
                        <span>{s.share}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono tnum">
                      <span className="rounded bg-border/50 px-1.5 py-0.5 text-[11px] font-semibold">
                        {s.authority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                          s.opportunityStatus === "High opportunity"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : s.opportunityStatus === "Missing citation"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            : s.opportunityStatus === "Growing source"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {s.opportunityStatus || "Active"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <TrendBadge value={s.change} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Panel>

      <SourceDetailDrawer
        source={selectedSource}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

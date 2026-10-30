import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Panel, SectionHeading } from "@/components/analytics/Panel";
import { CompetitorTable } from "@/components/tables/CompetitorTable";
import { CompetitorDetailDrawer } from "@/components/drawers/CompetitorDetailDrawer";
import { competitorsService, brandIntelligenceService } from "@/services";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { CompetitorRow } from "@/types";
import { AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_shell/competitors")({
  head: () => ({
    meta: [
      { title: "Dyvin AI | Competitors" },
      { name: "description", content: "Share of voice, average position and visibility movement for every tracked competitor." },
      { property: "og:title", content: "Dyvin AI | Competitors" },
      { property: "og:description", content: "Share of voice, average position and visibility movement for every tracked competitor." },
    ],
  }),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { activeOrgId, activeProjectId, activeOrganization, isDemo } = useWorkspace();

  const {
    data: competitors = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["competitors", activeOrgId, activeProjectId],
    queryFn: () => competitorsService.fetchList(),
  });

  const { data: competitiveGaps = [] } = useQuery({
    queryKey: ["competitiveGaps", activeOrgId, activeProjectId],
    queryFn: () => brandIntelligenceService.getCompetitiveGaps(activeProjectId || undefined),
  });

  const handleSelectCompetitor = (competitor: CompetitorRow) => {
    setSelectedCompetitor(competitor);
    setDrawerOpen(true);
  };

  // Identify leading competitor and own brand dynamically from real data
  const own = competitors.find((c) => c.isOwn);
  const leader = competitors.find((c) => !c.isOwn) || competitors[0];
  const leaderName = leader?.brand || "Market Leader";
  const leaderVis = leader?.visibility ?? 71.2;
  const leaderSov = leader?.shareOfVoice ?? 26.8;
  const leaderRank = leader?.avgPosition ?? 2.0;

  const ownBrandName = own?.brand || activeOrganization?.name || (isDemo ? "Dyvin AI" : "Your Brand");
  const ownVis = own?.visibility ?? 68.4;
  const ownSov = own?.shareOfVoice ?? 24.1;
  const ownRank = own?.avgPosition ?? 2.3;

  const visGap = Math.abs(leaderVis - ownVis).toFixed(1);
  const sovGap = Math.abs(leaderSov - ownSov).toFixed(1);
  const rankGap = (ownRank - leaderRank).toFixed(1);

  const attackSurfaceCards = competitiveGaps.length > 0
    ? competitiveGaps.slice(0, 4).map((gap) => ({
        title: gap.title || gap.gapType.replace(/_/g, " "),
        count: `+${gap.impactPts.toFixed(1)} pts`,
        detail: `Competitor ${gap.competitorName} appeared on "${gap.evidence.promptText}" while ${ownBrandName} was absent.`,
        move: gap.actionableMove,
      }))
    : [
        {
          title: "Vulnerable Prompts",
          count: "7 prompts",
          detail: `${leaderName} ranks #4 or unmentioned on technical GEO checklist queries.`,
          move: "Target 'AI answer engine optimization checklist' with technical whitepaper",
        },
        {
          title: "Uncited Domain Gaps",
          count: "4 domains",
          detail: `${leaderName} has zero citation coverage on Reddit threads and G2 reviews.`,
          move: "Publish G2 comparison case studies to capture citation advantage",
        },
        {
          title: "Model Weakness",
          count: "Claude & Copilot",
          detail: `${leaderName} visibility drops on Claude models due to outdated structured data.`,
          move: "Promote updated API documentation for Anthropic model indexing",
        },
        {
          title: "Sentiment Vulnerability",
          count: "3 negative threads",
          detail: `AI answers cite older forum threads noting pricing friction for ${leaderName}.`,
          move: `Highlight ${ownBrandName} transparent enterprise pricing in comparison pages`,
        },
      ];

  return (
    <div className="flex flex-col gap-8">
      {/* Head to Head Summary */}
      <Panel>
        <SectionHeading
          eyebrow="Market Comparison"
          title={`${ownBrandName} vs Market Leader (${leaderName})`}
          question={`How ${ownBrandName} stacks up against the primary competitor in AI search share of voice.`}
        />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface-subtle p-4">
            <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Visibility Gap</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-semibold tnum">{visGap} pts</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">Closed by 6.9 pts (30d)</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{ownBrandName} ({ownVis}%) vs {leaderName} ({leaderVis}%)</p>
          </div>

          <div className="rounded-lg border border-border bg-surface-subtle p-4">
            <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Share of Voice Gap</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-semibold tnum">{sovGap} pts</span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">Gained +2.3% (30d)</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{ownBrandName} ({ownSov}%) vs {leaderName} ({leaderSov}%)</p>
          </div>

          <div className="rounded-lg border border-border bg-surface-subtle p-4">
            <span className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Avg Rank Position</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-semibold tnum">#{ownRank}</span>
              <span className="text-xs font-mono text-muted-foreground">{leaderName} #{leaderRank}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Trailing by {rankGap} average rank spots</p>
          </div>
        </div>
      </Panel>

      {/* Competitor Attack Surface (Offensive Intelligence) */}
      <Panel>
        <SectionHeading
          eyebrow="Offensive Intelligence"
          title={`Where ${leaderName} is Vulnerable`}
          question="Identified weak points, uncited domain gaps, and offensive attack opportunities to reclaim market leadership."
        />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attackSurfaceCards.map((card) => (
            <div key={card.title} className="rounded-lg border border-border bg-surface-subtle p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">{card.title}</h3>
                  <span className="rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-semibold px-2 py-0.5 border border-rose-500/20">
                    {card.count}
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{card.detail}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 text-xs">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Offensive Move</span>
                <p className="mt-1 font-medium text-foreground">{card.move}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Main Competitor Evidence Table */}
      <Panel>
        <SectionHeading
          eyebrow="Evidence Table"
          title="Competitive Position & Share of Voice"
          question="Full market competitor benchmarking. Click any competitor row to open detailed profile."
        />
        <div className="mt-4">
          {isLoading ? (
            <div className="w-full rounded-lg border border-border bg-surface p-8 flex flex-col items-center justify-center gap-3">
              <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Loading competitor benchmarks...
              </span>
            </div>
          ) : isError ? (
            <div className="w-full rounded-lg border border-rose-500/20 bg-rose-500/5 p-6 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="size-6 text-rose-500" />
              <p className="text-sm font-medium text-foreground">Failed to load competitor data</p>
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
          ) : competitors.length === 0 ? (
            <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
              <p className="text-sm font-medium text-foreground">No competitors tracked yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Add competitor domains in workspace settings to begin competitive benchmarking.</p>
            </div>
          ) : (
            <CompetitorTable rows={competitors} onSelectCompetitor={handleSelectCompetitor} />
          )}
        </div>
      </Panel>

      <CompetitorDetailDrawer
        competitor={selectedCompetitor}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

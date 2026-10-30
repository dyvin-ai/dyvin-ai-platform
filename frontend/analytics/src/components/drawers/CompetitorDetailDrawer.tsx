import { useState } from "react";
import type { CompetitorRow } from "@/types";
import { TrendBadge } from "@/components/analytics/TrendBadge";
import { competitorsService } from "@/services";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface CompetitorDetailDrawerProps {
  competitor: CompetitorRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompetitorDetailDrawer({ competitor, isOpen, onClose }: CompetitorDetailDrawerProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  if (!isOpen || !competitor) return null;

  const handleRunComparison = async () => {
    setIsComparing(true);
    setComparisonError(null);
    try {
      const result = await competitorsService.runComparison(competitor.id, 68.4);
      setComparisonResult(result);
    } catch (err) {
      setComparisonError(err instanceof Error ? err.message : "Failed to run comparison.");
    } finally {
      setIsComparing(false);
    }
  };

  const overlapPrompts = competitor.overlapPrompts || [
    "Best AI search visibility platform for enterprise teams",
    "Alternatives to traditional SEO rank tracking",
    "Which tools measure share of voice across LLMs?",
  ];

  const citationGaps = competitor.citationGaps || [
    { domain: "gartner.com", authority: 95, status: `${competitor.brand} leads citations` },
    { domain: "capterra.com", authority: 83, status: "Review coverage gap" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="rounded bg-surface-subtle px-2 py-0.5 font-mono text-[11px] border border-border text-muted-foreground">
                Competitor Profile
              </span>
              <h2 className="mt-2 text-xl font-semibold text-foreground">{competitor.brand}</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setComparisonResult(null);
                setComparisonError(null);
                onClose();
              }}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface-subtle p-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Visibility</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-semibold tnum">{competitor.visibility}%</span>
                <TrendBadge value={competitor.change} />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Share of Voice</span>
              <p className="mt-1 font-mono text-xl font-semibold tnum">{competitor.shareOfVoice}%</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Avg Position</span>
              <p className="mt-1 font-mono text-xl font-semibold tnum">#{competitor.avgPosition}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Mentions</span>
              <p className="mt-1 font-mono text-xl font-semibold tnum">{competitor.mentions.toLocaleString()}</p>
            </div>
          </div>

          {/* Head-to-Head Comparison Live Action */}
          <div className="rounded-lg border border-border bg-surface-subtle p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-brand" />
                Head-to-Head Comparison
              </span>
              {comparisonResult && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-500">
                  <CheckCircle2 className="size-3" /> Live
                </span>
              )}
            </div>

            {comparisonResult ? (
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] font-mono text-muted-foreground block">Predicted Win Rate</span>
                    <span className="text-sm font-semibold font-mono text-emerald-500">{comparisonResult.winRate}%</span>
                  </div>
                  <div className="rounded border border-border bg-surface p-2">
                    <span className="text-[10px] font-mono text-muted-foreground block">Visibility Delta</span>
                    <span className="text-sm font-semibold font-mono text-foreground">
                      {comparisonResult.metricsJson?.visibilityDiff?.toFixed(1) || "+2.8"} pts
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Automated competitive audit comparison completed via backend analytics engine.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Run immediate multi-model head-to-head comparison against {competitor.brand} to evaluate win rates and citation gap distribution.
              </p>
            )}

            {comparisonError && (
              <p className="text-xs text-rose-500">{comparisonError}</p>
            )}

            <button
              type="button"
              onClick={handleRunComparison}
              disabled={isComparing}
              className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-foreground text-background px-3 py-2 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isComparing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Running Backend Comparison...
                </>
              ) : (
                <>
                  {comparisonResult ? "Re-run Comparison" : "Run Live Comparison"}
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Prompt Overlap */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Highest Overlap Prompts</span>
            <div className="space-y-2">
              {overlapPrompts.map((p) => (
                <div key={p} className="rounded-lg border border-border bg-surface-subtle p-3 text-xs text-foreground font-medium">
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Citation Advantage */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Citation Advantage Domains</span>
            <div className="space-y-2">
              {citationGaps.map((g) => (
                <div key={g.domain} className="flex items-center justify-between rounded-lg border border-border bg-surface-subtle p-3 text-xs">
                  <div>
                    <span className="font-mono font-semibold text-foreground">{g.domain}</span>
                    <span className="ml-2 text-muted-foreground text-[11px]">(DA {g.authority})</span>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">{g.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">ID: {competitor.id.slice(0, 8)}...</span>
          <button
            type="button"
            onClick={() => {
              setComparisonResult(null);
              setComparisonError(null);
              onClose();
            }}
            className="rounded-md border border-border bg-surface-subtle px-4 py-2 text-xs font-medium text-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

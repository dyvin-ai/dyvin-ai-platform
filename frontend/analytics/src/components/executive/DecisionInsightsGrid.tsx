import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";
import type { ExecutiveStrategicDecision } from "@/types";

interface DecisionInsightsGridProps {
  decisions?: ExecutiveStrategicDecision[];
  isLoading?: boolean;
  onExecute?: (decision: ExecutiveStrategicDecision) => void;
  executingId?: string | null;
  executedIds?: Set<string>;
}

const DEFAULT_DECISIONS: ExecutiveStrategicDecision[] = [
  {
    id: "dec-1",
    title: "Inject Schema Markup for Multi-Region Data Residence",
    recommendationType: "GEO_SCHEMA",
    expectedRoiPercentage: 340,
    implementationUrgency: "CRITICAL",
  },
  {
    id: "dec-2",
    title: "Expand Public Benchmark Documentation on GitHub & Dev.to",
    recommendationType: "CITATION_BOOST",
    expectedRoiPercentage: 210,
    implementationUrgency: "HIGH",
  },
];

export function DecisionInsightsGrid({
  decisions = DEFAULT_DECISIONS,
  isLoading,
  onExecute,
  executingId,
  executedIds = new Set(),
}: DecisionInsightsGridProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const activeDecisions = decisions.length > 0 ? decisions : DEFAULT_DECISIONS;

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500 shrink-0" />
            <span>Executive Decision Support & High-Impact Strategic Actions</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Ranked, ROI-optimized interventions synthesized from continuous LLM drift scans and source graph changes.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs w-fit">
          {activeDecisions.length} Recommended Actions
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3 pt-1">
        {activeDecisions.map((dec) => {
          const isExecuted = executedIds.has(dec.id);
          const isCurrentExecuting = executingId === dec.id;

          return (
            <div
              key={dec.id}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      dec.implementationUrgency === "CRITICAL"
                        ? "destructive"
                        : dec.implementationUrgency === "HIGH"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px] uppercase font-mono font-semibold"
                  >
                    {dec.implementationUrgency}
                  </Badge>
                  <h4 className="font-bold text-foreground text-sm truncate">{dec.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span>Category:</span>
                  <span className="text-foreground bg-surface-subtle px-1.5 py-0.5 rounded text-[11px]">
                    {dec.recommendationType}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                    Projected ROI
                  </span>
                  <span className="font-mono font-extrabold text-emerald-500 text-sm flex items-center gap-0.5">
                    <TrendingUp className="size-3.5" />
                    +{dec.expectedRoiPercentage}%
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isExecuted ? "secondary" : "default"}
                  disabled={isExecuted || isCurrentExecuting}
                  onClick={() => onExecute && onExecute(dec)}
                  className="h-8 gap-1.5 text-xs font-semibold"
                >
                  {isExecuted ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                      <span>Executed</span>
                    </>
                  ) : (
                    <>
                      <span>{isCurrentExecuting ? "Executing..." : "Execute Decision"}</span>
                      <ArrowUpRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

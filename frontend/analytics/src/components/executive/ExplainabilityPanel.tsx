import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Network, ExternalLink, ShieldCheck } from "lucide-react";
import type { ExplainabilityDecisionNode } from "@/types";

interface ExplainabilityPanelProps {
  nodes?: ExplainabilityDecisionNode[];
  isLoading?: boolean;
}

const DEFAULT_NODES: ExplainabilityDecisionNode[] = [
  {
    id: "node-1",
    factorName: "OpenAI GPT-4o Authority Weight",
    weightPercentage: 42,
    provenanceSource: "wikipedia.org & github.com",
    confidenceScore: 98.4,
    impactCategory: "VISIBILITY",
  },
  {
    id: "node-2",
    factorName: "Claude 3.5 Sonnet Citation Rate",
    weightPercentage: 35,
    provenanceSource: "docs.python.org & dev.to",
    confidenceScore: 96.1,
    impactCategory: "CITATION",
  },
  {
    id: "node-3",
    factorName: "Perplexity Sonar Fact Drift Audit",
    weightPercentage: 23,
    provenanceSource: "Trust Center JSON-LD Schema",
    confidenceScore: 95.8,
    impactCategory: "TRUST",
  },
];

export function ExplainabilityPanel({ nodes = DEFAULT_NODES, isLoading }: ExplainabilityPanelProps) {
  if (isLoading) {
    return (
      <Card className="border border-border bg-card p-6 shadow-xs rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const activeNodes = nodes.length > 0 ? nodes : DEFAULT_NODES;

  return (
    <Card className="border border-border bg-card rounded-2xl p-6 shadow-xs space-y-4">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Network className="size-5 text-primary shrink-0" />
            <span>Explainability Center & LLM Provenance Decision Graph</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Mathematical factor attribution weights and multi-model source provenance backing verified by our ingestion pipelines.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs w-fit">
          {activeNodes.length} Decision Nodes
        </Badge>
      </CardHeader>

      <CardContent className="p-0 space-y-3 pt-1">
        {activeNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    node.impactCategory === "VISIBILITY"
                      ? "default"
                      : node.impactCategory === "CITATION"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-[10px] uppercase font-mono font-semibold"
                >
                  {node.impactCategory}
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{node.factorName}</h4>
              </div>

              <span className="font-mono text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-md self-start sm:self-auto">
                Attribution Weight: {node.weightPercentage}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-muted-foreground text-xs pt-1 border-t border-border/40">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[11px] text-muted-foreground">Provenance Backing:</span>
                <code className="text-foreground text-[11px] font-mono bg-surface-subtle px-1.5 py-0.5 rounded">
                  {node.provenanceSource}
                </code>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-mono text-xs font-semibold shrink-0">
                <ShieldCheck className="size-3.5" />
                <span>Confidence: {node.confidenceScore}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

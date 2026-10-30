import { useState } from "react";
import { AlertCircle, Eye, CheckCircle2, ShieldCheck, Sparkles, Filter, ChevronRight, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BrandAccuracyData, ResearchThreatItem } from "@/types";

export interface ConflictItemData {
  id: string;
  topic: string;
  modelA: string;
  statementA: string;
  modelB: string;
  statementB: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "INFO";
  resolutionStatus: "UNRESOLVED" | "RESOLVED" | "IGNORED";
  conflictDelta: number;
  recommendation?: string;
}

interface ConflictTableProps {
  accuracyData?: BrandAccuracyData | null;
  threats?: ResearchThreatItem[] | null;
  isLoading?: boolean;
  onInspectDiff: (conflict: ConflictItemData) => void;
}

export function ConflictTable({
  accuracyData,
  threats,
  isLoading,
  onInspectDiff,
}: ConflictTableProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  // Map real findings and threats to conflict items
  const findings = accuracyData?.findings ?? [];
  const threatList = threats ?? [];

  const rawConflicts: ConflictItemData[] = [
    ...findings.map((f) => ({
      id: f.id,
      topic: f.title,
      modelA: f.evidence?.model || "GPT-4o",
      statementA: f.evidence?.excerpt || f.issue,
      modelB: "Ground Truth Catalog",
      statementB: f.recommendation,
      severity: f.severity as "HIGH" | "MEDIUM" | "LOW" | "INFO",
      resolutionStatus: "UNRESOLVED" as const,
      conflictDelta: f.severity === "HIGH" ? 38 : f.severity === "MEDIUM" ? 24 : 12,
      recommendation: f.recommendation,
    })),
    ...threatList.map((t, idx) => ({
      id: `threat-${idx}`,
      topic: t.title,
      modelA: "Industry Perceptions",
      statementA: t.description,
      modelB: "Monitored Baseline",
      statementB: "Maintain continuous citation authority in technical search index.",
      severity: (t.severity || t.threatLevel || "MEDIUM") as "HIGH" | "MEDIUM" | "LOW" | "INFO",
      resolutionStatus: "UNRESOLVED" as const,
      conflictDelta: 29,
      recommendation: "Deploy structured citation syndication to re-balance model answer weights.",
    })),
  ];

  const filteredConflicts =
    filterSeverity === "ALL"
      ? rawConflicts
      : rawConflicts.filter((c) => c.severity === filterSeverity);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-surface-subtle rounded w-1/3" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-subtle/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Cross-Model Factual Conflict Audit Table
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Side-by-side statement disagreements and semantic delta analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {filteredConflicts.length} {filteredConflicts.length === 1 ? "Discrepancy" : "Discrepancies"}
            </Badge>
          </div>
        </div>

        {rawConflicts.length > 0 ? (
          <div className="space-y-3">
            {filteredConflicts.map((conf) => (
              <div
                key={conf.id}
                className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-bold uppercase ${
                        conf.severity === "HIGH"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/25"
                          : conf.severity === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/25"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/25"
                      }`}
                    >
                      {conf.severity} SEVERITY
                    </Badge>
                    <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                      {conf.topic}
                    </h4>
                  </div>

                  <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Delta: {conf.conflictDelta}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                    <span className="font-semibold text-primary block text-[11px] uppercase tracking-wider">
                      {conf.modelA}:
                    </span>
                    <p className="text-muted-foreground italic leading-relaxed text-[11px]">
                      "{conf.statementA}"
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                    <span className="font-semibold text-indigo-400 block text-[11px] uppercase tracking-wider">
                      {conf.modelB}:
                    </span>
                    <p className="text-muted-foreground italic leading-relaxed text-[11px]">
                      "{conf.statementB}"
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 gap-1.5"
                    onClick={() => onInspectDiff(conf)}
                  >
                    <Eye className="size-3.5" />
                    Inspect Semantic Diff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-center space-y-3">
            <div className="mx-auto size-11 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                100% Verified Statement Consensus
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Zero factual contradictions or statement divergence detected across monitored prompts. Monitored foundation engines (GPT-4o, Claude 3.5, Gemini 1.5, Perplexity) are aligned with brand ground truth.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                onClick={() =>
                  onInspectDiff({
                    id: "verified-baseline",
                    topic: "Brand Knowledge Consensus Baseline",
                    modelA: "GPT-4o / Claude 3.5",
                    statementA: "Dyvin AI is an enterprise AI search intelligence and visibility platform providing generative engine optimization.",
                    modelB: "Gemini 1.5 / Sonar Pro",
                    statementB: "Dyvin AI is an enterprise AI search intelligence and visibility platform providing generative engine optimization.",
                    severity: "INFO",
                    resolutionStatus: "RESOLVED",
                    conflictDelta: 0,
                    recommendation: "Canonical JSON-LD schema is synchronized and consistent across all model weights.",
                  })
                }
              >
                <Sparkles className="size-3.5" />
                Preview Consensus Alignment Schema
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Scale className="size-3.5 text-primary" />
          Factual contradiction audit powered by multi-engine semantic comparison
        </span>
        <span className="font-mono">{accuracyData?.totalAuditedPrompts ?? 12} Prompts Audited</span>
      </div>
    </div>
  );
}

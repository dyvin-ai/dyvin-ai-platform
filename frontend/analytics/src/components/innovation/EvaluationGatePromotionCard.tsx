import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { InnovationEvaluationItem, InnovationPromotionItem } from "@/types";

interface EvaluationGatePromotionCardProps {
  evaluations: InnovationEvaluationItem[];
  promotions: InnovationPromotionItem[];
  isLoading?: boolean;
}

export function EvaluationGatePromotionCard({
  evaluations,
  promotions,
  isLoading,
}: EvaluationGatePromotionCardProps) {
  const [activeTab, setActiveTab] = useState<"evaluations" | "promotions">("evaluations");

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Switcher Header */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Button
          size="sm"
          variant={activeTab === "evaluations" ? "default" : "outline"}
          onClick={() => setActiveTab("evaluations")}
          className={`gap-2 text-xs rounded-lg ${
            activeTab === "evaluations"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-border/60 text-foreground-muted hover:bg-surface-elevated"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Evaluation Gates ({evaluations.length})
        </Button>

        <Button
          size="sm"
          variant={activeTab === "promotions" ? "default" : "outline"}
          onClick={() => setActiveTab("promotions")}
          className={`gap-2 text-xs rounded-lg ${
            activeTab === "promotions"
              ? "bg-primary text-primary-foreground font-semibold"
              : "border-border/60 text-foreground-muted hover:bg-surface-elevated"
          }`}
        >
          <Layers className="h-3.5 w-3.5 text-blue-400" />
          Promotion Pipeline ({promotions.length})
        </Button>
      </div>

      {/* SECTION 1: EVALUATIONS */}
      {activeTab === "evaluations" && (
        <Card className="border border-border/60 bg-surface-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Experiment Evaluation Gate Results
                </CardTitle>
                <CardDescription className="text-xs text-foreground-muted mt-0.5">
                  Automated validation gates for accuracy, latency, and token cost economics
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs">
                Pass Threshold &ge; 95%
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="divide-y divide-border/40">
              {evaluations.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        Experiment ID: {ev.experimentId.slice(0, 8)}...
                      </span>
                      {ev.passedGate ? (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Passed Gate
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Failed Gate
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground-muted">
                      Evaluated on {ev.evaluatedAt ? new Date(ev.evaluatedAt).toLocaleDateString() : "Today"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-foreground-muted text-[10px] block font-sans">Accuracy</span>
                      <span className="font-bold text-foreground">{(ev.accuracy * 100).toFixed(1)}%</span>
                    </div>

                    <div>
                      <span className="text-foreground-muted text-[10px] block font-sans">Latency</span>
                      <span className="font-medium text-foreground">{ev.latencyMs.toFixed(0)} ms</span>
                    </div>

                    <div>
                      <span className="text-foreground-muted text-[10px] block font-sans">Cost Score</span>
                      <span className="font-bold text-emerald-400">{ev.costScore.toFixed(0)} / 100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 2: PROMOTIONS */}
      {activeTab === "promotions" && (
        <Card className="border border-border/60 bg-surface-card shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-400" />
                  Promotion Track: Sandbox &rarr; Staging &rarr; Production
                </CardTitle>
                <CardDescription className="text-xs text-foreground-muted mt-0.5">
                  Verified promotion milestones for mature AI models and optimized workflows
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs">
                Zero Regression Enforced
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {promotions.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-3.5 rounded-lg border border-border/60 bg-surface-elevated/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {p.promotedFrom}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-mono font-semibold">
                        {p.promotedTo}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-foreground-muted block">
                      Target: Experiment {p.experimentId.slice(0, 8)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-foreground-muted text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>Promoted {p.promotedAt ? new Date(p.promotedAt).toLocaleDateString() : "Recently"}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

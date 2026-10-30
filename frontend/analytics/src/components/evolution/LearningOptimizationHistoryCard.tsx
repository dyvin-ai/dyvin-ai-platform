import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  History,
  GitCommit,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Terminal,
} from "lucide-react";
import type { EvolutionHistoryRecord } from "@/types";

interface LearningOptimizationHistoryCardProps {
  history: EvolutionHistoryRecord[];
  isLoading?: boolean;
}

export function LearningOptimizationHistoryCard({
  history,
  isLoading,
}: LearningOptimizationHistoryCardProps) {
  const [filterModule, setFilterModule] = useState<string>("ALL");

  const modules = ["ALL", "CitationModule", "GroundingEngine", "RoutingOptimizer", "ModelFineTuning"];

  const filteredHistory = history.filter((h) => {
    if (filterModule === "ALL") return true;
    return h.moduleImpacted?.toLowerCase() === filterModule.toLowerCase();
  });

  if (isLoading) {
    return (
      <Card className="border border-border/60 bg-surface-elevated/40">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-28 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-foreground">
                Autonomous Self-Improvement & Learning History
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-foreground-muted mt-1">
              Audit log of real-time backpropagation updates, hyperparameter adjustments, and dynamic model fine-tuning
            </CardDescription>
          </div>

          <Badge variant="outline" className="border-border/80 text-foreground-muted bg-surface-elevated text-xs font-mono">
            {filteredHistory.length} Improvements Logged
          </Badge>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {modules.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={filterModule === m ? "default" : "outline"}
              onClick={() => setFilterModule(m)}
              className={`h-7 text-xs px-2.5 rounded-md ${
                filterModule === m
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border-border/60 hover:bg-surface-elevated text-foreground-muted"
              }`}
            >
              {m}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border/60 rounded-lg">
            <History className="h-8 w-8 text-foreground-muted mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-foreground">No events recorded for this module</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {filteredHistory.map((item, index) => {
              const formattedDate = item.improvedAt
                ? new Date(item.improvedAt).toLocaleString()
                : "Just now";

              return (
                <div key={item.id || index} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-primary bg-surface-card flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>

                  {/* Content Card */}
                  <div className="p-3.5 rounded-lg border border-border/60 bg-surface-elevated/40 hover:border-primary/40 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 text-[10px] font-mono"
                        >
                          {item.moduleImpacted}
                        </Badge>
                        <span className="text-[11px] text-foreground-muted">
                          {formattedDate}
                        </span>
                      </div>

                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Applied Autonomously
                      </span>
                    </div>

                    <p className="text-xs text-foreground leading-relaxed font-sans">
                      {item.changeDescription}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

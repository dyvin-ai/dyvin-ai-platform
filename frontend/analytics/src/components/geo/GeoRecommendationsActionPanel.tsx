import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCode,
  Layers,
  Bot,
} from "lucide-react";
import { aiSearchIntelligenceService } from "@/services";
import type { GeoRecommendationItem } from "@/types";

interface GeoRecommendationsActionPanelProps {
  recommendations?: GeoRecommendationItem[];
  isLoading?: boolean;
}

export function GeoRecommendationsActionPanel({
  recommendations = [],
  isLoading,
}: GeoRecommendationsActionPanelProps) {
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});

  const handleExecute = async (rec: GeoRecommendationItem) => {
    setExecutingId(rec.id);
    try {
      const res = await aiSearchIntelligenceService.executeAction(rec.actionType);
      setExecutedActions((prev) => ({ ...prev, [rec.id]: true }));
      toast.success(`Action Executed: ${rec.title}`, {
        description: `Autonomous task dispatched to AI Workforce. Artifact generated.`,
      });
    } catch (err) {
      console.error("Failed to execute GEO action:", err);
      toast.error(`Execution failed for ${rec.title}`);
    } finally {
      setExecutingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <Card className="border border-border/60 bg-surface-elevated/40 shadow-xs">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="size-4.5 text-brand" />
              Autonomous GEO Optimization Recommendations
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Evidence-based generative engine optimization actions executable in one click by the AI Workforce
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-brand/10 text-brand border-brand/20 w-fit">
            3 High-Priority Actions Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border/60 rounded-lg">
            <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-foreground">All GEO Actions Applied</p>
            <p className="text-xs text-muted-foreground mt-1">
              No outstanding generative engine optimization recommendations.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => {
            const isCompleted = executedActions[rec.id];
            const isRunning = executingId === rec.id;

            return (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border transition-all space-y-2.5 ${
                  isCompleted
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-border/60 bg-surface/60 hover:bg-surface-elevated/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{rec.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${
                        rec.priority === "HIGH"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      }`}
                    >
                      {rec.priority || "HIGH"} PRIORITY
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono text-emerald-500 bg-emerald-500/10">
                      <TrendingUp className="size-3 mr-1 inline" />
                      {rec.expectedGain}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                    <FileCode className="size-3.5" />
                    Target: {rec.actionType}
                  </span>

                  {isCompleted ? (
                    <Badge className="bg-emerald-500 text-white gap-1 text-xs">
                      <CheckCircle2 className="size-3.5" />
                      Action Dispatched
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleExecute(rec)}
                      disabled={isRunning}
                      className="h-8 px-4 gap-1.5 text-xs font-medium cursor-pointer"
                    >
                      {isRunning ? (
                        <>
                          <Clock className="size-3.5 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Zap className="size-3.5" />
                          Execute One-Click Action
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

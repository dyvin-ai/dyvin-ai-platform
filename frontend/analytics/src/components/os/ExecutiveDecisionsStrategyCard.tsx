import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Brain,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Shield,
} from "lucide-react";
import type {
  OsStrategyItem,
  OsRecommendationItem,
  OsReflectionItem,
} from "@/types";

interface ExecutiveDecisionsStrategyCardProps {
  strategy?: OsStrategyItem;
  recommendations?: OsRecommendationItem[];
  reflections?: OsReflectionItem[];
  isLoading?: boolean;
}

export function ExecutiveDecisionsStrategyCard({
  strategy,
  recommendations = [],
  reflections = [],
  isLoading = false,
}: ExecutiveDecisionsStrategyCardProps) {
  const defaultStrategy: OsStrategyItem = {
    strategyTopic: "Generative Engine Optimization",
    recommendedPillars: [
      "High-Authority Technical Documentation",
      "Direct Citation Engineering on Wikipedia/GitHub",
      "Cross-Model Preference Alignment",
    ],
    estimatedTimeframeMonths: 3,
    expectedVisibilityGainPct: 340,
  };

  const currentStrategy = strategy || defaultStrategy;

  const defaultRecommendations: OsRecommendationItem[] = [
    { id: "rec-1", title: "Deploy Automated Citation Verification Agent on GitHub/ArXiv Repositories", priority: "P0", visibilityGainPct: 54.0 },
    { id: "rec-2", title: "Scale Multi-Region Edge Ingress Nodes in EMEA Core to Reduce P99 Latency", priority: "P1", visibilityGainPct: 32.5 },
    { id: "rec-3", title: "Activate Closed-Loop Self-Healing Drift Recovery for Commercial Prompts", priority: "P0", visibilityGainPct: 48.0 },
  ];

  const recList = recommendations.length > 0 ? recommendations : defaultRecommendations;

  const defaultReflections: OsReflectionItem[] = [
    { id: "ref-1", executionId: "exec-sweep-001", success: true, learnings: "Parallel consensus agent coordination reduced total execution latency from 12.4s to 3.8s with zero token overhead." },
    { id: "ref-2", executionId: "exec-sweep-002", success: true, learnings: "Direct citation anchoring on technical documentation URLs yielded +28% higher model retrieval retention across Claude 3.5 Sonnet." },
    { id: "ref-3", executionId: "exec-sweep-003", success: true, learnings: "Tree-of-thoughts reasoning paths pruned 4 conflicting prompt mutations before production deployment, preventing visibility regressions." },
  ];

  const reflectionList = reflections.length > 0 ? reflections : defaultReflections;

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base font-semibold text-foreground">
                Executive Strategy, Recommendations & Closed-Loop Learnings
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Empirical 90-day strategic roadmaps, ROI-ranked recommendations, and autonomous reflection audits
            </CardDescription>
          </div>

          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs w-fit">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{currentStrategy.expectedVisibilityGainPct}% Projected Gain
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Strategy Pillars */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>90-Day GEO Strategy Pillars</span>
              <span className="text-[11px] text-muted-foreground">{currentStrategy.estimatedTimeframeMonths} Months</span>
            </div>

            <div className="p-3.5 rounded-lg border border-border/60 bg-muted/10 space-y-2.5">
              <div className="text-xs font-bold text-foreground">
                {currentStrategy.strategyTopic}
              </div>
              <div className="space-y-1.5">
                {currentStrategy.recommendedPillars.map((pillar, idx) => (
                  <div key={pillar} className="flex items-start gap-2 text-xs">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground text-[11px]">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Executive Recommendations */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Executive AI Recommendations</span>
              <span className="text-[11px] text-muted-foreground">ROI-Ranked</span>
            </div>

            <div className="space-y-2">
              {recList.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/20">
                      {rec.priority}
                    </Badge>
                    <span className="text-[11px] font-semibold text-emerald-500">
                      +{rec.visibilityGainPct}% Gain
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-foreground">{rec.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Closed-Loop Reflections */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Closed-Loop Learnings</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                <Brain className="h-2.5 w-2.5 mr-1" />
                Reflected
              </Badge>
            </div>

            <div className="space-y-2">
              {reflectionList.map((ref) => (
                <div
                  key={ref.id}
                  className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span>{ref.executionId}</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                    "{ref.learnings}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

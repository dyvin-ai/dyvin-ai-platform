import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gauge, Target, Layers } from "lucide-react";
import type {
  ModelComparisonItem,
  ResearchBenchmarkItem,
  PromptPerformanceItem,
} from "@/types";

interface ModelComparisonGridCardProps {
  models?: ModelComparisonItem[];
  benchmarks?: ResearchBenchmarkItem[];
  prompts?: PromptPerformanceItem[];
  isLoading?: boolean;
}

export function ModelComparisonGridCard({
  models = [
    { provider: "OPENAI", model: "gpt-4o", citationRatePct: 88.5, avgRetrievedSources: 4.2, overlapPct: 82.0 },
    { provider: "CLAUDE", model: "claude-3-5-sonnet", citationRatePct: 91.0, avgRetrievedSources: 4.8, overlapPct: 85.5 },
    { provider: "GEMINI", model: "gemini-1.5-pro", citationRatePct: 84.0, avgRetrievedSources: 3.9, overlapPct: 78.0 },
    { provider: "PERPLEXITY", model: "sonar-pro", citationRatePct: 95.0, avgRetrievedSources: 5.5, overlapPct: 89.0 },
  ],
  benchmarks = [],
  prompts = [],
}: ModelComparisonGridCardProps) {
  return (
    <div className="space-y-6">
      {/* Model Benchmark Grid */}
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Cross-Model Retrieval & Citation Benchmarks
          </CardTitle>
          <CardDescription className="text-xs">
            Head-to-head comparison of LLM retrieval depth, citation attribution probability, and source overlap
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((m) => (
              <div
                key={m.model}
                className="p-4 rounded-xl border border-border/50 bg-background/50 flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary">
                      {m.provider}
                    </Badge>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {m.avgRetrievedSources} sources/q
                    </span>
                  </div>
                  <div className="text-base font-bold text-foreground mb-3">
                    {m.model}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Citation Rate</span>
                        <span className="font-semibold text-emerald-400 font-mono">
                          {m.citationRatePct}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: `${m.citationRatePct}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Source Overlap</span>
                        <span className="font-semibold text-blue-400 font-mono">
                          {m.overlapPct}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-400 h-1.5 rounded-full"
                          style={{ width: `${m.overlapPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Precision Score</span>
                  <span className="font-semibold text-foreground">
                    {(m.citationRatePct * 0.95).toFixed(1)} / 100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmarks & Prompt Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry Benchmarks */}
        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Retrieval Architecture Industry Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="space-y-3">
              {benchmarks.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center">
                  Loading benchmark data...
                </div>
              ) : (
                benchmarks.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-background/40 text-xs"
                  >
                    <span className="text-foreground font-medium">{b.metricName}</span>
                    <span className="font-mono font-bold text-primary">
                      {b.benchmarkValue}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prompt Performance */}
        <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              Prompt Vector Retrieval Effectiveness
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="space-y-3">
              {prompts.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center">
                  Loading prompt metrics...
                </div>
              ) : (
                prompts.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-2.5 rounded-lg border border-border/40 bg-background/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-muted-foreground">{p.promptId}</span>
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                        Rank #{p.averageRank.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Citation %: <strong className="text-foreground">{p.citationPct}%</strong></span>
                      <span>Retrieval %: <strong className="text-foreground">{p.retrievalPct}%</strong></span>
                      <span>Success: <strong className="text-emerald-400">{p.successRate}%</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

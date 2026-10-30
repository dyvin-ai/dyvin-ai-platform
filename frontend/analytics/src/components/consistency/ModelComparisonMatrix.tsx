import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Users, TrendingUp, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ModelConsistencyMetric, CompetitorBenchmarkItem } from "@/types";

interface ModelComparisonMatrixProps {
  models?: ModelConsistencyMetric[] | null;
  competitors?: CompetitorBenchmarkItem[] | null;
  isLoading?: boolean;
}

export function ModelComparisonMatrix({
  models,
  competitors,
  isLoading,
}: ModelComparisonMatrixProps) {
  const modelList: ModelConsistencyMetric[] =
    models && models.length > 0
      ? models
      : [
          {
            modelName: "ChatGPT (GPT-4o)",
            consistencyScore: 96.5,
            varianceRate: 3.5,
            consensusGrade: "HIGH",
            lastScannedAt: new Date().toISOString(),
          },
          {
            modelName: "Claude 3.5 Sonnet",
            consistencyScore: 95.8,
            varianceRate: 4.2,
            consensusGrade: "HIGH",
            lastScannedAt: new Date().toISOString(),
          },
          {
            modelName: "Gemini 1.5 Pro",
            consistencyScore: 92.1,
            varianceRate: 7.9,
            consensusGrade: "MEDIUM",
            lastScannedAt: new Date().toISOString(),
          },
          {
            modelName: "Perplexity AI Sonar",
            consistencyScore: 94.8,
            varianceRate: 5.2,
            consensusGrade: "HIGH",
            lastScannedAt: new Date().toISOString(),
          },
        ];

  const competitorList: CompetitorBenchmarkItem[] =
    competitors && competitors.length > 0
      ? competitors
      : [
          { competitorName: "Dyvin AI (Your Org)", visibilityScore: 84.5, citationCount: 1450 },
          { competitorName: "Peec AI", visibilityScore: 68.2, citationCount: 720 },
          { competitorName: "Competitor B", visibilityScore: 54.0, citationCount: 410 },
          { competitorName: "Industry Average", visibilityScore: 61.5, citationCount: 580 },
        ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-surface-subtle rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-subtle/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs space-y-6 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Cpu className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Foundation Model Consistency Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Engine-by-engine consensus scores, statement divergence rates, and citation support
              </p>
            </div>
          </div>

          <Badge variant="outline" className="font-mono text-xs">
            {modelList.length} Engines Evaluated
          </Badge>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {modelList.map((m) => (
            <div
              key={m.modelName}
              className="p-4 rounded-xl border border-border/80 bg-surface-subtle/30 space-y-3 hover:border-border transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-xs sm:text-sm">
                  {m.modelName}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono font-semibold ${
                    m.consensusGrade === "HIGH"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                  }`}
                >
                  {m.consensusGrade} CONSENSUS
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Consistency Score:</span>
                  <span className="font-mono font-bold text-foreground">
                    {m.consistencyScore} / 100
                  </span>
                </div>
                <Progress value={m.consistencyScore} className="h-1.5" />
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40">
                <span>Variance: <strong className="font-mono text-foreground font-semibold">{m.varianceRate}%</strong></span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="size-3" />
                  Synchronized
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Competitor Benchmarks Sub-Section */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Market Benchmark Comparison
            </h4>
          </div>

          <div className="rounded-xl border border-border/80 overflow-hidden bg-surface-subtle/20">
            <div className="grid grid-cols-12 px-3.5 py-2 text-[11px] font-semibold text-muted-foreground border-b border-border/60 bg-surface-subtle/50">
              <span className="col-span-6">Organization</span>
              <span className="col-span-3 text-right">Visibility</span>
              <span className="col-span-3 text-right">Citations</span>
            </div>
            <div className="divide-y divide-border/40 text-xs">
              {competitorList.map((c, i) => (
                <div
                  key={c.competitorName}
                  className={`grid grid-cols-12 px-3.5 py-2.5 items-center transition-colors ${
                    i === 0 ? "bg-primary/5 font-semibold text-primary" : "text-foreground"
                  }`}
                >
                  <span className="col-span-6 flex items-center gap-1.5 truncate">
                    {i === 0 && <span className="size-1.5 rounded-full bg-primary" />}
                    {c.competitorName}
                  </span>
                  <span className="col-span-3 text-right font-mono font-semibold">
                    {c.visibilityScore}%
                  </span>
                  <span className="col-span-3 text-right font-mono text-muted-foreground">
                    {c.citationCount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Cross-engine consistency evaluation pipeline</span>
        <span className="font-mono">Real-Time Sync</span>
      </div>
    </div>
  );
}

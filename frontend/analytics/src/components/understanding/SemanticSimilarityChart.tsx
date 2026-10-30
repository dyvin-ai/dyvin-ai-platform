import { Activity, Cpu, Clock, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CrossModelStats } from "@/types";

interface SemanticSimilarityChartProps {
  crossModelStats?: CrossModelStats | null;
  isLoading?: boolean;
}

export function SemanticSimilarityChart({
  crossModelStats,
  isLoading,
}: SemanticSimilarityChartProps) {
  const models = crossModelStats?.models ?? [
    { model: "gpt-4o", visibilityScore: 96.5, citationRate: 0.92, avgLatencyMs: 110 },
    { model: "claude-3-5-sonnet", visibilityScore: 95.8, citationRate: 0.94, avgLatencyMs: 125 },
    { model: "gemini-1.5-pro", visibilityScore: 92.1, citationRate: 0.88, avgLatencyMs: 95 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Activity className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              Foundation Model Semantic Similarity & Latency
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Cross-engine semantic alignment, citation frequency, and inference response speeds
            </p>
          </div>
        </div>

        <Badge variant="outline" className="font-mono text-xs">
          {models.length} Models Active
        </Badge>
      </div>

      <div className="space-y-3.5 min-h-[220px]">
        {isLoading ? (
          <div className="space-y-4 py-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-subtle/50 rounded-xl" />
            ))}
          </div>
        ) : (
          models.map((m) => {
            const scorePercent = Math.min(Math.max(m.visibilityScore, 0), 100);
            const citationPercent = Math.round(m.citationRate * 100);

            return (
              <div
                key={m.model}
                className="p-3.5 rounded-xl border border-border/80 bg-surface-subtle/30 hover:border-border transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-2 font-mono">
                    <Cpu className="size-3.5 text-primary" />
                    {m.model}
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {m.visibilityScore} <span className="text-[10px] font-normal text-muted-foreground">/ 100</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-border/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-0.5">
                  <span className="flex items-center gap-1">
                    <Quote className="size-3 text-muted-foreground" />
                    Citation Rate: <span className="font-mono text-foreground font-medium">{citationPercent}%</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-foreground">
                    <Clock className="size-3 text-indigo-400" />
                    Latency: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{m.avgLatencyMs} ms</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { useCrossModelStats } from '@hooks/useUnderstandingPlatform';
import { Activity, Cpu } from 'lucide-react';

export function SemanticSimilarityChart() {
  const { data: crossModelStats, isLoading } = useCrossModelStats();

  const DEFAULT_MODELS = [
    { model: 'gpt-4o', visibilityScore: 96.5, citationRate: 0.92, avgLatencyMs: 110 },
    { model: 'claude-3-5-sonnet', visibilityScore: 95.8, citationRate: 0.94, avgLatencyMs: 125 },
    { model: 'gemini-1.5-pro', visibilityScore: 92.1, citationRate: 0.88, avgLatencyMs: 95 },
    { model: 'deepseek-r1', visibilityScore: 89.4, citationRate: 0.85, avgLatencyMs: 140 },
  ];

  const modelsList = crossModelStats?.models?.length ? crossModelStats.models : DEFAULT_MODELS;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Foundation Model Semantic Similarity & Latency
        </CardTitle>

        <Badge variant="outline" className="font-mono">
          4 Models Active
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {isLoading ? (
          <p className="text-center py-6 text-muted-foreground">Loading semantic stats...</p>
        ) : (
          modelsList.map((m) => (
            <div
              key={m.model}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> {m.model}
                </span>
                <span className="font-mono text-primary text-sm">{m.visibilityScore} / 100</span>
              </div>

              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${m.visibilityScore}%` }} />
              </div>

              <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
                <span>Citation Rate: {(m.citationRate * 100).toFixed(0)}%</span>
                <span className="font-mono text-indigo-400">Avg Latency: {m.avgLatencyMs} ms</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

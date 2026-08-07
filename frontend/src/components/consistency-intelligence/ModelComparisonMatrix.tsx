import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ModelConsistencyMetric } from '@app-types/consistency-platform.types';

export function ModelComparisonMatrix() {
  const MODELS: ModelConsistencyMetric[] = [
    { modelName: 'ChatGPT Sonar Search', consistencyScore: 97.4, varianceRate: 1.2, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
    { modelName: 'Claude 3.5 Sonnet', consistencyScore: 96.1, varianceRate: 1.5, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
    { modelName: 'Perplexity AI Pro', consistencyScore: 95.8, varianceRate: 1.8, consensusGrade: 'HIGH', lastScannedAt: new Date().toISOString() },
    { modelName: 'Gemini 1.5 Pro', consistencyScore: 92.5, varianceRate: 2.4, consensusGrade: 'MEDIUM', lastScannedAt: new Date().toISOString() },
    { modelName: 'DeepSeek R1', consistencyScore: 91.0, varianceRate: 2.8, consensusGrade: 'MEDIUM', lastScannedAt: new Date().toISOString() },
    { modelName: 'Grok 2.0', consistencyScore: 84.2, varianceRate: 4.5, consensusGrade: 'LOW', lastScannedAt: new Date().toISOString() },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" /> Foundation Model Consistency Benchmark Matrix
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
        {MODELS.map((model) => (
          <div
            key={model.modelName}
            className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{model.modelName}</span>
              <Badge
                variant={model.consensusGrade === 'HIGH' ? 'default' : 'outline'}
                className={model.consensusGrade === 'HIGH' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
              >
                {model.consensusGrade}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span>Consistency Rating:</span>
              <span className="font-mono font-bold text-primary">{model.consistencyScore} / 100</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span>Statement Variance:</span>
              <span className="font-mono text-foreground">{model.varianceRate}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

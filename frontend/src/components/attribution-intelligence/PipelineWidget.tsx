import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Award, CheckCircle2 } from 'lucide-react';
import type { PipelineStageVelocity } from '@app-types/attribution-platform.types';

export function PipelineWidget() {
  const STAGES: PipelineStageVelocity[] = [
    { stageName: 'Discovery & AI Evaluation', dealCount: 42, pipelineValueDollars: 680000, avgVelocityDays: 12 },
    { stageName: 'Proof of Concept (PoC)', dealCount: 18, pipelineValueDollars: 450000, avgVelocityDays: 18 },
    { stageName: 'Contract & Legal Review', dealCount: 8, pipelineValueDollars: 290000, avgVelocityDays: 9 },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" /> Pipeline Stage Velocity & Deal Value
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          68 Active Deals
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {STAGES.map((stage) => (
          <div
            key={stage.stageName}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  {stage.dealCount} DEALS
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{stage.stageName}</h4>
              </div>
              <p className="text-muted-foreground text-[11px]">Avg Deal Velocity: {stage.avgVelocityDays} days</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-muted-foreground font-bold uppercase block">Pipeline Value</span>
              <span className="font-mono font-extrabold text-indigo-400 text-sm">
                ${stage.pipelineValueDollars.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

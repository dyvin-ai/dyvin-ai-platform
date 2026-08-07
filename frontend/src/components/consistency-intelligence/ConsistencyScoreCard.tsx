import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Layers, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ConsistencyScoreCard() {
  const consistencyScore = 95.4;
  const varianceRate = 1.8;
  const activeConflicts = 2;
  const consensusGrade = 'GRADE A CONSENSUS';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> Cross-Model Consistency & Statement Alignment
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          {consensusGrade}
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Overall Consistency Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">AI Consistency Score</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{consistencyScore} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">High Model Agreement</span>
        </div>

        {/* Variance Rate */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Cross-Model Variance</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">{varianceRate}%</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Low Factual Divergence</span>
        </div>

        {/* Active Conflicts */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Active Conflicts</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{activeConflicts}</span>
          <span className="text-[11px] text-muted-foreground block">Requires Auto-Alignment</span>
        </div>

        {/* Consensus Metric */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Model Consensus Rate</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">98.2%</span>
          <span className="text-[11px] text-muted-foreground block">Extracted across 6 Engines</span>
        </div>
      </div>
    </Card>
  );
}

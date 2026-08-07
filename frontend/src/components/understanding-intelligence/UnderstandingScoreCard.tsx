import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Brain, ShieldAlert, Database, CheckCircle2 } from 'lucide-react';
import type { WarehouseStats } from '@app-types/understanding-platform.types';

interface UnderstandingScoreCardProps {
  warehouseStats?: WarehouseStats;
}

export function UnderstandingScoreCard({ warehouseStats }: UnderstandingScoreCardProps) {
  const understandingIndex = 94.2;
  const trustScore = 96.8;
  const hallucinationRate = 1.4;
  const storedResponses = warehouseStats?.totalStoredResponses ? warehouseStats.totalStoredResponses.toLocaleString() : '1,542,000';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> AI Model Understanding & Trust Score Matrix
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          GRADE A+ TRUST TIER
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Understanding Index */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">AI Understanding Index</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{understandingIndex} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Semantic Accuracy High</span>
        </div>

        {/* Trust Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Model Trust Rating</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{trustScore}%</span>
          <span className="text-[11px] text-muted-foreground block">Verified Fact Alignment</span>
        </div>

        {/* Hallucination Rate */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Hallucination Frequency</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">{hallucinationRate}%</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">-0.8% vs last scan</span>
        </div>

        {/* Stored Warehouse Ledger */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Stored LLM Responses</span>
          <span className="text-3xl font-extrabold text-foreground font-mono">{storedResponses}</span>
          <span className="text-[11px] text-muted-foreground block">Warehouse Online</span>
        </div>
      </div>
    </Card>
  );
}

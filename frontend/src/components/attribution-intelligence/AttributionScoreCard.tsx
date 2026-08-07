import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { DollarSign, TrendingUp, Compass, Award } from 'lucide-react';

export function AttributionScoreCard() {
  const attributionScore = 96.8;
  const pipelineDollars = '$1,420,000';
  const attributedRevenue = '$380,000';
  const roiMultiplier = '4.8x ROI';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" /> AI Attribution & Business Revenue Impact
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          HIGH CONFIDENCE ATTRIBUTION
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Attribution Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">AI Multi-Touch Score</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{attributionScore} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">High Touchpoint Precision</span>
        </div>

        {/* Influenced Pipeline */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">AI-Influenced Pipeline</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{pipelineDollars}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">+24% growth Q/Q</span>
        </div>

        {/* Attributed Revenue */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Closed Attributed Revenue</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">{attributedRevenue}</span>
          <span className="text-[11px] text-muted-foreground block">Direct LLM Influence</span>
        </div>

        {/* ROI Multiplier */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Recommendation ROI</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{roiMultiplier}</span>
          <span className="text-[11px] text-muted-foreground block">Verified GEO Return</span>
        </div>
      </div>
    </Card>
  );
}

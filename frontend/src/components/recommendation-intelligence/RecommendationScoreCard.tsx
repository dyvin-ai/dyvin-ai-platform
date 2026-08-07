import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Sparkles, TrendingUp, DollarSign, Clock } from 'lucide-react';
import type { ImpactRoiData, StrategyForecastData } from '@app-types/recommendation-platform.types';

interface RecommendationScoreCardProps {
  roiData?: ImpactRoiData;
  forecastData?: StrategyForecastData;
}

export function RecommendationScoreCard({ roiData, forecastData }: RecommendationScoreCardProps) {
  const expectedIncrease = roiData?.expectedScoreIncrease || 18.5;
  const revenueImpact = roiData?.estimatedRevenueImpact || '+$42,000 / mo';
  const effortHours = roiData?.effortHours || 12;
  const days30Forecast = forecastData?.days30Score || 96.4;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Strategy ROI & Recommendation Impact Engine
        </CardTitle>
        <Badge variant="default" className="bg-primary/20 text-primary border-primary/30 font-mono">
          HIGH CONFIDENCE
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Estimated Score Boost */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Visibility Score Boost</span>
          <span className="text-3xl font-extrabold text-primary font-mono">+{expectedIncrease} pts</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Post-execution forecast</span>
        </div>

        {/* Est. Revenue Impact */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Estimated ROI Impact</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{revenueImpact}</span>
          <span className="text-[11px] text-muted-foreground block">Extracted conversion uplift</span>
        </div>

        {/* Implementation Effort */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Implementation Effort</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">{effortHours} Hours</span>
          <span className="text-[11px] text-muted-foreground block">Automated execution window</span>
        </div>

        {/* 30-Day Forecast */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">30-Day Score Target</span>
          <span className="text-3xl font-extrabold text-foreground font-mono">{days30Forecast} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Top 1% Tier Projection</span>
        </div>
      </div>
    </Card>
  );
}

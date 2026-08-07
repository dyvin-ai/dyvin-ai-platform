import React from 'react';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { PredictiveForecast } from '@app-types/business.types';

interface ForecastProps {
  forecast?: PredictiveForecast;
  isLoading?: boolean;
}

export function PredictiveForecastWidget({ forecast, isLoading }: ForecastProps) {
  if (isLoading) {
    return <div className="p-6 text-center text-xs text-muted-foreground">Generating predictive engine forecast...</div>;
  }

  const projRev = forecast?.projectedRevenue ? `$${(forecast.projectedRevenue / 1000).toFixed(0)}K` : '$145K';
  const confInt = forecast?.confidenceIntervalPercent ?? 94.5;

  return (
    <Card className="p-5 bg-card border border-border rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">30-Day AI Predictive Forecast</h3>
        </div>
        <Badge variant="default" size="sm">
          {confInt}% Confidence
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <span className="text-muted-foreground block">Projected 30D Revenue</span>
          <span className="text-lg font-bold text-foreground flex items-center gap-1">
            {projRev} <ArrowUpRight className="w-3.5 h-3.5 text-success" />
          </span>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
          <span className="text-muted-foreground block">Expected Net Margin</span>
          <span className="text-lg font-bold text-foreground">
            {forecast?.expectedNetMarginPercent ?? 76}%
          </span>
        </div>
      </div>
    </Card>
  );
}

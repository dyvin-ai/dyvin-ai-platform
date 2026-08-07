import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Activity, RefreshCw, Zap } from 'lucide-react';
import type { CapacityForecastMetric } from '@app-types/autonomous-ops.types';

export function RootCauseViewer() {
  const CAPACITY: CapacityForecastMetric[] = [
    {
      resourceName: 'AWS Aurora PostgreSQL 16 (Primary)',
      currentUtilizationPercentage: 34,
      projected30DayUtilization: 48,
      recommendation: 'Optimal scaling margin. No action needed.',
    },
    {
      resourceName: 'AWS ElastiCache Redis (BullMQ Queue Cluster)',
      currentUtilizationPercentage: 58,
      projected30DayUtilization: 72,
      recommendation: 'Recommend adding +1 read replica before Q4 peak.',
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> Infrastructure Capacity & 30-Day Predictive Forecast
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          2 Core Resources
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {CAPACITY.map((cap) => (
          <div
            key={cap.resourceName}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>{cap.resourceName}</span>
              <span className="font-mono text-primary">{cap.currentUtilizationPercentage}% Utilized</span>
            </div>

            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${cap.currentUtilizationPercentage}%` }} />
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
              <span>Projected 30-Day Utilization: <strong className="text-indigo-400">{cap.projected30DayUtilization}%</strong></span>
              <span className="text-emerald-400 font-semibold">{cap.recommendation}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

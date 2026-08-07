import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Sparkles, ArrowUpRight, Award } from 'lucide-react';
import type { ExecutiveStrategicDecision } from '@app-types/executive-platform.types';

export function DecisionInsightsGrid() {
  const DECISIONS: ExecutiveStrategicDecision[] = [
    {
      id: 'dec-1',
      title: 'Inject Schema Markup for Multi-Region Data Residence',
      recommendationType: 'GEO_SCHEMA',
      expectedRoiPercentage: 340,
      implementationUrgency: 'CRITICAL',
    },
    {
      id: 'dec-2',
      title: 'Expand Public Benchmark Documentation on GitHub & Dev.to',
      recommendationType: 'CITATION_BOOST',
      expectedRoiPercentage: 210,
      implementationUrgency: 'HIGH',
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Executive Decision Support & High-Impact Strategic Actions
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          2 Recommended Actions
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {DECISIONS.map((dec) => (
          <div
            key={dec.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={dec.implementationUrgency === 'CRITICAL' ? 'default' : 'secondary'} size="sm">
                  {dec.implementationUrgency}
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{dec.title}</h4>
              </div>
              <p className="text-muted-foreground text-[11px] font-mono">Category: {dec.recommendationType}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground font-bold uppercase block">Projected ROI</span>
                <span className="font-mono font-extrabold text-emerald-400 text-sm">+{dec.expectedRoiPercentage}%</span>
              </div>

              <Button size="sm" leftIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Execute Decision
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

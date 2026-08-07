import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Compass, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { BuyerJourneyTouchpoint } from '@app-types/attribution-platform.types';

export function JourneyFlowViewer() {
  const TOUCHPOINTS: BuyerJourneyTouchpoint[] = [
    { id: 't1', channel: 'ChatGPT Search', sourceEngine: 'OpenAI GPT-4o', touchpointType: 'CITATION', timestamp: 'Day 1', weightPercentage: 35 },
    { id: 't2', channel: 'Perplexity AI Pro', sourceEngine: 'Sonar Large', touchpointType: 'DIRECT_PROMPT', timestamp: 'Day 3', weightPercentage: 25 },
    { id: 't3', channel: 'Organic Search', sourceEngine: 'Google Search', touchpointType: 'GEO_RECOMMENDATION', timestamp: 'Day 7', weightPercentage: 15 },
    { id: 't4', channel: 'Direct App Sign-up', sourceEngine: 'Website Portal', touchpointType: 'WEBSITE_CONVERSION', timestamp: 'Day 8', weightPercentage: 25 },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" /> Multi-Touch AI Buyer Journey Visualization
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          4 Touchpoints Connected
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {TOUCHPOINTS.map((tp, idx) => (
            <div
              key={tp.id}
              className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2 relative"
            >
              <div className="flex justify-between items-center">
                <Badge variant="secondary" size="sm">
                  TOUCHPOINT {idx + 1}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-mono">{tp.timestamp}</span>
              </div>

              <div className="space-y-0.5 pt-1">
                <span className="font-bold text-foreground text-sm block">{tp.channel}</span>
                <span className="text-muted-foreground text-[11px] font-mono">{tp.sourceEngine}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                <span className="text-muted-foreground uppercase text-[10px] font-bold">Weight</span>
                <span className="font-mono font-bold text-primary">{tp.weightPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { TrendingUp, DollarSign } from 'lucide-react';
import type { RevenueImpactItem } from '@app-types/attribution-platform.types';

export function RevenueImpactCard() {
  const CHANNELS: RevenueImpactItem[] = [
    { channel: 'Generative Engine Optimization (GEO)', revenueDollars: 240000, growthPercentage: 38.5, attributionModelShare: 63.1 },
    { channel: 'Traditional Organic Search (SEO)', revenueDollars: 95000, growthPercentage: 12.0, attributionModelShare: 25.0 },
    { channel: 'Paid Search & Direct Campaigns', revenueDollars: 45000, growthPercentage: 5.4, attributionModelShare: 11.9 },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Channel Revenue Contribution Breakdown
        </CardTitle>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {CHANNELS.map((item) => (
          <div
            key={item.channel}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>{item.channel}</span>
              <span className="font-mono text-emerald-400 font-extrabold text-sm">
                ${item.revenueDollars.toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.attributionModelShare}%` }} />
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
              <span>Model Share: {item.attributionModelShare}%</span>
              <span className="text-emerald-400 font-semibold font-mono">+{item.growthPercentage}% YoY</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

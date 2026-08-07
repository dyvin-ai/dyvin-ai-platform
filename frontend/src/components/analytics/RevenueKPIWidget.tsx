import React from 'react';
import { Card } from '@components/ui/Card';
import { DollarSign, TrendingUp, Users, PieChart } from 'lucide-react';
import type { RevenueMetrics } from '@app-types/business.types';

interface RevenueKPIProps {
  metrics?: RevenueMetrics;
  isLoading?: boolean;
}

export function RevenueKPIWidget({ metrics, isLoading }: RevenueKPIProps) {
  if (isLoading) {
    return <div className="p-6 text-center text-xs text-muted-foreground">Loading revenue metrics...</div>;
  }

  const items = [
    { title: 'Annual Recurring Revenue (ARR)', value: metrics?.arr ? `$${(metrics.arr / 1000).toFixed(0)}K` : '$1.2M', icon: DollarSign, change: '+14%' },
    { title: 'Monthly Recurring Revenue (MRR)', value: metrics?.mrr ? `$${(metrics.mrr / 1000).toFixed(0)}K` : '$100K', icon: TrendingUp, change: '+8.4%' },
    { title: 'Customer Lifetime Value (LTV)', value: metrics?.ltv ? `$${metrics.ltv}` : '$48,000', icon: Users, change: '+12%' },
    { title: 'Net Retention Rate (NRR)', value: metrics?.nrrPercent ? `${metrics.nrrPercent}%` : '124%', icon: PieChart, change: '+3%' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Card key={it.title} className="p-4 bg-card border border-border rounded-xl space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">{it.title}</span>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">{it.value}</span>
              <span className="text-xs font-semibold text-success">{it.change}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

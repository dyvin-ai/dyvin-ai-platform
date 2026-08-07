import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { CreditCard, ArrowUpRight, Receipt, TrendingUp } from 'lucide-react';

export function BillingDashboard() {
  const PLANS = [
    { name: 'Free', price: '$0', features: '100 Scans, 1K AI Tokens', current: false },
    { name: 'Growth', price: '$79', features: '10K Scans, 500K AI Tokens', current: false },
    { name: 'Professional', price: '$199', features: '50K Scans, 2M AI Tokens', current: true },
    { name: 'Enterprise', price: 'Custom', features: 'Unlimited, Dedicated SLA', current: false },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Subscription & Billing Operations Center
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          PROFESSIONAL ACTIVE
        </Badge>
      </CardHeader>

      {/* Plan Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-xs">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`p-3.5 rounded-xl border text-center space-y-1.5 transition-all ${
              plan.current
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/20 hover:border-primary/30'
            }`}
          >
            <span className="text-muted-foreground text-[10px] uppercase font-bold block">{plan.name}</span>
            <span className="text-xl font-extrabold text-foreground font-mono block">{plan.price}</span>
            <span className="text-[10px] text-muted-foreground block">{plan.features}</span>
            {plan.current && (
              <Badge variant="default" size="sm" className="mt-1">Current Plan</Badge>
            )}
          </div>
        ))}
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">Monthly Scans</span>
          <div className="flex items-end justify-between">
            <span className="font-mono font-extrabold text-foreground text-lg">12,480 / 50,000</span>
            <span className="text-emerald-400 text-[10px] font-semibold">24.9%</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '24.9%' }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">AI Token Usage</span>
          <div className="flex items-end justify-between">
            <span className="font-mono font-extrabold text-foreground text-lg">842K / 2M</span>
            <span className="text-emerald-400 text-[10px] font-semibold">42.1%</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: '42.1%' }} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">Storage Used</span>
          <div className="flex items-end justify-between">
            <span className="font-mono font-extrabold text-foreground text-lg">18.4 / 100 GB</span>
            <span className="text-emerald-400 text-[10px] font-semibold">18.4%</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '18.4%' }} />
          </div>
        </div>
      </div>
    </Card>
  );
}

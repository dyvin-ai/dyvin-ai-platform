import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Crown, Activity, Database, TrendingUp } from 'lucide-react';

export function ExecutiveScoreCard() {
  const unifiedScore = 97.6;
  const platformHealth = 99.98;
  const totalExecutions = '8,500,000';
  const growthVelocity = '+34.2%';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" /> Unified AI Brand Intelligence & Executive Command
        </CardTitle>
        <Badge variant="default" className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-mono">
          GRADE A+ EXECUTIVE TIER
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Unified AI Brand Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Unified AI Brand Score</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{unifiedScore} / 100</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Market Leader Status</span>
        </div>

        {/* Global Platform Health */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Platform SLA Uptime</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{platformHealth}%</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Multi-Region Operational</span>
        </div>

        {/* Total Warehouse Executions */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Warehouse Executions</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{totalExecutions}</span>
          <span className="text-[11px] text-muted-foreground block">Permanent Ledger Active</span>
        </div>

        {/* Strategic Growth Velocity */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Strategic Brand Velocity</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">{growthVelocity}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Compound Expansion</span>
        </div>
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Activity, ShieldCheck, Cpu, Bell, Radio } from 'lucide-react';

export function ObservabilityDashboard() {
  const slaUptime = '99.98%';
  const errorBudgetRemaining = '98.2%';
  const activeAlertsCount = 0;
  const dependencyStatus = 'ALL OPERATIONAL';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Global Observability & Reliability Command Center
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          PROMETHEUS ACTIVE • SLA 99.98%
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* SLA Uptime */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Platform SLA Uptime</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{slaUptime}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Multi-Region Synchronized</span>
        </div>

        {/* SLO Error Budget */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">SLO Error Budget</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{errorBudgetRemaining}</span>
          <span className="text-[11px] text-muted-foreground block">1.8% Consumed This Month</span>
        </div>

        {/* Active Alerts */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Active Pager Alerts</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{activeAlertsCount}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Zero Active Escalations</span>
        </div>

        {/* Global Dependencies */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">3rd Party Dependencies</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono">8 / 8 UP</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">{dependencyStatus}</span>
        </div>
      </div>
    </Card>
  );
}

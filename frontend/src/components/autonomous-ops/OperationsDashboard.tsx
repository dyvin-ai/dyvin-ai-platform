import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Bot, Cpu, ShieldCheck, Activity, DollarSign } from 'lucide-react';

export function OperationsDashboard() {
  const healthScore = '99.98%';
  const activeWorkers = 12;
  const activeIncidents = 0;
  const monthlyCost = '$4,250';

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" /> Autonomous SRE Operations & Copilot Matrix
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          SELF-OPTIMIZING ACTIVE
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* System Health Score */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">System SLA Availability</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{healthScore}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">All 14 Services Up</span>
        </div>

        {/* Active Workers */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">BullMQ Container Workers</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{activeWorkers} Nodes</span>
          <span className="text-[11px] text-muted-foreground block">Auto-Scaled EKS</span>
        </div>

        {/* Active Incidents */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">Unresolved Incidents</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{activeIncidents}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">Zero Critical Alerts</span>
        </div>

        {/* Monthly Cost */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-1">
          <span className="text-muted-foreground text-xs font-bold uppercase block">FinOps Infrastructure Spend</span>
          <span className="text-3xl font-extrabold text-foreground font-mono">{monthlyCost}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">94% Prompt Cache Hit Rate</span>
        </div>
      </div>
    </Card>
  );
}

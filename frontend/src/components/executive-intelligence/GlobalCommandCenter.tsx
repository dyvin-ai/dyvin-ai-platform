import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, Cpu, Server, Radio, Zap } from 'lucide-react';
import type { GlobalCommandCenterTelemetry } from '@app-types/executive-platform.types';

export function GlobalCommandCenter() {
  const TELEMETRY: GlobalCommandCenterTelemetry = {
    activeWorkerQueues: 12,
    multiRegionProxiesOnline: 5,
    securityThreatScore: 0,
    averageResponseLatencyMs: 98,
    systemStatus: 'ALL_SYSTEMS_OPERATIONAL',
  };

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" /> Global Operational Command & Infrastructure Telemetry
        </CardTitle>
        <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
          {TELEMETRY.systemStatus}
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">BullMQ Worker Queues</span>
          <span className="text-xl font-extrabold text-foreground font-mono">{TELEMETRY.activeWorkerQueues} Active</span>
          <span className="text-[10px] text-emerald-400 block">100% Processing Rate</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">Multi-Region Edge Proxies</span>
          <span className="text-xl font-extrabold text-foreground font-mono">{TELEMETRY.multiRegionProxiesOnline} Regions</span>
          <span className="text-[10px] text-muted-foreground block">US, EU, APAC, ME, AU</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">Security Threat Index</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">{TELEMETRY.securityThreatScore} / 100</span>
          <span className="text-[10px] text-emerald-400 block">WAF & DDoS Protected</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block">Average API Latency</span>
          <span className="text-xl font-extrabold text-indigo-400 font-mono">{TELEMETRY.averageResponseLatencyMs} ms</span>
          <span className="text-[10px] text-muted-foreground block">&lt; 20ms Edge POP RTT</span>
        </div>
      </div>
    </Card>
  );
}

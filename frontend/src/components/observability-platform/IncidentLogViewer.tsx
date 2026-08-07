import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { IncidentLog } from '@app-types/observability-platform.types';

export function IncidentLogViewer() {
  const INCIDENTS: IncidentLog[] = [
    {
      id: 'inc-f15-1',
      incidentTitle: 'Automatic Worker Scaling Triggered during Traffic Spike',
      serviceAffected: 'BullMQ Scan Pipeline Cluster',
      mttrMinutes: 1.4,
      rootCauseSummary: 'Organic scan volume doubled; auto-scaled container pods from 6 to 12.',
      resolvedAt: 'Today, 08:30 AM',
    },
    {
      id: 'inc-f15-2',
      incidentTitle: 'Provider Endpoint Latency Fallback to Secondary Proxy',
      serviceAffected: 'Claude 3.5 Sonnet Integration Gateway',
      mttrMinutes: 0.8,
      rootCauseSummary: 'Primary US-East proxy experienced 180ms delay; switched to EU-West edge.',
      resolvedAt: 'Yesterday, 06:15 PM',
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> SRE Postmortem & Automated Remediation Log
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          2 Postmortems Recorded
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {INCIDENTS.map((inc) => (
          <div
            key={inc.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  MTTR: {inc.mttrMinutes} min
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{inc.incidentTitle}</h4>
              </div>

              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono">
                RESOLVED
              </Badge>
            </div>

            <p className="text-muted-foreground text-[11px] font-mono">Service: {inc.serviceAffected}</p>

            <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1 border-t border-border/50">
              <span>Root Cause: <strong className="text-foreground">{inc.rootCauseSummary}</strong></span>
              <span className="font-mono">{inc.resolvedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

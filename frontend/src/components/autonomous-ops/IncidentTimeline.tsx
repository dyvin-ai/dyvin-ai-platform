import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ShieldCheck, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import type { SreIncidentItem } from '@app-types/autonomous-ops.types';

export function IncidentTimeline() {
  const INCIDENTS: SreIncidentItem[] = [
    {
      id: 'inc-101',
      title: 'LLM Provider Latency Spike (Gemini 1.5 Pro > 300ms)',
      severity: 'MEDIUM',
      status: 'RESOLVED',
      autoRemediated: true,
      timestamp: 'Today, 04:12 AM',
    },
    {
      id: 'inc-102',
      title: 'Redis Cache Memory High Watermark (82% Utilization)',
      severity: 'LOW',
      status: 'RESOLVED',
      autoRemediated: true,
      timestamp: 'Yesterday, 11:45 PM',
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> SRE Incident & Automated Remediation Log
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          2 Resolved Log Entries
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
                <Badge variant={inc.severity === 'HIGH' ? 'default' : 'secondary'} size="sm">
                  {inc.severity}
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{inc.title}</h4>
              </div>

              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono">
                {inc.status}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Remediated by Playbook #14
              </span>
              <span className="font-mono">{inc.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

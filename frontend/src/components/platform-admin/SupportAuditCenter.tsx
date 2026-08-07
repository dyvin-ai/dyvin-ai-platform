import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Headphones, FileText, Clock } from 'lucide-react';
import type { SupportTicketItem, AuditLogEntry } from '@app-types/platform-admin.types';

export function SupportAuditCenter() {
  const TICKETS: SupportTicketItem[] = [
    { id: 'tkt-1', subject: 'Custom SSO SAML Configuration Request', priority: 'HIGH', status: 'IN_PROGRESS', createdAt: 'Today, 09:12 AM' },
    { id: 'tkt-2', subject: 'Quota Override for Q4 Campaign Burst', priority: 'MEDIUM', status: 'OPEN', createdAt: 'Yesterday, 03:45 PM' },
  ];

  const AUDIT_LOGS: AuditLogEntry[] = [
    { id: 'aud-1', action: 'QUOTA_OVERRIDE', actor: 'admin@dyvin.ai', resource: 'tenant:acme-corp', timestamp: 'Today, 10:30 AM' },
    { id: 'aud-2', action: 'FEATURE_FLAG_TOGGLE', actor: 'admin@dyvin.ai', resource: 'flag:ai_copilot_v2', timestamp: 'Today, 09:15 AM' },
    { id: 'aud-3', action: 'IMPERSONATION_START', actor: 'admin@dyvin.ai', resource: 'user:u-4821', timestamp: 'Yesterday, 04:20 PM' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Support Tickets */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <CardHeader className="p-0 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-400" /> Enterprise Support Center
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {TICKETS.length} Active Tickets
          </Badge>
        </CardHeader>

        <div className="space-y-2.5 pt-2 text-xs">
          {TICKETS.map((ticket) => (
            <div key={ticket.id} className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-foreground text-sm">{ticket.subject}</h4>
                <Badge variant={ticket.priority === 'HIGH' ? 'default' : 'secondary'} size="sm">
                  {ticket.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                <Badge variant="outline" size="sm">{ticket.status}</Badge>
                <span className="font-mono">{ticket.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Trail */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <CardHeader className="p-0 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Admin Audit & Control Plane Log
          </CardTitle>
          <Badge variant="outline" className="font-mono">
            {AUDIT_LOGS.length} Recent Entries
          </Badge>
        </CardHeader>

        <div className="space-y-2.5 pt-2 text-xs">
          {AUDIT_LOGS.map((log) => (
            <div key={log.id} className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">{log.action}</Badge>
                  <span className="text-foreground font-semibold">{log.resource}</span>
                </div>
                <span className="font-mono text-muted-foreground text-[10px]">{log.timestamp}</span>
              </div>
              <span className="text-muted-foreground text-[10px] block mt-1">by <code>{log.actor}</code></span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

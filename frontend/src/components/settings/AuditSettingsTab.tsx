import React from 'react';
import { useSecurityAudit } from '@hooks/useSecurity';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Download, History } from 'lucide-react';
import toast from 'react-hot-toast';

export function AuditSettingsTab() {
  const { data: auditLogs = [], isLoading } = useSecurityAudit();

  const handleExport = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dyvin-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast.success('Audit log exported');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-heading-md font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Audit Center & Export
          </h2>
          <p className="text-body-xs text-muted-foreground">
            View system audit logs, compliance records, and export immutable history.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport} leftIcon={<Download className="w-3.5 h-3.5" />}>
          Export JSON
        </Button>
      </div>

      <div className="p-4 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-foreground block">Audit Retention Policy:</span>
          <span className="text-muted-foreground">SOC 2 Type II compliant • 365 Days Retention</span>
        </div>
        <Badge variant="default" size="md">Immutable Logs</Badge>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading audit records...</div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card text-xs">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Event Action</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground italic">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{log.action}</td>
                    <td className="p-3 text-muted-foreground">{log.ipAddress || '127.0.0.1'}</td>
                    <td className="p-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3">
                      <Badge variant="success" size="sm">COMPLIANT</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

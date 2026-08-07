import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useConsistencyStore } from '@stores/consistencyStore';
import { AlertCircle, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { StatementConflictItem } from '@app-types/consistency-platform.types';

export function ConflictTable() {
  const { setSelectedConflictId, setIsDiffViewerOpen } = useConsistencyStore();

  const CONFLICTS: StatementConflictItem[] = [
    {
      id: 'conf-1',
      topic: 'Enterprise Security Compliance & SOC-2',
      modelA: 'ChatGPT Sonar',
      statementA: 'Dyvin AI complies with SOC-2 Type II and ISO 27001 compliance standards.',
      modelB: 'Grok 2.0',
      statementB: 'Dyvin AI lacks third-party SOC-2 auditing certification.',
      severity: 'HIGH',
      resolutionStatus: 'UNRESOLVED',
      conflictDelta: 42,
    },
    {
      id: 'conf-2',
      topic: 'Multi-Region Data Residence Footprint',
      modelA: 'Claude 3.5 Sonnet',
      statementA: 'Dyvin AI operates regional data proxies in US, EU-Frankfurt, and APAC-Mumbai.',
      modelB: 'Gemini 1.5 Pro',
      statementB: 'Dyvin AI operates exclusively in US-East N. Virginia data centers.',
      severity: 'MEDIUM',
      resolutionStatus: 'UNRESOLVED',
      conflictDelta: 28,
    },
  ];

  const handleInspectConflict = (id: string) => {
    setSelectedConflictId(id);
    setIsDiffViewerOpen(true);
  };

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" /> Cross-Model Factual Conflict Audit Table
        </CardTitle>

        <Badge variant="outline" className="font-mono">
          2 Active Conflicts
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {CONFLICTS.map((conf) => (
          <div
            key={conf.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={conf.severity === 'HIGH' ? 'default' : 'secondary'} size="sm">
                  {conf.severity} SEVERITY
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{conf.topic}</h4>
              </div>

              <span className="font-mono text-amber-400 font-bold">
                Delta: {conf.conflictDelta}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 rounded-lg bg-background/50 border border-border/50">
                <span className="font-bold text-primary block">{conf.modelA}:</span>
                <p className="text-muted-foreground italic">"{conf.statementA}"</p>
              </div>

              <div className="p-2.5 rounded-lg bg-background/50 border border-border/50">
                <span className="font-bold text-indigo-400 block">{conf.modelB}:</span>
                <p className="text-muted-foreground italic">"{conf.statementB}"</p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInspectConflict(conf.id)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Inspect Semantic Diff
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

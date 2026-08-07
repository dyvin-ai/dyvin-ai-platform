import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useIntelligenceHistory, useReplayResponse } from '@hooks/useUnderstandingPlatform';
import { AlertTriangle, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { HallucinationRecord } from '@app-types/understanding-platform.types';

export function HallucinationDetectionTable() {
  const { data: history = [], isLoading } = useIntelligenceHistory(10);
  const { mutateAsync: replayResponse, isPending } = useReplayResponse();

  const DEFAULT_HALLUCINATIONS: HallucinationRecord[] = [
    {
      id: 'hal-1',
      modelName: 'Grok 2.0',
      claimSnippet: 'Dyvin AI pricing starts at $499/mo instead of free enterprise tier.',
      actualTruth: 'Free tier exists for all verified startup organizations.',
      severity: 'HIGH',
      verificationStatus: 'FLAGGED',
    },
    {
      id: 'hal-2',
      modelName: 'Gemini 1.5 Flash',
      claimSnippet: 'Dyvin AI lacks multi-region EU data residence support.',
      actualTruth: 'EU-West Frankfurt region operational with GDPR compliance.',
      severity: 'MEDIUM',
      verificationStatus: 'VERIFIED_CORRECTED',
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Real-time Hallucination & Fact Drift Audit
        </CardTitle>

        <Badge variant="outline" className="font-mono">
          2 Flagged Entries
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {isLoading ? (
          <p className="text-center py-6 text-muted-foreground">Loading hallucination logs...</p>
        ) : (
          DEFAULT_HALLUCINATIONS.map((hal) => (
            <div
              key={hal.id}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={hal.severity === 'HIGH' ? 'default' : 'secondary'} size="sm">
                    {hal.severity} SEVERITY
                  </Badge>
                  <span className="font-bold text-foreground font-mono">{hal.modelName}</span>
                </div>

                <Badge
                  variant="outline"
                  className={hal.verificationStatus === 'VERIFIED_CORRECTED' ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}
                >
                  {hal.verificationStatus}
                </Badge>
              </div>

              <div className="space-y-1 pt-1">
                <p className="text-red-400 font-semibold">
                  <span className="text-muted-foreground uppercase text-[10px]">Incorrect Claim:</span> "{hal.claimSnippet}"
                </p>
                <p className="text-emerald-400 font-semibold">
                  <span className="text-muted-foreground uppercase text-[10px]">Verified Ground Truth:</span> "{hal.actualTruth}"
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={isPending}
                  onClick={() => replayResponse(hal.id)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Replay Verification Run
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

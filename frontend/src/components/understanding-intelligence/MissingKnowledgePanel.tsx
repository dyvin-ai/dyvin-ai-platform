import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { BookOpen, Plus, Sparkles } from 'lucide-react';
import type { MissingKnowledgeGapItem } from '@app-types/understanding-platform.types';

export function MissingKnowledgePanel() {
  const GAPS: MissingKnowledgeGapItem[] = [
    {
      id: 'gap-101',
      topic: 'SOC-2 Type II Certification Compliance',
      missingAttribute: 'Public Trust Center & ISO-27001 audit report links',
      impactScore: 92,
      affectedModels: ['Perplexity AI Pro', 'Claude 3.5 Sonnet'],
    },
    {
      id: 'gap-102',
      topic: 'Enterprise Billing & Annual Volume Discounting',
      missingAttribute: 'Custom Tier SLA & Dedicated Technical Account Manager documentation',
      impactScore: 86,
      affectedModels: ['ChatGPT Sonar', 'Gemini 1.5 Pro'],
    },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Unindexed Knowledge & Entity Schema Voids
        </CardTitle>

        <Badge variant="outline" className="font-mono">
          2 Gaps Identified
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {GAPS.map((gap) => (
          <div
            key={gap.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  KNOWLEDGE GAP
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{gap.topic}</h4>
              </div>
              <p className="text-muted-foreground font-mono text-[11px]">{gap.missingAttribute}</p>
              <div className="flex gap-1.5 pt-1">
                {gap.affectedModels.map((m) => (
                  <Badge key={m} variant="outline" className="text-[10px]">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground font-bold uppercase block">Impact</span>
                <span className="font-mono font-extrabold text-primary text-sm">+{gap.impactScore} pts</span>
              </div>

              <Button size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Inject Knowledge
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Network, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import type { ExplainabilityDecisionNode } from '@app-types/executive-platform.types';

export function ExplainabilityPanel() {
  const NODES: ExplainabilityDecisionNode[] = [
    { id: 'node-1', factorName: 'OpenAI GPT-4o Authority Weight', weightPercentage: 42, provenanceSource: 'wikipedia.org & github.com', confidenceScore: 98.4, impactCategory: 'VISIBILITY' },
    { id: 'node-2', factorName: 'Claude 3.5 Sonnet Citation Rate', weightPercentage: 35, provenanceSource: 'docs.python.org & dev.to', confidenceScore: 96.1, impactCategory: 'CITATION' },
    { id: 'node-3', factorName: 'Perplexity Sonar Fact Drift Audit', weightPercentage: 23, provenanceSource: 'Trust Center JSON-LD Schema', confidenceScore: 95.8, impactCategory: 'TRUST' },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Network className="w-5 h-5 text-primary" /> Explainability Center & LLM Provenance Decision Graph
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          3 Decision Nodes
        </Badge>
      </CardHeader>

      <div className="space-y-3 pt-2 text-xs">
        {NODES.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" size="sm">
                  {node.impactCategory}
                </Badge>
                <h4 className="font-bold text-foreground text-sm">{node.factorName}</h4>
              </div>

              <span className="font-mono text-primary font-bold text-sm">
                Weight: {node.weightPercentage}%
              </span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1">
              <span>Provenance Backing: <code className="text-foreground">{node.provenanceSource}</code></span>
              <span className="text-emerald-400 font-mono font-semibold">
                Confidence: {node.confidenceScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

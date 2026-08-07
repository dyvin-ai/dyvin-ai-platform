import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Server, Globe, CheckCircle2, Cpu } from 'lucide-react';
import type { DependencyHealthItem } from '@app-types/observability-platform.types';

export function CapacitySrePanel() {
  const DEPENDENCIES: DependencyHealthItem[] = [
    { serviceName: 'AWS Aurora PostgreSQL 16', provider: 'AWS', status: 'OPERATIONAL', latencyMs: 14 },
    { serviceName: 'AWS ElastiCache Redis', provider: 'REDIS', status: 'OPERATIONAL', latencyMs: 4 },
    { serviceName: 'OpenAI GPT-4o API', provider: 'OPENAI', status: 'OPERATIONAL', latencyMs: 142 },
    { serviceName: 'Anthropic Claude 3.5 Sonnet', provider: 'ANTHROPIC', status: 'OPERATIONAL', latencyMs: 168 },
    { serviceName: 'Google Gemini 1.5 Pro', provider: 'GOOGLE', status: 'OPERATIONAL', latencyMs: 154 },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Third-Party AI & Infrastructure Dependencies
        </CardTitle>
        <Badge variant="outline" className="font-mono">
          5 Core Gateways
        </Badge>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
        {DEPENDENCIES.map((dep) => (
          <div
            key={dep.serviceName}
            className="p-3.5 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary" size="sm">
                {dep.provider}
              </Badge>
              <span className="font-mono text-emerald-400 font-bold text-[11px]">{dep.latencyMs} ms</span>
            </div>

            <h4 className="font-bold text-foreground text-xs">{dep.serviceName}</h4>

            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {dep.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

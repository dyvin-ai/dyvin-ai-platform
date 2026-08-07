import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export function AiModelRecommendationMatrix() {
  const MODELS = [
    { name: 'ChatGPT Sonar Search', status: 'RECOMMENDED', score: 96, bias: 'Positive' },
    { name: 'Perplexity AI Pro', status: 'RECOMMENDED', score: 94, bias: 'Positive' },
    { name: 'Claude 3.5 Sonnet', status: 'RECOMMENDED', score: 91, bias: 'Neutral' },
    { name: 'Gemini 1.5 Pro', status: 'NEEDS_SCHEMA', score: 84, bias: 'Neutral' },
    { name: 'DeepSeek R1', status: 'RECOMMENDED', score: 89, bias: 'Positive' },
    { name: 'Grok 2.0', status: 'NEEDS_CITATION', score: 78, bias: 'Negative' },
  ];

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" /> Foundation AI Model Recommendation & Bias Matrix
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs">
        {MODELS.map((model) => (
          <div
            key={model.name}
            className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{model.name}</span>
              <Badge
                variant={model.status === 'RECOMMENDED' ? 'default' : 'outline'}
                className={model.status === 'RECOMMENDED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
              >
                {model.status}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span>Recommendation Rank:</span>
              <span className="font-mono font-bold text-foreground">Score: {model.score}/100</span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground text-[11px]">
              <span>Extracted Bias:</span>
              <span className="font-semibold text-primary">{model.bias}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

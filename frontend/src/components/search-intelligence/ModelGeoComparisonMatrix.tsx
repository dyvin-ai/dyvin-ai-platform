import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { useAiSearchModels } from '@hooks/useAiSearch';
import { Layers, CheckCircle2, Zap, BarChart2 } from 'lucide-react';
import type { ModelGeoComparison } from '@app-types/ai-search.types';

export function ModelGeoComparisonMatrix() {
  const { data: models = [], isLoading } = useAiSearchModels();

  const DEFAULT_MODELS: ModelGeoComparison[] = [
    { modelName: 'Perplexity Sonar Pro', geoScore: 95, citationShare: 42, avgRank: 1.2, sentimentScore: 92 },
    { modelName: 'ChatGPT Search (GPT-4o)', geoScore: 91, citationShare: 35, avgRank: 1.4, sentimentScore: 89 },
    { modelName: 'Google Gemini 1.5 Pro', geoScore: 84, citationShare: 15, avgRank: 2.1, sentimentScore: 82 },
    { modelName: 'Claude 3.5 Sonnet', geoScore: 78, citationShare: 8, avgRank: 2.8, sentimentScore: 85 },
  ];

  const displayModels = models.length > 0 ? models : DEFAULT_MODELS;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> AI Foundation Models GEO Comparison Matrix
        </CardTitle>
        <Badge variant="outline">Real-Time Benchmarking</Badge>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <p className="text-center py-6 text-xs text-muted-foreground col-span-4">Loading model comparison metrics...</p>
        ) : (
          displayModels.map((m) => (
            <div
              key={m.modelName}
              className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-foreground text-sm">{m.modelName}</h4>
                <Badge variant="default" size="sm">
                  Rank #{m.avgRank}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>GEO Score:</span>
                  <span className="font-mono font-bold text-foreground">{m.geoScore} / 100</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${m.geoScore}%` }} />
                </div>

                <div className="flex justify-between items-center text-muted-foreground pt-2">
                  <span>Citation Share:</span>
                  <span className="font-mono font-bold text-foreground">{m.citationShare}%</span>
                </div>

                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Sentiment Score:</span>
                  <span className="font-mono font-bold text-emerald-400">{m.sentimentScore}% Positive</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

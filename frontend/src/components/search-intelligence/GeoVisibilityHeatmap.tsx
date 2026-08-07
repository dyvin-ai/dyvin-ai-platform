import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useAiSearchRecommendations, useExecuteGeoAction } from '@hooks/useAiSearch';
import { Globe, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import type { GeoRecommendationItem } from '@app-types/ai-search.types';

export function GeoVisibilityHeatmap() {
  const { data: recommendations = [], isLoading } = useAiSearchRecommendations();
  const { mutateAsync: executeAction, isPending } = useExecuteGeoAction();

  const DEFAULT_RECOMMENDATIONS: GeoRecommendationItem[] = [
    {
      id: 'rec-1',
      title: 'Publish Organization JSON-LD Schema Markup',
      category: 'SCHEMA',
      impact: 'HIGH',
      description: 'Perplexity & Claude require valid Schema.org Organization markup to verify corporate headquarters and founding facts.',
      actionType: 'PUBLISH_SCHEMA_JSONLD',
    },
    {
      id: 'rec-2',
      title: 'Fix Missing Product Entity Citations on Wikipedia / Wikidata',
      category: 'CITATION',
      impact: 'HIGH',
      description: 'ChatGPT Search references Wikidata entries to resolve product capability queries.',
      actionType: 'SYNC_WIKIDATA_ENTITIES',
    },
    {
      id: 'rec-3',
      title: 'Optimize Content Chunking for AI RAG Indexers',
      category: 'CONTENT',
      impact: 'MEDIUM',
      description: 'Structure documentation with h2 headings and clear semantic definitions to improve vector retrieval rank.',
      actionType: 'OPTIMIZE_RAG_CHUNKS',
    },
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : DEFAULT_RECOMMENDATIONS;

  const handleAction = async (actionType: string) => {
    await executeAction(actionType);
  };

  return (
    <div className="space-y-6">
      {/* Global Multi-Region Geo Visibility Bar */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Global Multi-Region GEO AI Visibility Share
          </CardTitle>
          <Badge variant="outline">North America • Europe • Asia Pacific</Badge>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
            <span className="text-muted-foreground text-xs font-bold block uppercase">North America (US/CA)</span>
            <span className="text-2xl font-extrabold text-primary font-mono">92.4%</span>
            <span className="text-[11px] text-emerald-400 font-semibold block">+4.2% vs last month</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
            <span className="text-muted-foreground text-xs font-bold block uppercase">Europe (EU/UK)</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">84.1%</span>
            <span className="text-[11px] text-emerald-400 font-semibold block">+2.8% vs last month</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1 text-center">
            <span className="text-muted-foreground text-xs font-bold block uppercase">Asia Pacific (APAC)</span>
            <span className="text-2xl font-extrabold text-purple-400 font-mono">76.8%</span>
            <span className="text-[11px] text-amber-400 font-semibold block">Action Needed</span>
          </div>
        </div>
      </Card>

      {/* Actionable GEO Recommendations */}
      <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-base font-bold text-foreground">Actionable GEO Optimization Recommendations</CardTitle>
        </CardHeader>

        <div className="space-y-3">
          {displayRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.impact === 'HIGH' ? 'default' : 'secondary'} size="sm">
                    {rec.impact} IMPACT
                  </Badge>
                  <h4 className="font-bold text-foreground text-sm">{rec.title}</h4>
                </div>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>

              <Button
                size="sm"
                isLoading={isPending}
                onClick={() => handleAction(rec.actionType)}
                leftIcon={<Zap className="w-3.5 h-3.5" />}
              >
                Auto-Fix Now
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

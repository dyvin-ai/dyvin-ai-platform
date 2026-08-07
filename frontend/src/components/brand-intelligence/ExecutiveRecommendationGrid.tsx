import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useRecommendations, useGenerateRecommendations } from '@hooks/useRecommendationIntelligence';
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import type { RecommendationItem } from '@app-types/recommendation-intelligence.types';

export function ExecutiveRecommendationGrid() {
  const { data: recommendations = [], isLoading } = useRecommendations();
  const { mutateAsync: generateRecommendations, isPending } = useGenerateRecommendations();

  const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
    {
      id: 'rec-101',
      title: 'Inject Schema.org Organization JSON-LD to Boost Entity Authority',
      category: 'SCHEMA',
      priority: 'CRITICAL',
      estimatedImpactScore: 94,
      description: 'Increases ChatGPT & Perplexity brand resolution accuracy by embedding canonical schema.',
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-102',
      title: 'Publish Wikidata Entry for Dyvin AI Software Entity',
      category: 'AUTHORITY',
      priority: 'HIGH',
      estimatedImpactScore: 88,
      description: 'Establishes persistent Knowledge Graph entity relations referenced by Claude & Gemini.',
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
    },
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : DEFAULT_RECOMMENDATIONS;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Prioritized AI Recommendation Engine
        </CardTitle>

        <Button
          size="sm"
          variant="outline"
          isLoading={isPending}
          onClick={() => generateRecommendations('analysis-default')}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Re-Analyze Brand Findings
        </Button>
      </CardHeader>

      <div className="space-y-3 pt-2">
        {isLoading ? (
          <p className="text-center py-6 text-xs text-muted-foreground">Loading AI recommendations...</p>
        ) : (
          displayRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={rec.priority === 'CRITICAL' ? 'default' : 'secondary'}
                    size="sm"
                  >
                    {rec.priority}
                  </Badge>
                  <h4 className="font-bold text-foreground text-sm">{rec.title}</h4>
                </div>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Impact</span>
                  <span className="font-mono font-extrabold text-primary text-sm">+{rec.estimatedImpactScore} pts</span>
                </div>

                <Button size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
                  Auto-Execute
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

import React, { useState } from 'react';
import { useRecommendationList, useImpactROI, useStrategyForecast } from '@hooks/useRecommendationPlatform';
import { RecommendationScoreCard } from '@components/recommendation-intelligence/RecommendationScoreCard';
import { StrategyExecutionRoadmap } from '@components/recommendation-intelligence/StrategyExecutionRoadmap';
import { AiModelRecommendationMatrix } from '@components/recommendation-intelligence/AiModelRecommendationMatrix';
import { RecommendationEvidenceDrawer } from '@components/recommendation-intelligence/RecommendationEvidenceDrawer';
import { PageLoader } from '@components/feedback/PageLoader';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Sparkles, FileText, Zap } from 'lucide-react';
import type { StrategyRecommendationItem } from '@app-types/recommendation-platform.types';

export default function RecommendationPlatformPage() {
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [selectedRecTitle, setSelectedRecTitle] = useState<string>('');
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const { data: recommendations = [], isLoading } = useRecommendationList();
  const { data: roiData } = useImpactROI('strategy-default');
  const { data: forecastData } = useStrategyForecast('strategy-default');

  const DEFAULT_RECOMMENDATIONS: StrategyRecommendationItem[] = [
    {
      id: 'rec-1',
      title: 'Embed Schema.org Organization & SoftwareApplication JSON-LD',
      category: 'SCHEMA',
      priority: 'CRITICAL',
      estimatedImpactScore: 95,
      confidenceScore: 98,
      description: 'Increases ChatGPT & Perplexity brand entity recognition accuracy.',
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-2',
      title: 'Publish High-Authority Wikidata & Wikipedia Knowledge Graph Entries',
      category: 'AUTHORITY',
      priority: 'HIGH',
      estimatedImpactScore: 89,
      confidenceScore: 94,
      description: 'Establishes persistent Knowledge Graph entity relations for Gemini & Claude.',
      status: 'PROPOSED',
      createdAt: new Date().toISOString(),
    },
  ];

  const displayRecommendations = recommendations.length > 0 ? recommendations : DEFAULT_RECOMMENDATIONS;

  const handleOpenEvidence = (rec: StrategyRecommendationItem) => {
    setSelectedRecId(rec.id);
    setSelectedRecTitle(rec.title);
    setIsEvidenceOpen(true);
  };

  if (isLoading) {
    return <PageLoader message="Loading Recommendation Intelligence Platform..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise AI Recommendation Intelligence & Strategy Platform
          </h1>
          <Badge variant="default" size="sm">Phase F8 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Prioritized AI visibility recommendations, step-by-step strategy execution roadmaps, evidence provenance trails, and ROI impact forecasts.
        </p>
      </div>

      {/* Strategy ROI & Impact Card */}
      <RecommendationScoreCard roiData={roiData} forecastData={forecastData} />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Prioritized Recommendations */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" /> Prioritized Recommendation Backlog
            </h3>
            <Badge variant="outline" className="font-mono">
              {displayRecommendations.length} Active Items
            </Badge>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {displayRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={rec.priority === 'CRITICAL' ? 'default' : 'secondary'} size="sm">
                      {rec.priority}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">{rec.category}</span>
                  </div>
                  <span className="font-mono font-extrabold text-primary">+{rec.estimatedImpactScore} pts</span>
                </div>

                <h4 className="font-bold text-foreground text-sm">{rec.title}</h4>
                <p className="text-muted-foreground">{rec.description}</p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEvidence(rec)}
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                  >
                    View Evidence
                  </Button>
                  <Button size="sm" leftIcon={<Zap className="w-3.5 h-3.5" />}>
                    Auto-Fix
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Step-by-Step Execution Plan */}
        <StrategyExecutionRoadmap />
      </div>

      {/* Cross-Model Matrix */}
      <AiModelRecommendationMatrix />

      {/* Evidence Provenance Modal */}
      <RecommendationEvidenceDrawer
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        recommendationId={selectedRecId}
        recommendationTitle={selectedRecTitle}
      />
    </div>
  );
}

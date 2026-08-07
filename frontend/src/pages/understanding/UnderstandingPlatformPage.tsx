import React from 'react';
import { useWarehouseStats } from '@hooks/useUnderstandingPlatform';
import { UnderstandingScoreCard } from '@components/understanding-intelligence/UnderstandingScoreCard';
import { HallucinationDetectionTable } from '@components/understanding-intelligence/HallucinationDetectionTable';
import { SemanticSimilarityChart } from '@components/understanding-intelligence/SemanticSimilarityChart';
import { MissingKnowledgePanel } from '@components/understanding-intelligence/MissingKnowledgePanel';
import { PageLoader } from '@components/feedback/PageLoader';
import { Badge } from '@components/ui/Badge';

export default function UnderstandingPlatformPage() {
  const { data: warehouseStats, isLoading } = useWarehouseStats();

  if (isLoading) {
    return <PageLoader message="Loading AI Understanding & Trust Intelligence Platform..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise AI Understanding & Trust Intelligence Platform
          </h1>
          <Badge variant="default" size="sm">Phase F9 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time AI model understanding index, hallucination detection & fact drift audit, semantic similarity alignment, and unindexed knowledge gap resolution.
        </p>
      </div>

      {/* Main Score Matrix Card */}
      <UnderstandingScoreCard warehouseStats={warehouseStats} />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Hallucination & Fact Drift Table */}
        <HallucinationDetectionTable />

        {/* Right: Semantic Similarity & Latency Chart */}
        <SemanticSimilarityChart />
      </div>

      {/* Knowledge Gap & Schema Void Panel */}
      <MissingKnowledgePanel />
    </div>
  );
}

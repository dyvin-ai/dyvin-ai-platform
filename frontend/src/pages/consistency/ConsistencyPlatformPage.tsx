import React from 'react';
import { ConsistencyScoreCard } from '@components/consistency-intelligence/ConsistencyScoreCard';
import { ModelComparisonMatrix } from '@components/consistency-intelligence/ModelComparisonMatrix';
import { ConflictTable } from '@components/consistency-intelligence/ConflictTable';
import { SemanticDifferenceViewer } from '@components/consistency-intelligence/SemanticDifferenceViewer';
import { Badge } from '@components/ui/Badge';

export default function ConsistencyPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise AI Consistency Intelligence Platform
          </h1>
          <Badge variant="default" size="sm">Phase F10 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Cross-model factual consistency scoring, side-by-side statement comparison, conflict resolution audit, and semantic difference alignment.
        </p>
      </div>

      {/* Main Consistency Matrix Card */}
      <ConsistencyScoreCard />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Conflict Audit Table */}
        <ConflictTable />

        {/* Right: Model Comparison Matrix */}
        <ModelComparisonMatrix />
      </div>

      {/* Semantic Difference Viewer Modal */}
      <SemanticDifferenceViewer />
    </div>
  );
}

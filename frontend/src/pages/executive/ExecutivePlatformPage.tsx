import React from 'react';
import { ExecutiveScoreCard } from '@components/executive-intelligence/ExecutiveScoreCard';
import { ExplainabilityPanel } from '@components/executive-intelligence/ExplainabilityPanel';
import { GlobalCommandCenter } from '@components/executive-intelligence/GlobalCommandCenter';
import { DecisionInsightsGrid } from '@components/executive-intelligence/DecisionInsightsGrid';
import { Badge } from '@components/ui/Badge';

export default function ExecutivePlatformPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise Executive Intelligence & Global Command Center
          </h1>
          <Badge variant="default" size="sm">Phase F12 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Unified AI Brand Score, LLM provenance decision graph explainability, real-time multi-region command center telemetry, and high-impact executive decision support.
        </p>
      </div>

      {/* Main Score Matrix Card */}
      <ExecutiveScoreCard />

      {/* Global Command Center Telemetry */}
      <GlobalCommandCenter />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Explainability Panel */}
        <ExplainabilityPanel />

        {/* Right: Decision Support Grid */}
        <DecisionInsightsGrid />
      </div>
    </div>
  );
}

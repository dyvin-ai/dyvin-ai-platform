import React from 'react';
import { AttributionScoreCard } from '@components/attribution-intelligence/AttributionScoreCard';
import { JourneyFlowViewer } from '@components/attribution-intelligence/JourneyFlowViewer';
import { RevenueImpactCard } from '@components/attribution-intelligence/RevenueImpactCard';
import { PipelineWidget } from '@components/attribution-intelligence/PipelineWidget';
import { Badge } from '@components/ui/Badge';

export default function AttributionPlatformPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise AI Attribution & Business Impact Intelligence Platform
          </h1>
          <Badge variant="default" size="sm">Phase F11 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Multi-touch AI buyer journey attribution, closed-loop revenue contribution analysis, pipeline stage velocity tracking, and GEO recommendation ROI.
        </p>
      </div>

      {/* Main Score Matrix Card */}
      <AttributionScoreCard />

      {/* Multi-Touch Journey Flow */}
      <JourneyFlowViewer />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Revenue Contribution Card */}
        <RevenueImpactCard />

        {/* Right: Pipeline Velocity Widget */}
        <PipelineWidget />
      </div>
    </div>
  );
}

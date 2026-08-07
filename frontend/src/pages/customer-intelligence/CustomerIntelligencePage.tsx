import React, { useState } from 'react';
import { useOrgStore } from '@stores/orgStore';
import { useBrandOverview } from '@hooks/useBrandIntelligence';
import { BrandAuthorityCard } from '@components/brand-intelligence/BrandAuthorityCard';
import { CompetitorBenchmarkRadar } from '@components/brand-intelligence/CompetitorBenchmarkRadar';
import { CitationAuthorityTable } from '@components/brand-intelligence/CitationAuthorityTable';
import { ExecutiveRecommendationGrid } from '@components/brand-intelligence/ExecutiveRecommendationGrid';
import { AddCompetitorModal } from '@components/modals/AddCompetitorModal';
import { PageLoader } from '@components/feedback/PageLoader';
import { Badge } from '@components/ui/Badge';

export default function CustomerIntelligencePage() {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id || 'org-default';

  const [isAddCompetitorOpen, setIsAddCompetitorOpen] = useState(false);
  const { data: overviewProfile, isLoading } = useBrandOverview(orgId);

  if (isLoading) {
    return <PageLoader message="Loading Brand Intelligence & Customer Platform..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Enterprise AI Brand Intelligence & Competitor Platform
          </h1>
          <Badge variant="default" size="sm">Phase F7 Enterprise</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time AI brand authority scores, head-to-head competitor radar, domain citation share of voice, and prioritized recommendations.
        </p>
      </div>

      {/* Brand Authority Matrix Card */}
      <BrandAuthorityCard profile={overviewProfile} />

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Competitor Radar */}
        <CompetitorBenchmarkRadar onOpenAddModal={() => setIsAddCompetitorOpen(true)} />

        {/* Right: Citation Domain Authority Table */}
        <CitationAuthorityTable />
      </div>

      {/* Executive Recommendations Grid */}
      <ExecutiveRecommendationGrid />

      {/* Add Competitor Modal */}
      <AddCompetitorModal
        isOpen={isAddCompetitorOpen}
        onClose={() => setIsAddCompetitorOpen(false)}
        orgId={orgId}
      />
    </div>
  );
}
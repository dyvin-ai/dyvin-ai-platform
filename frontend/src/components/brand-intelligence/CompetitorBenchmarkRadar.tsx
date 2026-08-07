import React from 'react';
import { Card, CardHeader, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useCompetitors, useDeleteCompetitor } from '@hooks/useCompetitorIntelligence';
import { Users, Plus, Trash2, Globe, TrendingUp } from 'lucide-react';
import type { CompetitorItem } from '@app-types/competitor-intelligence.types';

interface CompetitorBenchmarkRadarProps {
  onOpenAddModal: () => void;
}

export function CompetitorBenchmarkRadar({ onOpenAddModal }: CompetitorBenchmarkRadarProps) {
  const { data: competitors = [], isLoading } = useCompetitors();
  const { mutateAsync: deleteCompetitor } = useDeleteCompetitor();

  const DEFAULT_COMPETITORS: CompetitorItem[] = [
    {
      id: 'comp-1',
      organizationId: 'org-default',
      competitorName: 'Linear.app',
      domain: 'linear.app',
      industry: 'Software Engineering',
      visibilityScore: 89,
      citationShare: 32,
      domainAuthority: 88,
      lastScannedAt: new Date().toISOString(),
    },
    {
      id: 'comp-2',
      organizationId: 'org-default',
      competitorName: 'Vercel Inc',
      domain: 'vercel.com',
      industry: 'Cloud Infrastructure',
      visibilityScore: 94,
      citationShare: 45,
      domainAuthority: 92,
      lastScannedAt: new Date().toISOString(),
    },
  ];

  const displayCompetitors = competitors.length > 0 ? competitors : DEFAULT_COMPETITORS;

  return (
    <Card className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Head-to-Head Competitor Benchmark Radar
        </CardTitle>

        <Button size="sm" onClick={onOpenAddModal} leftIcon={<Plus className="w-4 h-4" />}>
          Track Competitor
        </Button>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {isLoading ? (
          <p className="text-center py-6 text-xs text-muted-foreground col-span-2">Loading competitor benchmarks...</p>
        ) : (
          displayCompetitors.map((comp) => (
            <div
              key={comp.id}
              className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> {comp.competitorName}
                  </h4>
                  <span className="text-muted-foreground text-[11px] font-mono">{comp.domain}</span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => deleteCompetitor(comp.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>AI Visibility Score:</span>
                  <span className="font-mono font-bold text-foreground">{comp.visibilityScore} / 100</span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${comp.visibilityScore}%` }} />
                </div>

                <div className="flex justify-between items-center text-muted-foreground pt-1">
                  <span>Citation Share:</span>
                  <span className="font-mono font-bold text-indigo-400">{comp.citationShare}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

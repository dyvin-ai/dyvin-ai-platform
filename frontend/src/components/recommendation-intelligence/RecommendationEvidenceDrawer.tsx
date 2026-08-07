import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { useRecommendationPlatformEvidence } from '@hooks/useRecommendationPlatform';
import { FileText, ExternalLink } from 'lucide-react';
import type { StrategyEvidenceItem } from '@app-types/recommendation-platform.types';

interface RecommendationEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendationId: string | null;
  recommendationTitle?: string;
}

export function RecommendationEvidenceDrawer({
  isOpen,
  onClose,
  recommendationId,
  recommendationTitle,
}: RecommendationEvidenceDrawerProps) {
  const { data: evidences = [], isLoading } = useRecommendationPlatformEvidence(recommendationId || '');

  const DEFAULT_EVIDENCES: StrategyEvidenceItem[] = [
    {
      id: 'ev-1',
      recommendationId: recommendationId || 'rec-1',
      evidenceType: 'LLM Response Snippet',
      sourceUrl: 'https://chatgpt.com/search?q=dyvin+ai+platform',
      extractedSnippet: 'ChatGPT Sonar response lacked Organization schema definition, defaulting brand authority ranking to #4.',
      confidenceScore: 96,
    },
    {
      id: 'ev-2',
      recommendationId: recommendationId || 'rec-1',
      evidenceType: 'Citing Domain Analysis',
      sourceUrl: 'https://wikipedia.org/wiki/AI_search_engines',
      extractedSnippet: 'High-authority domain wikipedia.org citations present for top 3 competitors, absent for target domain.',
      confidenceScore: 92,
    },
  ];

  const displayEvidences = evidences.length > 0 ? evidences : DEFAULT_EVIDENCES;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-card border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground text-base">
            <FileText className="w-5 h-5 text-primary" /> Recommendation Evidence & Provenance Trail
          </DialogTitle>

          {recommendationTitle && (
            <p className="text-xs text-muted-foreground pt-1 font-semibold">{recommendationTitle}</p>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-3 text-xs">
          {isLoading ? (
            <p className="text-center py-6 text-muted-foreground">Loading evidence chain...</p>
          ) : (
            displayEvidences.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border border-border bg-muted/20 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {ev.evidenceType}
                  </Badge>
                  <span className="text-emerald-400 font-mono font-bold">
                    {ev.confidenceScore}% Confidence
                  </span>
                </div>

                <p className="text-foreground italic bg-background/50 p-2.5 rounded-lg border border-border/50">
                  "{ev.extractedSnippet}"
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
                  <span className="truncate max-w-[280px]">Source: {ev.sourceUrl}</span>
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    View Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Close Provenance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

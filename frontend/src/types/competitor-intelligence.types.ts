export interface CompetitorItem {
  id: string;
  organizationId: string;
  competitorName: string;
  domain: string;
  industry: string;
  visibilityScore: number;
  citationShare: number;
  domainAuthority: number;
  lastScannedAt: string;
}

export interface CreateCompetitorInput {
  organizationId: string;
  competitorName: string;
  domain: string;
  industry?: string;
}

export interface UpdateCompetitorInput {
  competitorName?: string;
  domain?: string;
  industry?: string;
}

export interface CompetitorComparisonItem {
  id: string;
  competitorId: string;
  competitorName: string;
  brandVisibilityScore: number;
  competitorVisibilityScore: number;
  citationGap: number;
  comparedAt: string;
}

export interface IndustryBenchmarkItem {
  industry: string;
  medianScore: number;
  top10PercentileScore: number;
  leaderboard: { domain: string; visibilityScore: number; rank: number }[];
}

export interface CompetitorInsightItem {
  id: string;
  competitorId: string;
  insightTitle: string;
  category: 'GAP' | 'STRENGTH' | 'THREAT' | 'OPPORTUNITY';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendationText: string;
}

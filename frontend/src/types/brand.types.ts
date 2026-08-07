export interface VisibilityProfile {
  id: string;
  organizationId: string;
  visibilityScore: number;
  citationVelocity: number;
  brandAuthorityScore: number;
  authorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'AUTHORITATIVE';
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  lastCalculated: string;
}

export interface CitationItem {
  id: string;
  aiSearchProjectId?: string;
  domain: string;
  url: string;
  title: string;
  authorityScore: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  occurrenceCount: number;
  firstSeenAt: string;
}

export interface CitationTimeline {
  date: string;
  count: number;
  authorityAverage: number;
}

export interface CitationTrend {
  growthRate: number;
  citationVelocity: number;
  trendDirection: 'RISING' | 'STABLE' | 'DECLINING';
}

export interface TopCitingDomain {
  domain: string;
  authorityScore: number;
  totalCitations: number;
  shareOfVoice: number;
}

export interface VisibilityForecast {
  days7: number;
  days30: number;
  days90: number;
  confidenceScore: number;
}

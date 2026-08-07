export interface VisibilityScoreProfile {
  organizationId: string;
  overallScore: number;
  knowledgeScore: number;
  authorityScore: number;
  trustScore: number;
  technicalScore: number;
  calculatedAt: string;
}

export interface VisibilitySnapshot {
  date: string;
  overallScore: number;
}

export interface VisibilityTrendData {
  growthRatePercent: number;
  velocityScore: number;
  direction: 'UPWARD' | 'STABLE' | 'DOWNWARD';
}

export interface LeaderboardEntry {
  rank: number;
  organizationName: string;
  industry: string;
  visibilityScore: number;
}

export interface IndustryBenchmarkData {
  industry: string;
  medianScore: number;
  top10PercentScore: number;
  sampleCount: number;
}

export interface VisibilityInsight {
  title: string;
  category: string;
  impactScore: number;
  recommendation: string;
}

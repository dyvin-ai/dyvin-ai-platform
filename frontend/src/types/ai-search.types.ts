export interface AiSearchOverview {
  overallVisibilityScore: number;
  totalTrackedPrompts: number;
  totalCitations: number;
  aiEngineShare: {
    perplexity: number;
    chatgpt: number;
    gemini: number;
    claude: number;
  };
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface AiSearchVisibilityTrend {
  date: string;
  visibilityScore: number;
  citationShare: number;
  predictedScore: number;
}

export interface AiSearchPromptItem {
  id: string;
  organizationId: string;
  promptText: string;
  modelName: string;
  visibilityScore: number;
  citationRank: number;
  status: 'OPTIMIZED' | 'NEEDS_ATTENTION' | 'UNRANKED';
  executedAt: string;
}

export interface CitationOverview {
  totalCitations: number;
  domainAuthorityAverage: number;
  topCitationDomains: { domain: string; count: number; authority: number }[];
  citationCategories: { category: string; percentage: number }[];
}

export interface RetrievalAnalytics {
  averageRank: number;
  top10Percentage: number;
  firstPageShare: number;
  retrievalLatencyMs: number;
}

export interface ModelGeoComparison {
  modelName: string;
  geoScore: number;
  citationShare: number;
  avgRank: number;
  sentimentScore: number;
}

export interface CompetitorBenchmark {
  competitorName: string;
  visibilityScore: number;
  citationShare: number;
  domainAuthority: number;
}

export interface DomainAnalyticsItem {
  domain: string;
  authorityScore: number;
  totalBacklinks: number;
  aiCitationShare: number;
}

export interface UrlAnalyticsItem {
  url: string;
  pageTitle: string;
  aiVisibilityScore: number;
  jsonLdValid: boolean;
  lastScanned: string;
}

export interface KeywordGeoItem {
  keyword: string;
  cluster: string;
  searchVolume: number;
  aiEngineShare: number;
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GeoRecommendationItem {
  id: string;
  title: string;
  category: 'SCHEMA' | 'CONTENT' | 'CITATION' | 'AUTHORITY';
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  actionType: string;
}

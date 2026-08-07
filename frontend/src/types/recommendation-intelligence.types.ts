export interface RecommendationItem {
  id: string;
  analysisId?: string;
  title: string;
  category: 'SCHEMA' | 'CONTENT' | 'CITATION' | 'AUTHORITY' | 'TECHNICAL';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedImpactScore: number;
  description: string;
  status: 'PROPOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
  createdAt: string;
}

export interface RecommendationEvidence {
  recommendationId: string;
  evidenceType: string;
  sourceUrl: string;
  extractedSnippet: string;
  confidenceScore: number;
}

export interface RecommendationDependency {
  id: string;
  recommendationId: string;
  prerequisiteTitle: string;
  isResolved: boolean;
}

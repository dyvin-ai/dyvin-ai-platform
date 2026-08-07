export interface StrategyRecommendationItem {
  id: string;
  strategyId?: string;
  analysisId?: string;
  title: string;
  category: 'SCHEMA' | 'CONTENT' | 'CITATION' | 'AUTHORITY' | 'TECHNICAL';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedImpactScore: number;
  confidenceScore: number;
  description: string;
  status: 'PROPOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
  createdAt: string;
  evidences?: StrategyEvidenceItem[];
}

export interface StrategyEvidenceItem {
  id: string;
  recommendationId: string;
  evidenceType: string;
  sourceUrl: string;
  extractedSnippet: string;
  confidenceScore: number;
}

export interface StrategyExecutionPlanItem {
  stepIndex: number;
  title: string;
  actionType: string;
  estimatedDuration: string;
  prerequisiteId?: string;
  isCompleted: boolean;
}

export interface RootCauseDiagnosis {
  id: string;
  issueTitle: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  rootCauseReason: string;
  affectedComponents: string[];
}

export interface StrategyForecastData {
  days7Score: number;
  days30Score: number;
  days90Score: number;
  confidenceInterval: number;
}

export interface ImpactRoiData {
  expectedScoreIncrease: number;
  estimatedRevenueImpact: string;
  effortHours: number;
}

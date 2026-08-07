export interface ModelConsistencyMetric {
  modelName: string;
  consistencyScore: number;
  varianceRate: number;
  consensusGrade: 'HIGH' | 'MEDIUM' | 'LOW';
  lastScannedAt: string;
}

export interface StatementConflictItem {
  id: string;
  topic: string;
  modelA: string;
  statementA: string;
  modelB: string;
  statementB: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  resolutionStatus: 'UNRESOLVED' | 'RESOLVED' | 'IGNORED';
  conflictDelta: number;
}

export interface CompetitorConsistencyItem {
  id: string;
  competitorName: string;
  domain: string;
  consistencyScore: number;
  conflictCount: number;
}

export interface ResearchThreatItem {
  id: string;
  title: string;
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface UnifiedBrandScoreSummary {
  unifiedBrandScore: number;
  globalPlatformHealth: number;
  totalWarehouseExecutions: number;
  strategicGrowthVelocity: number;
  tierStatus: 'GRADE A+ EXECUTIVE TIER';
}

export interface ExplainabilityDecisionNode {
  id: string;
  factorName: string;
  weightPercentage: number;
  provenanceSource: string;
  confidenceScore: number;
  impactCategory: 'VISIBILITY' | 'CITATION' | 'TRUST' | 'CONSISTENCY';
}

export interface GlobalCommandCenterTelemetry {
  activeWorkerQueues: number;
  multiRegionProxiesOnline: number;
  securityThreatScore: number;
  averageResponseLatencyMs: number;
  systemStatus: 'ALL_SYSTEMS_OPERATIONAL';
}

export interface ExecutiveStrategicDecision {
  id: string;
  title: string;
  recommendationType: 'GEO_SCHEMA' | 'CITATION_BOOST' | 'CONTENT_EXPANSION';
  expectedRoiPercentage: number;
  implementationUrgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

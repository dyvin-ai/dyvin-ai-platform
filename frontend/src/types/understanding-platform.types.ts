export interface AiResponseLedgerItem {
  id: string;
  organizationId?: string;
  modelName: string;
  promptText: string;
  responseText: string;
  understandingScore: number;
  trustScore: number;
  hallucinationDetected: boolean;
  executedAt: string;
}

export interface AiCitationLedgerItem {
  id: string;
  domain: string;
  url: string;
  relevanceScore: number;
  authorityScore: number;
  createdAt: string;
}

export interface HallucinationRecord {
  id: string;
  modelName: string;
  claimSnippet: string;
  actualTruth: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: 'FLAGGED' | 'VERIFIED_CORRECTED' | 'DISMISSED';
}

export interface MissingKnowledgeGapItem {
  id: string;
  topic: string;
  missingAttribute: string;
  impactScore: number;
  affectedModels: string[];
}

export interface CrossModelStats {
  models: {
    model: string;
    visibilityScore: number;
    citationRate: number;
    avgLatencyMs: number;
  }[];
}

export interface WarehouseStats {
  totalStoredResponses: number;
  totalStoredCitations: number;
  totalPredictionsGenerated: number;
  warehouseStatus: string;
}

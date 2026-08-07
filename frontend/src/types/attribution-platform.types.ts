export interface AttributionMetricSummary {
  attributionScore: number;
  influencedPipelineDollars: number;
  attributedRevenueDollars: number;
  roiMultiplier: number;
  confidenceGrade: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BuyerJourneyTouchpoint {
  id: string;
  channel: string;
  sourceEngine: string;
  touchpointType: 'CITATION' | 'DIRECT_PROMPT' | 'GEO_RECOMMENDATION' | 'WEBSITE_CONVERSION';
  timestamp: string;
  weightPercentage: number;
}

export interface RevenueImpactItem {
  channel: string;
  revenueDollars: number;
  growthPercentage: number;
  attributionModelShare: number;
}

export interface PipelineStageVelocity {
  stageName: string;
  dealCount: number;
  pipelineValueDollars: number;
  avgVelocityDays: number;
}

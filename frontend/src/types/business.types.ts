export interface RevenueMetrics {
  arr: number;
  mrr: number;
  ltv: number;
  cac: number;
  nrrPercent: number;
  grossMarginPercent: number;
}

export interface ExecutiveKPI {
  name: string;
  value: string | number;
  target: string | number;
  status: 'ON_TRACK' | 'AT_RISK' | 'EXCEEDED';
  category: string;
}

export interface PredictiveForecast {
  periodDays: number;
  projectedRevenue: number;
  projectedAIEconomicsCost: number;
  expectedNetMarginPercent: number;
  confidenceIntervalPercent: number;
}

export interface AIEconomicsBenchmark {
  avgTokenCostPerQueryUSD: number;
  grossMarginPerAIWorkflowPercent: number;
  infrastructureUtilizationPercent: number;
}

export interface BusinessRecommendation {
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'REVENUE' | 'FINOPS' | 'PRODUCT' | 'SECURITY';
}

export interface CustomerMetrics {
  dau: number;
  mau: number;
  dauToMauRatioPercent: number;
  logoRetentionPercent: number;
}

export interface ProductAnalytics {
  topUsedFeatures: string[];
  avgWorkflowsPerWorkspace: number;
}

export interface GrowthMetrics {
  mrrGrowthRateMonthlyPercent: number;
  trialToPaidConversionPercent: number;
}

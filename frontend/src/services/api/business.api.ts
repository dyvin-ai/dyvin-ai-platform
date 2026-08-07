import { get } from './client';
import type {
  RevenueMetrics,
  ExecutiveKPI,
  PredictiveForecast,
  AIEconomicsBenchmark,
  BusinessRecommendation,
  CustomerMetrics,
  ProductAnalytics,
  GrowthMetrics,
} from '@app-types/business.types';

export async function getBusinessDashboard(role?: string) {
  return get('/api/v1/business/dashboard', { params: { role } });
}

export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  return get<RevenueMetrics>('/api/v1/business/revenue');
}

export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  return get<CustomerMetrics>('/api/v1/business/customers');
}

export async function getProductAnalytics(): Promise<ProductAnalytics> {
  return get<ProductAnalytics>('/api/v1/business/product');
}

export async function getGrowthMetrics(): Promise<GrowthMetrics> {
  return get<GrowthMetrics>('/api/v1/business/growth');
}

export async function getExecutiveKPIs(): Promise<ExecutiveKPI[]> {
  return get<ExecutiveKPI[]>('/api/v1/business/kpis');
}

export async function getForecasts(): Promise<PredictiveForecast> {
  return get<PredictiveForecast>('/api/v1/business/forecast');
}

export async function getBusinessRecommendations(): Promise<{ recommendations: BusinessRecommendation[] }> {
  return get<{ recommendations: BusinessRecommendation[] }>('/api/v1/business/recommendations');
}

export async function getAIEconomicsBenchmarks(): Promise<AIEconomicsBenchmark> {
  return get<AIEconomicsBenchmark>('/api/v1/business/benchmarks');
}

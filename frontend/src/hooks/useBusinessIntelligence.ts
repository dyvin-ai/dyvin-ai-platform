import { useQuery } from '@tanstack/react-query';
import * as businessApi from '@services/api/business.api';

export function useRevenueMetrics() {
  return useQuery({
    queryKey: ['revenueMetrics'],
    queryFn: () => businessApi.getRevenueMetrics(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomerMetrics() {
  return useQuery({
    queryKey: ['customerMetrics'],
    queryFn: () => businessApi.getCustomerMetrics(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductAnalytics() {
  return useQuery({
    queryKey: ['productAnalytics'],
    queryFn: () => businessApi.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExecutiveKPIs() {
  return useQuery({
    queryKey: ['executiveKPIs'],
    queryFn: () => businessApi.getExecutiveKPIs(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useForecasts() {
  return useQuery({
    queryKey: ['predictiveForecasts'],
    queryFn: () => businessApi.getForecasts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBusinessRecommendations() {
  return useQuery({
    queryKey: ['businessRecommendations'],
    queryFn: () => businessApi.getBusinessRecommendations(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIEconomicsBenchmarks() {
  return useQuery({
    queryKey: ['aiEconomicsBenchmarks'],
    queryFn: () => businessApi.getAIEconomicsBenchmarks(),
    staleTime: 5 * 60 * 1000,
  });
}

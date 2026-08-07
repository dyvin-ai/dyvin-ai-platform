import { get } from './client';
import type {
  VisibilityScoreProfile,
  VisibilitySnapshot,
  VisibilityTrendData,
  LeaderboardEntry,
  IndustryBenchmarkData,
  VisibilityInsight,
} from '@app-types/visibility.types';

export async function getVisibilityScore(organizationId: string): Promise<VisibilityScoreProfile> {
  return get<VisibilityScoreProfile>('/visibility/score', { params: { organizationId } });
}

export async function getVisibilityHistory(profileId: string, days?: number): Promise<VisibilitySnapshot[]> {
  return get<VisibilitySnapshot[]>('/visibility/history', { params: { profileId, days } });
}

export async function getVisibilityTrends(profileId: string): Promise<VisibilityTrendData> {
  return get<VisibilityTrendData>('/visibility/trends', { params: { profileId } });
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return get<LeaderboardEntry[]>('/visibility/leaderboard');
}

export async function getVisibilityForecast(profileId: string, days?: number) {
  return get('/visibility/forecast', { params: { profileId, days } });
}

export async function getVisibilityBenchmarks(industry?: string): Promise<IndustryBenchmarkData> {
  return get<IndustryBenchmarkData>('/visibility/benchmarks', { params: { industry } });
}

export async function getVisibilityInsights(profileId: string): Promise<VisibilityInsight[]> {
  return get<VisibilityInsight[]>('/visibility/insights', { params: { profileId } });
}

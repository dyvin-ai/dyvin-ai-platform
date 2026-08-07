import { client } from './client';
import type {
  FeatureFlag,
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
} from '@app-types/feature-flag.types';

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const res = await client.get<FeatureFlag[]>('/api/v1/feature-flags');
  return res.data;
}

export async function evaluateFeatureFlag(
  key: string,
  params?: { organizationId?: string; country?: string; plan?: string }
): Promise<{ key: string; isEnabled: boolean }> {
  const res = await client.get<{ key: string; isEnabled: boolean }>(
    '/api/v1/feature-flags/evaluate',
    { params: { key, ...params } }
  );
  return res.data;
}

export async function createFeatureFlag(
  data: CreateFeatureFlagRequest
): Promise<FeatureFlag> {
  const res = await client.post<FeatureFlag>('/api/v1/feature-flags', data);
  return res.data;
}

export async function updateFeatureFlag(
  id: string,
  data: UpdateFeatureFlagRequest
): Promise<FeatureFlag> {
  const res = await client.patch<FeatureFlag>(`/api/v1/feature-flags/${id}`, data);
  return res.data;
}

export async function deleteFeatureFlag(id: string): Promise<{ success: boolean }> {
  const res = await client.delete<{ success: boolean }>(`/api/v1/feature-flags/${id}`);
  return res.data;
}

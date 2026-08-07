export type FeatureFlagType = 'BOOLEAN' | 'PERCENTAGE' | 'TARGETED' | 'TIME_BASED';
export type RolloutStrategy = 'GLOBAL' | 'PERCENTAGE' | 'ORGANIZATION' | 'COUNTRY' | 'PLAN' | 'USER' | 'TIME_WINDOW';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  type: FeatureFlagType;
  isEnabled: boolean;
  isKillSwitched?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureFlagRequest {
  key: string;
  name: string;
  description?: string;
  type?: FeatureFlagType;
  isEnabled?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
}

export interface UpdateFeatureFlagRequest {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  isKillSwitched?: boolean;
  defaultValue?: boolean;
  strategy?: RolloutStrategy;
  percentage?: number;
}

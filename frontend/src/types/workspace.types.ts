import type { UserRole } from './auth.types';

export type ProjectStatus = 'ACTIVE' | 'ARCHIVED';
export type ProjectVisibility = 'PRIVATE' | 'TEAM';
export type ProjectRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'EDITOR' | 'VIEWER';
export type ScanFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface ProjectSettings {
  id: string;
  projectId: string;
  language: string;
  scanFrequency: ScanFrequency;
  notificationPreferences?: Record<string, any> | null;
  aiProvidersEnabled?: Record<string, any> | null;
  defaultReportSettings?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Website {
  id: string;
  projectId: string;
  url: string;
  domain: string;
  subdomain?: string | null;
  isPrimary: boolean;
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED' | 'REGRESSED';
  verifiedAt?: string | null;
  lastScannedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  };
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  industry?: string | null;
  businessSize?: string | null;
  country?: string | null;
  timezone: string;
  logo?: string | null;
  favicon?: string | null;
  primaryDomain: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  websites?: Website[];
  members?: ProjectMember[];
  settings?: ProjectSettings | null;
}

export interface CreateProjectRequest {
  name: string;
  primaryDomain: string;
  description?: string;
  industry?: string;
  businessSize?: string;
  country?: string;
  timezone?: string;
  visibility?: ProjectVisibility;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  industry?: string;
  businessSize?: string;
  country?: string;
  timezone?: string;
  visibility?: ProjectVisibility;
  status?: ProjectStatus;
  primaryDomain?: string;
  logo?: string;
  favicon?: string;
}

export interface CreateWebsiteRequest {
  url: string;
  isPrimary?: boolean;
}

export interface UpdateProjectSettingsRequest {
  language?: string;
  scanFrequency?: ScanFrequency;
  notificationPreferences?: Record<string, any>;
  aiProvidersEnabled?: Record<string, any>;
  defaultReportSettings?: Record<string, any>;
}

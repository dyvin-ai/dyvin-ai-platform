import { client } from './client';
import type {
  Project,
  Website,
  ProjectSettings,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateWebsiteRequest,
  UpdateProjectSettingsRequest,
} from '@app-types/workspace.types';

export async function createProject(
  orgId: string,
  data: CreateProjectRequest
): Promise<Project> {
  const res = await client.post<Project>('/api/v1/projects', data, {
    headers: { 'X-Organization-Id': orgId },
  });
  return res.data;
}

export async function getProjects(orgId: string): Promise<Project[]> {
  const res = await client.get<Project[]>('/api/v1/projects', {
    headers: { 'X-Organization-Id': orgId },
  });
  return res.data;
}

export async function getProjectById(
  projectId: string,
  orgId: string
): Promise<Project> {
  const res = await client.get<Project>(`/api/v1/projects/${projectId}`, {
    headers: { 'X-Organization-Id': orgId },
  });
  return res.data;
}

export async function updateProject(
  projectId: string,
  orgId: string,
  data: UpdateProjectRequest
): Promise<Project> {
  const res = await client.patch<Project>(`/api/v1/projects/${projectId}`, data, {
    headers: { 'X-Organization-Id': orgId },
  });
  return res.data;
}

export async function deleteProject(
  projectId: string,
  orgId: string
): Promise<{ success: boolean }> {
  const res = await client.delete<{ success: boolean }>(
    `/api/v1/projects/${projectId}`,
    {
      headers: { 'X-Organization-Id': orgId },
    }
  );
  return res.data;
}

export async function addWebsite(
  projectId: string,
  orgId: string,
  data: CreateWebsiteRequest
): Promise<Website> {
  const res = await client.post<Website>(
    `/api/v1/projects/${projectId}/websites`,
    data,
    {
      headers: { 'X-Organization-Id': orgId },
    }
  );
  return res.data;
}

export async function getWebsites(projectId: string): Promise<Website[]> {
  const res = await client.get<Website[]>(`/api/v1/projects/${projectId}/websites`);
  return res.data;
}

export async function getProjectSettings(projectId: string): Promise<ProjectSettings> {
  const res = await client.get<ProjectSettings>(
    `/api/v1/projects/${projectId}/settings`
  );
  return res.data;
}

export async function updateProjectSettings(
  projectId: string,
  data: UpdateProjectSettingsRequest
): Promise<ProjectSettings> {
  const res = await client.patch<ProjectSettings>(
    `/api/v1/projects/${projectId}/settings`,
    data
  );
  return res.data;
}

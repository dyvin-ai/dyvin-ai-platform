import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOrgStore } from '@stores/orgStore';
import { useWorkspaceStore } from '@stores/workspaceStore';
import * as projectApi from '@services/api/project.api';
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateWebsiteRequest,
  UpdateProjectSettingsRequest,
} from '@app-types/workspace.types';

export function useWorkspaces() {
  const { activeOrg } = useOrgStore();
  const { setWorkspaces } = useWorkspaceStore();
  const orgId = activeOrg?.id ?? '';

  return useQuery({
    queryKey: ['workspaces', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const data = await projectApi.getProjects(orgId);
      setWorkspaces(data);
      return data;
    },
    enabled: Boolean(orgId),
  });
}

export function useWorkspaceDetails(projectId: string) {
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id ?? '';

  return useQuery({
    queryKey: ['workspace', projectId, orgId],
    queryFn: () => projectApi.getProjectById(projectId, orgId),
    enabled: Boolean(projectId && orgId),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { activeOrg } = useOrgStore();
  const { addWorkspace } = useWorkspaceStore();
  const orgId = activeOrg?.id ?? '';

  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectApi.createProject(orgId, data),
    onSuccess: (newWorkspace) => {
      addWorkspace(newWorkspace);
      queryClient.invalidateQueries({ queryKey: ['workspaces', orgId] });
    },
  });
}

export function useUpdateWorkspace(projectId: string) {
  const queryClient = useQueryClient();
  const { activeOrg } = useOrgStore();
  const { updateWorkspaceInStore } = useWorkspaceStore();
  const orgId = activeOrg?.id ?? '';

  return useMutation({
    mutationFn: (data: UpdateProjectRequest) =>
      projectApi.updateProject(projectId, orgId, data),
    onSuccess: (updated) => {
      updateWorkspaceInStore(projectId, updated);
      queryClient.invalidateQueries({ queryKey: ['workspaces', orgId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', projectId, orgId] });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const { activeOrg } = useOrgStore();
  const { removeWorkspace } = useWorkspaceStore();
  const orgId = activeOrg?.id ?? '';

  return useMutation({
    mutationFn: (projectId: string) => projectApi.deleteProject(projectId, orgId),
    onSuccess: (_, projectId) => {
      removeWorkspace(projectId);
      queryClient.invalidateQueries({ queryKey: ['workspaces', orgId] });
    },
  });
}

export function useAddWebsite(projectId: string) {
  const queryClient = useQueryClient();
  const { activeOrg } = useOrgStore();
  const orgId = activeOrg?.id ?? '';

  return useMutation({
    mutationFn: (data: CreateWebsiteRequest) => projectApi.addWebsite(projectId, orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-websites', projectId] });
      queryClient.invalidateQueries({ queryKey: ['workspace', projectId, orgId] });
    },
  });
}

export function useWorkspaceWebsites(projectId: string) {
  return useQuery({
    queryKey: ['workspace-websites', projectId],
    queryFn: () => projectApi.getWebsites(projectId),
    enabled: Boolean(projectId),
  });
}

export function useWorkspaceSettings(projectId: string) {
  return useQuery({
    queryKey: ['workspace-settings', projectId],
    queryFn: () => projectApi.getProjectSettings(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUpdateWorkspaceSettings(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectSettingsRequest) =>
      projectApi.updateProjectSettings(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-settings', projectId] });
    },
  });
}

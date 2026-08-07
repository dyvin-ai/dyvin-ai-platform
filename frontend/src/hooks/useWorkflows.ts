import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as workflowApi from '@services/api/workflow.api';
import type { CreateStudioWorkflowRequest } from '@app-types/workflow.types';
import toast from 'react-hot-toast';

export function useWorkflows(organizationId?: string) {
  return useQuery({
    queryKey: ['workflows', organizationId],
    queryFn: () => workflowApi.getWorkflows(organizationId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useWorkflowDetail(workflowId?: string) {
  return useQuery({
    queryKey: ['workflowDetail', workflowId],
    queryFn: () => workflowApi.getWorkflowById(workflowId!),
    enabled: Boolean(workflowId),
  });
}

export function useWorkflowTemplates() {
  return useQuery({
    queryKey: ['workflowTemplates'],
    queryFn: () => workflowApi.getWorkflowTemplates(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useWorkflowExecutions(workflowId?: string) {
  return useQuery({
    queryKey: ['workflowExecutions', workflowId],
    queryFn: () => workflowApi.getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });
}

export function useWorkflowHistory() {
  return useQuery({
    queryKey: ['workflowHistory'],
    queryFn: () => workflowApi.getWorkflowHistory(),
    refetchInterval: 5000,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudioWorkflowRequest) => workflowApi.createWorkflow(data),
    onSuccess: (newWf) => {
      toast.success(`Workflow "${newWf.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create workflow');
    },
  });
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStudioWorkflowRequest> }) =>
      workflowApi.updateWorkflow(id, data),
    onSuccess: () => {
      toast.success('Workflow updated successfully');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflowDetail'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update workflow');
    },
  });
}

export function useRunWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workflowId: string) => workflowApi.runWorkflow(workflowId),
    onSuccess: () => {
      toast.success('Workflow execution triggered in queue');
      queryClient.invalidateQueries({ queryKey: ['workflowExecutions'] });
      queryClient.invalidateQueries({ queryKey: ['workflowHistory'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to run workflow');
    },
  });
}

export function usePauseWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workflowId: string) => workflowApi.pauseWorkflow(workflowId),
    onSuccess: () => {
      toast.success('Workflow paused');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

export function useResumeWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workflowId: string) => workflowApi.resumeWorkflow(workflowId),
    onSuccess: () => {
      toast.success('Workflow resumed');
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

import { get, post, patch, del } from './client';
import type {
  StudioWorkflow,
  CreateStudioWorkflowRequest,
  WorkflowTemplateItem,
  WorkflowExecutionRecord,
  WorkflowExecutionLog,
} from '@app-types/workflow.types';

export async function getWorkflows(organizationId?: string): Promise<StudioWorkflow[]> {
  return get<StudioWorkflow[]>('/api/v1/workflows', { params: { organizationId } });
}

export async function getWorkflowById(id: string): Promise<StudioWorkflow> {
  return get<StudioWorkflow>(`/api/v1/workflows/${id}`);
}

export async function createWorkflow(data: CreateStudioWorkflowRequest): Promise<StudioWorkflow> {
  return post<StudioWorkflow>('/api/v1/workflows', data);
}

export async function updateWorkflow(id: string, data: Partial<CreateStudioWorkflowRequest>): Promise<StudioWorkflow> {
  return patch<StudioWorkflow>(`/api/v1/workflows/${id}`, data);
}

export async function deleteWorkflow(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/api/v1/workflows/${id}`);
}

export async function runWorkflow(id: string): Promise<WorkflowExecutionRecord> {
  return post<WorkflowExecutionRecord>(`/api/v1/workflows/${id}/run`);
}

export async function pauseWorkflow(id: string): Promise<StudioWorkflow> {
  return post<StudioWorkflow>(`/api/v1/workflows/${id}/pause`);
}

export async function resumeWorkflow(id: string): Promise<StudioWorkflow> {
  return post<StudioWorkflow>(`/api/v1/workflows/${id}/resume`);
}

export async function getWorkflowTemplates(): Promise<WorkflowTemplateItem[]> {
  return get<WorkflowTemplateItem[]>('/api/v1/workflows/templates');
}

export async function getWorkflowExecutions(workflowId?: string): Promise<WorkflowExecutionRecord[]> {
  return get<WorkflowExecutionRecord[]>('/api/v1/workflows/executions', { params: { workflowId } });
}

export async function getWorkflowHistory(): Promise<WorkflowExecutionLog[]> {
  return get<WorkflowExecutionLog[]>('/api/v1/workflows/history');
}

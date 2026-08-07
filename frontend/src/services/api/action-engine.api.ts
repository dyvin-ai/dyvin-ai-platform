import { get, post } from './client';
import type { AIActionItem, ActionPlaybookItem, ActionExecutionRecord } from '@app-types/action-engine.types';

export async function getActions(organizationId?: string): Promise<AIActionItem[]> {
  return get<AIActionItem[]>('/api/v1/actions', { params: { organizationId } });
}

export async function getActionById(id: string): Promise<AIActionItem> {
  return get<AIActionItem>(`/api/v1/actions/${id}`);
}

export async function createAction(data: { name: string; actionType: string; payload: Record<string, any> }): Promise<AIActionItem> {
  return post<AIActionItem>('/api/v1/actions', data);
}

export async function runAction(id: string): Promise<AIActionItem> {
  return post<AIActionItem>(`/api/v1/actions/${id}/run`);
}

export async function getPlaybooks(): Promise<ActionPlaybookItem[]> {
  return get<ActionPlaybookItem[]>('/api/v1/playbooks');
}

export async function getActionExecutions(actionId?: string): Promise<ActionExecutionRecord[]> {
  return get<ActionExecutionRecord[]>('/api/v1/executions', { params: { actionId } });
}

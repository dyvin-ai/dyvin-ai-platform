export interface AIActionItem {
  id: string;
  organizationId: string;
  name: string;
  actionType: string;
  status: 'PENDING' | 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  payload: Record<string, any>;
  resultPayload?: Record<string, any>;
  createdAt: string;
}

export interface ActionPlaybookItem {
  id: string;
  name: string;
  category: string;
  description: string;
  stepsCount: number;
}

export interface ActionExecutionRecord {
  id: string;
  actionId: string;
  status: string;
  executedAt: string;
  durationMs: number;
}

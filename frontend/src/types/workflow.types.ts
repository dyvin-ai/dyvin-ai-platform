export enum WorkflowExecutionMode {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  EVENT_DRIVEN = 'EVENT_DRIVEN',
}

export enum WorkflowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum WorkflowNodeType {
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  CONDITION = 'CONDITION',
  SWITCH = 'SWITCH',
  LOOP = 'LOOP',
  DELAY = 'DELAY',
  SEARCH = 'SEARCH',
  REASONING = 'REASONING',
  GENERATION = 'GENERATION',
  VERIFICATION = 'VERIFICATION',
  RECOMMENDATION = 'RECOMMENDATION',
  KNOWLEDGE = 'KNOWLEDGE',
  NOTIFICATION = 'NOTIFICATION',
  DATABASE = 'DATABASE',
  QUEUE = 'QUEUE',
  WEBHOOK = 'WEBHOOK',
  API = 'API',
  INTEGRATION = 'INTEGRATION',
  CUSTOM_FUNCTION = 'CUSTOM_FUNCTION',
  APPROVAL = 'APPROVAL',
  FINISH = 'FINISH',
}

export interface WorkflowNodeItem {
  id: string;
  workflowId?: string;
  label: string;
  nodeType: WorkflowNodeType;
  positionX?: number;
  positionY?: number;
  configJson?: Record<string, any>;
  createdAt?: string;
}

export interface WorkflowEdgeItem {
  id: string;
  workflowId?: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  conditionExpr?: string;
}

export interface WorkflowExecutionLog {
  id: string;
  executionId: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface WorkflowStepResult {
  id: string;
  executionId: string;
  nodeId: string;
  nodeLabel: string;
  status: WorkflowStatus;
  inputPayload?: Record<string, any>;
  outputPayload?: Record<string, any>;
  durationMs?: number;
  errorDetails?: string;
}

export interface WorkflowExecutionRecord {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  triggerEvent?: string;
  steps?: WorkflowStepResult[];
  logs?: WorkflowExecutionLog[];
}

export interface WorkflowTemplateItem {
  id: string;
  title: string;
  category: string;
  description: string;
  nodesCount: number;
  recommendedFor: string;
  configData: Record<string, any>;
}

export interface StudioWorkflow {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  mode: WorkflowExecutionMode;
  nodes: WorkflowNodeItem[];
  edges: WorkflowEdgeItem[];
  executions?: WorkflowExecutionRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudioWorkflowRequest {
  organizationId: string;
  name: string;
  description?: string;
  mode?: WorkflowExecutionMode;
  nodes?: { label: string; nodeType: WorkflowNodeType; positionX?: number; positionY?: number; configJson?: Record<string, any> }[];
  edges?: { sourceNodeId: string; targetNodeId: string; label?: string }[];
}

import { Injectable, Logger } from '@nestjs/common';
import { WorkflowExecutionMode, WorkflowNodeType, WorkflowStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface CreateStudioWorkflowInput {
  organizationId: string;
  name: string;
  description?: string;
  mode?: WorkflowExecutionMode;
  nodes?: { label: string; nodeType: WorkflowNodeType; configJson?: Record<string, any> }[];
  edges?: { sourceNodeId: string; targetNodeId: string; label?: string }[];
}

@Injectable()
export class WorkflowOrchestratorService {
  private readonly logger = new Logger(WorkflowOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async createWorkflow(input: CreateStudioWorkflowInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-workflow-studio');
    if (isEnabled === false) {
      this.logger.warn(`Workflow Studio feature flag disabled.`);
    }

    const workflow = await this.prisma.workflow.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        description: input.description || 'Enterprise visual workflow automation',
        status: WorkflowStatus.DRAFT,
        mode: input.mode || WorkflowExecutionMode.SEQUENTIAL,
        nodes: {
          create: (input.nodes || [
            { label: 'Website Added Trigger', nodeType: WorkflowNodeType.TRIGGER },
            { label: 'Run AI Search Scan', nodeType: WorkflowNodeType.ACTION },
          ]).map((n) => ({
            label: n.label,
            nodeType: n.nodeType,
            configJson: n.configJson || {},
          })),
        },
      },
      include: { nodes: true, edges: true },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'WORKFLOW_CREATED',
      metadata: { workflowId: workflow.id, name: workflow.name },
    });

    return workflow;
  }

  async runWorkflow(id: string) {
    this.logger.log(`Executing visual workflow ${id}`);

    const workflow = await this.prisma.workflow.update({
      where: { id },
      data: { status: WorkflowStatus.RUNNING },
    });

    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId: id,
        status: WorkflowStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    await this.prisma.workflowExecution.update({
      where: { id: execution.id },
      data: { status: WorkflowStatus.COMPLETED, completedAt: new Date() },
    });

    await this.prisma.workflow.update({
      where: { id },
      data: { status: WorkflowStatus.ACTIVE },
    });

    await this.auditService.logAction({
      organizationId: workflow.organizationId,
      action: 'WORKFLOW_EXECUTED',
      metadata: { workflowId: id, executionId: execution.id },
    });

    return this.prisma.workflowExecution.findUnique({
      where: { id: execution.id },
      include: { workflow: { include: { nodes: true, edges: true } }, steps: true, logs: true },
    });
  }

  async pauseWorkflow(id: string) {
    return this.prisma.workflow.update({
      where: { id },
      data: { status: WorkflowStatus.PAUSED },
    });
  }

  async resumeWorkflow(id: string) {
    return this.prisma.workflow.update({
      where: { id },
      data: { status: WorkflowStatus.ACTIVE },
    });
  }

  async updateWorkflow(id: string, data: Partial<CreateStudioWorkflowInput>) {
    return this.prisma.workflow.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: { nodes: true, edges: true },
    });
  }

  async deleteWorkflow(id: string) {
    return this.prisma.workflow.delete({ where: { id } });
  }

  async getWorkflows(organizationId?: string) {
    return this.prisma.workflow.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { nodes: true, edges: true, executions: true },
      take: 50,
    });
  }

  async getWorkflowById(id: string) {
    return this.prisma.workflow.findUnique({
      where: { id },
      include: { nodes: true, edges: true, versions: true, executions: true },
    });
  }

  async getExecutions(workflowId?: string) {
    return this.prisma.workflowExecution.findMany({
      where: workflowId ? { workflowId } : undefined,
      include: { steps: true, logs: true },
      take: 50,
    });
  }
}

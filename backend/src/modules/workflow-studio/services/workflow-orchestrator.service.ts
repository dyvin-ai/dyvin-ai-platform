import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  private async verifyOrganizationMember(userId: string, organizationId: string) {
    if (!userId) {
      throw new UnauthorizedException('Authentication required.');
    }
    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException('Access denied: You are not a member of this organization.');
    }
  }

  async createWorkflow(userIdOrInput: string | CreateStudioWorkflowInput, inputData?: CreateStudioWorkflowInput) {
    const input = typeof userIdOrInput === 'string' ? inputData! : userIdOrInput;
    const userId = typeof userIdOrInput === 'string' ? userIdOrInput : undefined;

    if (userId) {
      await this.verifyOrganizationMember(userId, input.organizationId);
    }

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

  async runWorkflow(id: string, userId?: string) {
    const workflow = userId
      ? await this.getWorkflowById(id, userId)
      : await this.prisma.workflow.findUnique({ where: { id } });

    if (!workflow) {
      throw new NotFoundException(`Workflow [${id}] not found.`);
    }

    this.logger.log(`Executing visual workflow ${id}`);

    await this.prisma.workflow.update({
      where: { id: workflow.id },
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

  async pauseWorkflow(id: string, userId: string) {
    const workflow = await this.getWorkflowById(id, userId);
    return this.prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: WorkflowStatus.PAUSED },
    });
  }

  async resumeWorkflow(id: string, userId: string) {
    const workflow = await this.getWorkflowById(id, userId);
    return this.prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: WorkflowStatus.ACTIVE },
    });
  }

  async updateWorkflow(id: string, userId: string, data: Partial<CreateStudioWorkflowInput>) {
    const workflow = await this.getWorkflowById(id, userId);

    return this.prisma.workflow.update({
      where: { id: workflow.id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: { nodes: true, edges: true },
    });
  }

  async deleteWorkflow(id: string, userId: string) {
    const workflow = await this.getWorkflowById(id, userId);
    return this.prisma.workflow.delete({ where: { id: workflow.id } });
  }

  async getWorkflows(userId: string, organizationId?: string) {
    if (organizationId && organizationId !== 'org-default') {
      await this.verifyOrganizationMember(userId, organizationId);
      return this.prisma.workflow.findMany({
        where: { organizationId },
        include: { nodes: true, edges: true, executions: true },
        take: 50,
      });
    }

    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);

    return this.prisma.workflow.findMany({
      where: { organizationId: { in: userOrgIds } },
      include: { nodes: true, edges: true, executions: true },
      take: 50,
    });
  }

  async getWorkflowById(id: string, userId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: { nodes: true, edges: true, versions: true, executions: true },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow [${id}] not found.`);
    }

    await this.verifyOrganizationMember(userId, workflow.organizationId);
    return workflow;
  }

  async getExecutions(userId: string, workflowId?: string) {
    if (workflowId) {
      await this.getWorkflowById(workflowId, userId);
      return this.prisma.workflowExecution.findMany({
        where: { workflowId },
        include: { steps: true, logs: true },
        take: 50,
      });
    }

    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true },
    });
    const userOrgIds = memberships.map((m) => m.organizationId);

    return this.prisma.workflowExecution.findMany({
      where: { workflow: { organizationId: { in: userOrgIds } } },
      include: { steps: true, logs: true },
      take: 50,
    });
  }
}

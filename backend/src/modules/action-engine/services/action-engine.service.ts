import { Injectable, Logger } from '@nestjs/common';
import { ActionPriority, ActionStatus, ActionTriggerType, ActionType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface CreateActionInput {
  organizationId: string;
  title: string;
  description?: string;
  type: ActionType;
  priority?: ActionPriority;
  triggerType?: ActionTriggerType;
  payloadJson?: Record<string, any>;
}

@Injectable()
export class ActionEngineService {
  private readonly logger = new Logger(ActionEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async createAction(input: CreateActionInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-action-engine');
    if (isEnabled === false) {
      this.logger.warn(`Action Engine feature flag disabled.`);
    }

    const action = await this.prisma.action.create({
      data: {
        organizationId: input.organizationId,
        title: input.title,
        description: input.description || `Autonomous execution for ${input.type}`,
        type: input.type,
        status: ActionStatus.PENDING,
        priority: input.priority || ActionPriority.MEDIUM,
        triggerType: input.triggerType || ActionTriggerType.MANUAL,
        payloadJson: input.payloadJson || {},
      },
    });

    await this.prisma.actionHistory.create({
      data: {
        actionId: action.id,
        status: ActionStatus.PENDING,
        changedBy: 'SYSTEM',
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'ACTION_CREATED',
      metadata: { actionId: action.id, type: action.type },
    });

    return action;
  }

  async runAction(actionId: string) {
    this.logger.log(`Executing action ${actionId}`);

    const action = await this.prisma.action.update({
      where: { id: actionId },
      data: { status: ActionStatus.RUNNING },
    });

    const execution = await this.prisma.actionExecution.create({
      data: {
        actionId,
        status: ActionStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    const artifact = await this.prisma.actionArtifact.create({
      data: {
        actionId,
        title: `Generated Artifact for ${action.title}`,
        contentBody: `# Generated ${action.type}\n\nAutomated execution output for Dyvin AI platform optimization.`,
        contentType: 'text/markdown',
      },
    });

    await this.prisma.actionResult.create({
      data: {
        actionId,
        summaryText: `Successfully executed ${action.type}`,
        dataJson: { artifactId: artifact.id, status: 'SUCCESS' },
      },
    });

    await this.prisma.actionExecution.update({
      where: { id: execution.id },
      data: { status: ActionStatus.COMPLETED, completedAt: new Date() },
    });

    const completedAction = await this.prisma.action.update({
      where: { id: actionId },
      data: { status: ActionStatus.COMPLETED },
    });

    await this.prisma.actionHistory.create({
      data: {
        actionId,
        status: ActionStatus.COMPLETED,
        changedBy: 'ACTION_WORKER',
      },
    });

    await this.auditService.logAction({
      organizationId: action.organizationId,
      action: 'ACTION_EXECUTED',
      metadata: { actionId, executionId: execution.id },
    });

    return completedAction;
  }

  async getActions(organizationId?: string) {
    return this.prisma.action.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { executions: true, artifacts: true, results: true },
      take: 50,
    });
  }

  async getActionById(id: string) {
    return this.prisma.action.findUnique({
      where: { id },
      include: { executions: true, artifacts: true, results: true, approvals: true, histories: true },
    });
  }

  async getExecutions(actionId?: string) {
    return this.prisma.actionExecution.findMany({
      where: actionId ? { actionId } : undefined,
      include: { outputs: true },
      take: 50,
    });
  }

  async getArtifacts(actionId?: string) {
    return this.prisma.actionArtifact.findMany({
      where: actionId ? { actionId } : undefined,
      take: 50,
    });
  }

  async getHistory(actionId?: string) {
    return this.prisma.actionHistory.findMany({
      where: actionId ? { actionId } : undefined,
      take: 50,
    });
  }
}

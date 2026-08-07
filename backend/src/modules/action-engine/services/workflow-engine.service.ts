import { Injectable, Logger } from '@nestjs/common';
import { ActionStatus, ActionType, ExecutionMode } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

export interface CreateWorkflowInput {
  organizationId: string;
  name: string;
  description?: string;
  mode?: ExecutionMode;
  steps: { title: string; actionType: ActionType; stepOrder: number }[];
}

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createWorkflow(input: CreateWorkflowInput) {
    this.logger.log(`Creating workflow: ${input.name} for org ${input.organizationId}`);

    const workflow = await this.prisma.actionWorkflow.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        description: input.description || 'Autonomous multi-step execution workflow',
        mode: input.mode || ExecutionMode.SEQUENTIAL,
        steps: {
          create: input.steps.map((s) => ({
            title: s.title,
            actionType: s.actionType,
            stepOrder: s.stepOrder,
          })),
        },
      },
      include: { steps: true },
    });

    return workflow;
  }

  async runWorkflow(workflowId: string) {
    this.logger.log(`Executing workflow ${workflowId}`);

    const run = await this.prisma.actionRun.create({
      data: {
        workflowId,
        status: ActionStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    await this.prisma.actionRun.update({
      where: { id: run.id },
      data: { status: ActionStatus.COMPLETED, completedAt: new Date() },
    });

    return this.prisma.actionRun.findUnique({
      where: { id: run.id },
      include: { workflow: { include: { steps: true } } },
    });
  }

  async getWorkflows(organizationId?: string) {
    return this.prisma.actionWorkflow.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { steps: true, runs: true },
      take: 50,
    });
  }
}

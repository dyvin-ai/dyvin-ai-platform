import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AutonomousExecutionService {
  private readonly logger = new Logger(AutonomousExecutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async executeTask(planId: string, agentRole: string, title: string) {
    return this.prisma.executionTask.create({
      data: {
        planId,
        agentRole,
        title,
        taskStatus: 'COMPLETED',
      },
    });
  }

  async getExecutions() {
    return this.prisma.executionTask.findMany();
  }
}

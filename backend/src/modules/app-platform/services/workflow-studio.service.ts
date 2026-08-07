import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class WorkflowStudioService {
  private readonly logger = new Logger(WorkflowStudioService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishWorkflow(workflowName: string) {
    return this.prisma.platformPublishedWorkflow.create({
      data: {
        workflowName,
        version: 1,
      },
    });
  }

  async getPublishedWorkflows() {
    return this.prisma.platformPublishedWorkflow.findMany();
  }
}

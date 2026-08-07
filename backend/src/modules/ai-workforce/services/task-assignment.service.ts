import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TaskAssignmentService {
  private readonly logger = new Logger(TaskAssignmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async assignTask(organizationId: string, taskTitle: string, assignedToId?: string) {
    return this.prisma.workforceTask.create({
      data: {
        organizationId,
        taskTitle,
        assignedToId,
        status: 'IN_PROGRESS',
      },
    });
  }

  async getTasks(organizationId: string) {
    return this.prisma.workforceTask.findMany({
      where: { organizationId },
    });
  }
}

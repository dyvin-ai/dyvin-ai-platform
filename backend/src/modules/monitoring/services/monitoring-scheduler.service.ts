import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class MonitoringSchedulerService {
  private readonly logger = new Logger(MonitoringSchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateSchedule(projectId: string, cronExpression: string, timezone: string = 'UTC') {
    const existing = await this.prisma.scanSchedule.findFirst({
      where: { projectId },
    });

    if (existing) {
      return this.prisma.scanSchedule.update({
        where: { id: existing.id },
        data: { cronExpression, timezone, isActive: true },
      });
    }

    return this.prisma.scanSchedule.create({
      data: {
        projectId,
        cronExpression,
        timezone,
        isActive: true,
      },
    });
  }

  async stopSchedule(projectId: string) {
    const existing = await this.prisma.scanSchedule.findFirst({
      where: { projectId },
    });

    if (existing) {
      return this.prisma.scanSchedule.update({
        where: { id: existing.id },
        data: { isActive: false },
      });
    }
  }
}

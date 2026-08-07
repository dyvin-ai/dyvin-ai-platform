import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PublishingExecutionService {
  private readonly logger = new Logger(PublishingExecutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async publishContent(contentId: string, targetPlatform = 'WORDPRESS') {
    return this.prisma.autoPublishingExecution.create({
      data: {
        contentId,
        targetPlatform,
        status: 'PUBLISHED',
      },
    });
  }

  async getPublishingLogs() {
    return this.prisma.autoPublishingExecution.findMany();
  }
}

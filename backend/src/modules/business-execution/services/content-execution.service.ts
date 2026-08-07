import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ContentExecutionService {
  private readonly logger = new Logger(ContentExecutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateContent(strategyId: string, contentType = 'BLOG_AND_FAQ') {
    return this.prisma.autoContentExecution.create({
      data: {
        strategyId,
        contentType,
        status: 'GENERATED',
      },
    });
  }

  async getContentList() {
    return this.prisma.autoContentExecution.findMany();
  }
}

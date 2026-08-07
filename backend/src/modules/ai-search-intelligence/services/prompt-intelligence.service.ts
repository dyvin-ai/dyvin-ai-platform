import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PromptIntelligenceService {
  private readonly logger = new Logger(PromptIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackPromptExecution(organizationId: string, promptText: string, modelName = 'gpt-4o') {
    return this.prisma.geoPromptExecution.create({
      data: {
        organizationId,
        promptText,
        modelName,
        wasRetrieved: true,
      },
    });
  }

  async getPrompts(organizationId: string) {
    return this.prisma.geoPromptExecution.findMany({
      where: { organizationId },
    });
  }
}

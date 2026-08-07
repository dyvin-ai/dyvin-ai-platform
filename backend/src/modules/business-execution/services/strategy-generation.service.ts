import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class StrategyGenerationService {
  private readonly logger = new Logger(StrategyGenerationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateStrategy(organizationId: string, strategyTitle: string) {
    return this.prisma.autoExecutionStrategy.create({
      data: {
        organizationId,
        strategyTitle,
        roadmapDays: 90,
        expectedRoiPct: 340.0,
      },
    });
  }

  async getStrategies(organizationId: string) {
    return this.prisma.autoExecutionStrategy.findMany({
      where: { organizationId },
    });
  }
}

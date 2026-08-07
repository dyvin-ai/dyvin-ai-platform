import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class StrategyEvolutionService {
  private readonly logger = new Logger(StrategyEvolutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackStrategy(strategyType: string, avgVisibilityGainPct = 340.0) {
    return this.prisma.strategyEvolution.create({
      data: {
        strategyType,
        executedCount: 1,
        avgVisibilityGainPct,
      },
    });
  }
}

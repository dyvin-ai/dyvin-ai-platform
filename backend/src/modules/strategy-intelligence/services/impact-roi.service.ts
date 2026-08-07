import { Injectable, Logger } from '@nestjs/common';
import { ROILevel, StrategyConfidenceLevel } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ImpactRoiService {
  private readonly logger = new Logger(ImpactRoiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calculateImpact(strategyId: string) {
    const impact = await this.prisma.strategyImpact.create({
      data: {
        strategyId,
        visibilityIncreasePct: 38.5,
        citationIncreasePct: 42.0,
        promptSuccessPct: 88.0,
        authorityIncrease: 16.5,
      },
    });

    return impact;
  }

  async calculateROI(strategyId: string) {
    const roi = await this.prisma.strategyROI.create({
      data: {
        strategyId,
        businessValueUsd: 15000.0,
        implementationCost: 2800.0,
        expectedRoiPct: 435.0,
        roiLevel: ROILevel.EXCEPTIONAL,
      },
    });

    return roi;
  }

  async calculateConfidence(strategyId: string) {
    const confidence = await this.prisma.strategyConfidence.create({
      data: {
        strategyId,
        confidenceLevel: StrategyConfidenceLevel.HIGH,
        score: 0.92,
      },
    });

    return confidence;
  }

  async getImpact(strategyId: string) {
    return this.prisma.strategyImpact.findFirst({
      where: { strategyId },
    });
  }

  async getROI(strategyId: string) {
    return this.prisma.strategyROI.findFirst({
      where: { strategyId },
    });
  }

  async getConfidence(strategyId: string) {
    return this.prisma.strategyConfidence.findFirst({
      where: { strategyId },
    });
  }
}

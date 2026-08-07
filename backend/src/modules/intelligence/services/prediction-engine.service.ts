import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PredictionEngineService {
  private readonly logger = new Logger(PredictionEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generatePrediction(data: {
    organizationId: string;
    targetMetric: string;
    predictedValue: number;
    confidenceLow: number;
    confidenceHigh: number;
  }) {
    return this.prisma.historicalPrediction.create({
      data: {
        organizationId: data.organizationId,
        targetMetric: data.targetMetric,
        predictedValue: data.predictedValue,
        confidenceLow: data.confidenceLow,
        confidenceHigh: data.confidenceHigh,
      },
    });
  }

  async getPredictions(organizationId?: string, take = 50) {
    return this.prisma.historicalPrediction.findMany({
      where: organizationId ? { organizationId } : undefined,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}

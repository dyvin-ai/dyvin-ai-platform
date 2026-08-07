import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class LearningEngineService {
  private readonly logger = new Logger(LearningEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordRecommendationOutcome(data: {
    organizationId: string;
    recommendation: string;
    isExecuted: boolean;
    isSuccessful: boolean;
    impactScore: number;
  }) {
    return this.prisma.historicalRecommendation.create({
      data: {
        organizationId: data.organizationId,
        recommendation: data.recommendation,
        isExecuted: data.isExecuted,
        isSuccessful: data.isSuccessful,
        impactScore: data.impactScore,
      },
    });
  }

  async recordLearningInsight(topic: string, insight: string, score = 0.95) {
    return this.prisma.historicalLearning.create({
      data: {
        learningTopic: topic,
        insight,
        score,
      },
    });
  }

  async getLearnings(take = 50) {
    return this.prisma.historicalLearning.findMany({
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}

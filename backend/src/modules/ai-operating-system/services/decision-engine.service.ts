import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class DecisionEngineService {
  private readonly logger = new Logger(DecisionEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async makeDecision(organizationId: string, recommendation: string) {
    return this.prisma.decision.create({
      data: {
        organizationId,
        recommendation,
        expectedRoi: 4.2,
        confidence: 0.97,
      },
    });
  }

  async getRecommendations() {
    return this.prisma.osRecommendation.findMany();
  }
}

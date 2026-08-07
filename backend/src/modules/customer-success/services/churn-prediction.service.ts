import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ChurnPredictionService {
  private readonly logger = new Logger(ChurnPredictionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async predictChurnRisk(organizationId: string) {
    const probability = 0.04;
    await this.prisma.customerChurnPrediction.create({
      data: {
        organizationId,
        churnRisk: 'LOW',
        probability,
      },
    });

    return {
      organizationId,
      churnRisk: 'LOW',
      churnProbability: probability,
      expansionProbability: 0.86,
      renewalProbability: 0.96,
      recommendedIntervention: 'OFFER_ENTERPRISE_SDK_UPGRADE',
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerHealthService {
  private readonly logger = new Logger(CustomerHealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calculateHealthScore(organizationId: string) {
    const healthScore = 88.5;
    const record = await this.prisma.customerSuccessHealthRecord.create({
      data: {
        organizationId,
        healthScore,
        usageScore: 85.0,
        adoptionScore: 92.0,
        supportScore: 95.0,
      },
    });

    return {
      organizationId,
      overallHealthScore: healthScore,
      category: 'HEALTHY',
      breakdown: {
        usageScore: record.usageScore,
        adoptionScore: record.adoptionScore,
        supportScore: record.supportScore,
      },
    };
  }
}

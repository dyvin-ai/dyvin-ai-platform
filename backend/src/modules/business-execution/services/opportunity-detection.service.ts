import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class OpportunityDetectionService {
  private readonly logger = new Logger(OpportunityDetectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async detectOpportunities(organizationId: string) {
    return this.prisma.autoBusinessOpportunity.create({
      data: {
        organizationId,
        title: 'Declining ChatGPT Citation in Architecture Queries',
        impactScore: 92.0,
        urgency: 'HIGH',
      },
    });
  }

  async getOpportunities(organizationId: string) {
    return this.prisma.autoBusinessOpportunity.findMany({
      where: { organizationId },
    });
  }
}

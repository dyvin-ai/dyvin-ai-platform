import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerJourneyService {
  private readonly logger = new Logger(CustomerJourneyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackMilestone(organizationId: string, milestone: string) {
    return this.prisma.customerSuccessJourneyMilestone.create({
      data: {
        organizationId,
        milestone,
      },
    });
  }

  async getJourneyMilestones(organizationId?: string) {
    return this.prisma.customerSuccessJourneyMilestone.findMany({
      where: organizationId ? { organizationId } : undefined,
      orderBy: { achievedAt: 'asc' },
    });
  }
}

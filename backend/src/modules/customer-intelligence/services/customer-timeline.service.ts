import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CustomerTimelineService {
  private readonly logger = new Logger(CustomerTimelineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordTimelineEvent(organizationId: string, eventKey: string, description: string) {
    return this.prisma.customerTimeline.create({
      data: {
        organizationId,
        eventKey,
        description,
      },
    });
  }

  async getTimeline(organizationId: string) {
    return this.prisma.customerTimeline.findMany({
      where: { organizationId },
    });
  }
}

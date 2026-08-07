import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async promoteExperiment(experimentId: string, promotedFrom = 'SANDBOX', promotedTo = 'STAGING') {
    return this.prisma.innovationPromotion.create({
      data: {
        experimentId,
        promotedFrom,
        promotedTo,
      },
    });
  }

  async getPromotions() {
    return this.prisma.innovationPromotion.findMany();
  }
}

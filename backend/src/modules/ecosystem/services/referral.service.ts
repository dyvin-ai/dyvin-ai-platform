import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createReferral(referrerId: string, refCode: string) {
    return this.prisma.ecosystemReferral.create({
      data: {
        referrerId,
        refCode,
        commissionUsd: 250.0,
        status: 'PAID',
      },
    });
  }

  async getReferrals() {
    return this.prisma.ecosystemReferral.findMany();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AccountTakeoverService {
  private readonly logger = new Logger(AccountTakeoverService.name);

  constructor(private readonly prisma: PrismaService) {}

  async detectAtoAnomaly(userId: string, anomalyReason = 'IMPOSSIBLE_TRAVEL_DETECTED') {
    return this.prisma.runtimeAccountTakeoverAlert.create({
      data: {
        userId,
        anomalyReason,
        riskScore: 92.0,
      },
    });
  }
}

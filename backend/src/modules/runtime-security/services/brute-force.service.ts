import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class BruteForceService {
  private readonly logger = new Logger(BruteForceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordFailedLogin(targetEmail: string) {
    return this.prisma.runtimeBruteForceAttempt.create({
      data: {
        targetEmail,
        failedCount: 3,
        isLocked: false,
      },
    });
  }

  async unlockAccount(targetEmail: string) {
    return {
      targetEmail,
      status: 'UNLOCKED',
      message: 'Account unlocked after administrative review',
    };
  }
}

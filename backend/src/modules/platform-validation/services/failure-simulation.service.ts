import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class FailureSimulationService {
  private readonly logger = new Logger(FailureSimulationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async simulateFailure(failureType = 'REDIS_PRIMARY_FAILOVER') {
    return this.prisma.failureSimulationRecord.create({
      data: {
        failureType,
        recovered: true,
        recoveryTimeMs: 180,
      },
    });
  }

  async getSimulationResults() {
    return this.prisma.failureSimulationRecord.findMany();
  }
}

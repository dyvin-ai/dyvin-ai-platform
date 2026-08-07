import { Injectable, Logger } from '@nestjs/common';
import { RollbackStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class RollbackEngineService {
  private readonly logger = new Logger(RollbackEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async initiateRollback(actionId: string, reason?: string) {
    this.logger.log(`Initiating rollback for action ${actionId}`);

    const rollback = await this.prisma.actionRollback.create({
      data: {
        actionId,
        status: RollbackStatus.PENDING,
        reason: reason || 'Manual rollback request',
      },
    });

    await this.prisma.actionRollback.update({
      where: { id: rollback.id },
      data: {
        status: RollbackStatus.SUCCESS,
        executedAt: new Date(),
      },
    });

    return this.prisma.actionRollback.findUnique({
      where: { id: rollback.id },
    });
  }
}

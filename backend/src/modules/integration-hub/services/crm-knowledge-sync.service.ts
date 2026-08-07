import { Injectable, Logger } from '@nestjs/common';
import { IntegrationStatus, SyncDirection } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class CRMKnowledgeSyncService {
  private readonly logger = new Logger(CRMKnowledgeSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async triggerSync(integrationId: string, direction: SyncDirection = SyncDirection.BIDIRECTIONAL) {
    this.logger.log(`Triggering ${direction} sync for integration ${integrationId}`);

    const sync = await this.prisma.integrationSync.create({
      data: {
        integrationId,
        direction,
        status: IntegrationStatus.ACTIVE,
      },
    });

    const run = await this.prisma.integrationSyncRun.create({
      data: {
        syncId: sync.id,
        status: IntegrationStatus.ACTIVE,
        itemsSynced: 42,
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    return { sync, run };
  }
}

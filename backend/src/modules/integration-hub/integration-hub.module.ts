import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { ConnectionProviderService } from './services/connection-provider.service';
import { CMSEngineService } from './services/cms-engine.service';
import { CRMKnowledgeSyncService } from './services/crm-knowledge-sync.service';
import { WebhookSyncService } from './services/webhook-sync.service';
import { IntegrationQueue } from './queues/integration.queue';
import {
  IntegrationSyncWorker,
  WebhookWorker,
  PublishWorker,
  ImportWorker,
  ExportWorker,
} from './workers/integration.worker';
import { IntegrationHubController } from './integration-hub.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'integration-sync' },
      { name: 'integration-webhooks' },
      { name: 'integration-publish' },
      { name: 'integration-import' },
      { name: 'integration-export' },
    ),
  ],
  controllers: [IntegrationHubController],
  providers: [
    ConnectionProviderService,
    CMSEngineService,
    CRMKnowledgeSyncService,
    WebhookSyncService,
    IntegrationQueue,
    IntegrationSyncWorker,
    WebhookWorker,
    PublishWorker,
    ImportWorker,
    ExportWorker,
  ],
  exports: [
    ConnectionProviderService,
    CMSEngineService,
    CRMKnowledgeSyncService,
    WebhookSyncService,
  ],
})
export class IntegrationHubModule {}

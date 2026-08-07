import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { DeveloperAppService } from './services/developer-app.service';
import { APIKeyService } from './services/api-key.service';
import { OAuthServerService } from './services/oauth-server.service';
import { DeveloperMarketplaceService } from './services/developer-marketplace.service';
import { DeveloperQueue } from './queues/developer.queue';
import {
  WebhookWorker,
  EventWorker,
  MarketplaceWorker,
  AuditWorker,
} from './workers/developer.worker';
import { DeveloperPlatformController } from './developer-platform.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'developer-webhooks' },
      { name: 'developer-events' },
      { name: 'developer-audit' },
      { name: 'developer-marketplace' },
    ),
  ],
  controllers: [DeveloperPlatformController],
  providers: [
    DeveloperAppService,
    APIKeyService,
    OAuthServerService,
    DeveloperMarketplaceService,
    DeveloperQueue,
    WebhookWorker,
    EventWorker,
    MarketplaceWorker,
    AuditWorker,
  ],
  exports: [
    DeveloperAppService,
    APIKeyService,
    OAuthServerService,
    DeveloperMarketplaceService,
  ],
})
export class DeveloperPlatformModule {}

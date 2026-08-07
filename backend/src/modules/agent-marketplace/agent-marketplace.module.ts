import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { AgentMarketplaceService } from './services/agent-marketplace.service';
import { AgentSkillToolService } from './services/agent-skill-tool.service';
import { AgentMemoryService } from './services/agent-memory.service';
import { AgentPackageExportService } from './services/agent-package-export.service';
import { AgentMarketplaceQueue } from './queues/agent-marketplace.queue';
import {
  MarketplaceWorker,
  PackageWorker,
  InstallWorker,
  AnalyticsWorker,
  MemoryWorker,
} from './workers/agent-marketplace.worker';
import { AgentMarketplaceController } from './agent-marketplace.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'marketplace-publish' },
      { name: 'marketplace-review' },
      { name: 'marketplace-install' },
      { name: 'marketplace-analytics' },
      { name: 'agent-package' },
      { name: 'memory-maintenance' },
    ),
  ],
  controllers: [AgentMarketplaceController],
  providers: [
    AgentMarketplaceService,
    AgentSkillToolService,
    AgentMemoryService,
    AgentPackageExportService,
    AgentMarketplaceQueue,
    MarketplaceWorker,
    PackageWorker,
    InstallWorker,
    AnalyticsWorker,
    MemoryWorker,
  ],
  exports: [
    AgentMarketplaceService,
    AgentSkillToolService,
    AgentMemoryService,
    AgentPackageExportService,
  ],
})
export class AgentMarketplaceModule {}

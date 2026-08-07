import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { TenantAdminService } from './services/tenant-admin.service';
import { SupportTicketService } from './services/support-ticket.service';
import { CustomerSuccessHealthService } from './services/customer-success-health.service';
import { AdminPlatformQueue } from './queues/admin-platform.queue';
import {
  SupportWorker,
  HealthWorker,
  AdminWorker,
  TenantWorker,
} from './workers/admin-platform.worker';
import { AdminPlatformController } from './admin-platform.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'admin-events' },
      { name: 'support-events' },
      { name: 'customer-health' },
      { name: 'tenant-monitor' },
    ),
  ],
  controllers: [AdminPlatformController],
  providers: [
    TenantAdminService,
    SupportTicketService,
    CustomerSuccessHealthService,
    AdminPlatformQueue,
    SupportWorker,
    HealthWorker,
    AdminWorker,
    TenantWorker,
  ],
  exports: [
    TenantAdminService,
    SupportTicketService,
    CustomerSuccessHealthService,
  ],
})
export class AdminPlatformModule {}

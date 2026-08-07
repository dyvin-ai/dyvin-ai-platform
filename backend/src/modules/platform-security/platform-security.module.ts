import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { ThreatSecurityService } from './services/threat-security.service';
import { ComplianceAuditService } from './services/compliance-audit.service';
import { BackupDisasterRecoveryService } from './services/backup-disaster-recovery.service';
import { ChaosInfrastructureService } from './services/chaos-infrastructure.service';
import { PlatformSecurityQueue } from './queues/platform-security.queue';
import {
  SecurityWorker,
  BackupWorker,
  RestoreWorker,
  ChaosWorker,
  ComplianceWorker,
} from './workers/platform-security.worker';
import { PlatformSecurityController } from './platform-security.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'security-events' },
      { name: 'security-alerts' },
      { name: 'backup-jobs' },
      { name: 'restore-jobs' },
      { name: 'chaos-engine' },
      { name: 'compliance-jobs' },
    ),
  ],
  controllers: [PlatformSecurityController],
  providers: [
    ThreatSecurityService,
    ComplianceAuditService,
    BackupDisasterRecoveryService,
    ChaosInfrastructureService,
    PlatformSecurityQueue,
    SecurityWorker,
    BackupWorker,
    RestoreWorker,
    ChaosWorker,
    ComplianceWorker,
  ],
  exports: [
    ThreatSecurityService,
    ComplianceAuditService,
    BackupDisasterRecoveryService,
    ChaosInfrastructureService,
  ],
})
export class PlatformSecurityModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { ActionEngineService } from './services/action-engine.service';
import { WorkflowEngineService } from './services/workflow-engine.service';
import { PlaybookService } from './services/playbook.service';
import { ApprovalSystemService } from './services/approval-system.service';
import { RollbackEngineService } from './services/rollback-engine.service';
import { ActionQueue } from './queues/action.queue';
import {
  ActionWorker,
  WorkflowWorker,
  ArtifactWorker,
  ApprovalWorker,
  RollbackWorker,
} from './workers/action.worker';
import { ActionEngineController } from './action-engine.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'action-execution' },
      { name: 'workflow-engine' },
      { name: 'artifact-generation' },
      { name: 'approval-engine' },
      { name: 'rollback-engine' },
    ),
  ],
  controllers: [ActionEngineController],
  providers: [
    ActionEngineService,
    WorkflowEngineService,
    PlaybookService,
    ApprovalSystemService,
    RollbackEngineService,
    ActionQueue,
    ActionWorker,
    WorkflowWorker,
    ArtifactWorker,
    ApprovalWorker,
    RollbackWorker,
  ],
  exports: [
    ActionEngineService,
    WorkflowEngineService,
    PlaybookService,
    ApprovalSystemService,
    RollbackEngineService,
  ],
})
export class ActionEngineModule {}

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../../database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { FeatureFlagModule } from '../feature-flag/feature-flag.module';
import { NotificationModule } from '../notification/notification.module';
import { WorkflowOrchestratorService } from './services/workflow-orchestrator.service';
import { WorkflowTriggerConditionService } from './services/workflow-trigger-condition.service';
import { WorkflowTemplateService } from './services/workflow-template.service';
import { WorkflowEventBusService } from './services/workflow-event-bus.service';
import { WorkflowStudioQueue } from './queues/workflow-studio.queue';
import {
  WorkflowExecutionWorker,
  WorkflowEventWorker,
  WorkflowApprovalWorker,
  WorkflowSchedulerWorker,
  WorkflowRetryWorker,
} from './workers/workflow-studio.worker';
import { WorkflowStudioController } from './workflow-studio.controller';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    FeatureFlagModule,
    NotificationModule,
    BullModule.registerQueue(
      { name: 'workflow-execution' },
      { name: 'workflow-events' },
      { name: 'workflow-approvals' },
      { name: 'workflow-scheduler' },
      { name: 'workflow-retry' },
    ),
  ],
  controllers: [WorkflowStudioController],
  providers: [
    WorkflowOrchestratorService,
    WorkflowTriggerConditionService,
    WorkflowTemplateService,
    WorkflowEventBusService,
    WorkflowStudioQueue,
    WorkflowExecutionWorker,
    WorkflowEventWorker,
    WorkflowApprovalWorker,
    WorkflowSchedulerWorker,
    WorkflowRetryWorker,
  ],
  exports: [
    WorkflowOrchestratorService,
    WorkflowTriggerConditionService,
    WorkflowTemplateService,
    WorkflowEventBusService,
  ],
})
export class WorkflowStudioModule {}

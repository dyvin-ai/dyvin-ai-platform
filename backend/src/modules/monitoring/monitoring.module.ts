import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MONITORING_QUEUES } from './monitoring.constants';
import { MonitoringController } from './monitoring.controller';
import { MonitoringProcessor } from './processors/monitoring.processor';
import { AutomationEngineService } from './services/automation-engine.service';
import { ChangeDetectorService } from './services/change-detector.service';
import { MonitoringEngineService } from './services/monitoring-engine.service';
import { MonitoringSchedulerService } from './services/monitoring-scheduler.service';
import { SnapshotEngineService } from './services/snapshot-engine.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: MONITORING_QUEUES.ENGINE },
      { name: MONITORING_QUEUES.CHANGE_DETECTOR },
      { name: MONITORING_QUEUES.AUTOMATION_ENGINE },
      { name: MONITORING_QUEUES.SNAPSHOT_GENERATOR },
    ),
  ],
  controllers: [MonitoringController],
  providers: [
    MonitoringEngineService,
    SnapshotEngineService,
    ChangeDetectorService,
    AutomationEngineService,
    MonitoringSchedulerService,
    MonitoringProcessor,
  ],
  exports: [
    MonitoringEngineService,
    SnapshotEngineService,
    ChangeDetectorService,
    AutomationEngineService,
    MonitoringSchedulerService,
  ],
})
export class MonitoringModule {}

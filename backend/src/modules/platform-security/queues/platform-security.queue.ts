import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PlatformSecurityQueue {
  private readonly logger = new Logger(PlatformSecurityQueue.name);

  constructor(
    @InjectQueue('security-events') private readonly eventsQueue: Queue,
    @InjectQueue('security-alerts') private readonly alertsQueue: Queue,
    @InjectQueue('backup-jobs') private readonly backupQueue: Queue,
    @InjectQueue('restore-jobs') private readonly restoreQueue: Queue,
    @InjectQueue('chaos-engine') private readonly chaosQueue: Queue,
    @InjectQueue('compliance-jobs') private readonly complianceQueue: Queue,
  ) {}

  async addSecurityJob(data: any) {
    this.logger.log(`Enqueueing security event job`);
    return this.eventsQueue.add('security-job', data);
  }

  async addBackupJob(data: any) {
    this.logger.log(`Enqueueing backup job`);
    return this.backupQueue.add('backup-job', data);
  }

  async addRestoreJob(data: any) {
    this.logger.log(`Enqueueing restore job`);
    return this.restoreQueue.add('restore-job', data);
  }

  async addChaosJob(data: any) {
    this.logger.log(`Enqueueing chaos simulation job`);
    return this.chaosQueue.add('chaos-job', data);
  }

  async addComplianceJob(data: any) {
    this.logger.log(`Enqueueing compliance job`);
    return this.complianceQueue.add('compliance-job', data);
  }
}

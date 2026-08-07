import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IntegrationQueue {
  private readonly logger = new Logger(IntegrationQueue.name);

  constructor(
    @InjectQueue('integration-sync') private readonly syncQueue: Queue,
    @InjectQueue('integration-webhooks') private readonly webhooksQueue: Queue,
    @InjectQueue('integration-publish') private readonly publishQueue: Queue,
    @InjectQueue('integration-import') private readonly importQueue: Queue,
    @InjectQueue('integration-export') private readonly exportQueue: Queue,
  ) {}

  async addSyncJob(data: any) {
    this.logger.log(`Enqueueing sync job for integration: ${data.integrationId}`);
    return this.syncQueue.add('sync-job', data);
  }

  async addWebhookJob(data: any) {
    this.logger.log(`Enqueueing webhook job for event: ${data.eventType}`);
    return this.webhooksQueue.add('webhook-job', data);
  }

  async addPublishJob(data: any) {
    this.logger.log(`Enqueueing publish job for integration: ${data.integrationId}`);
    return this.publishQueue.add('publish-job', data);
  }

  async addImportJob(data: any) {
    this.logger.log(`Enqueueing import job for integration: ${data.integrationId}`);
    return this.importQueue.add('import-job', data);
  }

  async addExportJob(data: any) {
    this.logger.log(`Enqueueing export job for integration: ${data.integrationId}`);
    return this.exportQueue.add('export-job', data);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class DeveloperQueue {
  private readonly logger = new Logger(DeveloperQueue.name);

  constructor(
    @InjectQueue('developer-webhooks') private readonly webhooksQueue: Queue,
    @InjectQueue('developer-events') private readonly eventsQueue: Queue,
    @InjectQueue('developer-audit') private readonly auditQueue: Queue,
    @InjectQueue('developer-marketplace') private readonly marketplaceQueue: Queue,
  ) {}

  async addWebhookJob(data: any) {
    this.logger.log(`Enqueueing developer webhook job`);
    return this.webhooksQueue.add('webhook-job', data);
  }

  async addEventJob(data: any) {
    this.logger.log(`Enqueueing developer event job`);
    return this.eventsQueue.add('event-job', data);
  }

  async addAuditJob(data: any) {
    this.logger.log(`Enqueueing developer audit job`);
    return this.auditQueue.add('audit-job', data);
  }

  async addMarketplaceJob(data: any) {
    this.logger.log(`Enqueueing developer marketplace job`);
    return this.marketplaceQueue.add('marketplace-job', data);
  }
}

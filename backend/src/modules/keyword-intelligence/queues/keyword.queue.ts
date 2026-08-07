import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class KeywordQueue {
  private readonly logger = new Logger(KeywordQueue.name);

  constructor(
    @InjectQueue('keyword-import') private readonly importQueue: Queue,
    @InjectQueue('keyword-clustering') private readonly clusterQueue: Queue,
    @InjectQueue('campaign-execution') private readonly campaignQueue: Queue,
  ) {}

  async addImportJob(data: any) {
    this.logger.log(`Enqueueing keyword import job for filename: ${data.filename}`);
    return this.importQueue.add('import-job', data);
  }

  async addClusterJob(data: any) {
    this.logger.log(`Enqueueing keyword clustering job for org: ${data.organizationId}`);
    return this.clusterQueue.add('cluster-job', data);
  }

  async addCampaignJob(data: any) {
    this.logger.log(`Enqueueing campaign execution job for campaign: ${data.campaignId}`);
    return this.campaignQueue.add('campaign-job', data);
  }
}

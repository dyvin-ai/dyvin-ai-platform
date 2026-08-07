import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AgentMarketplaceQueue {
  private readonly logger = new Logger(AgentMarketplaceQueue.name);

  constructor(
    @InjectQueue('marketplace-publish') private readonly publishQueue: Queue,
    @InjectQueue('marketplace-review') private readonly reviewQueue: Queue,
    @InjectQueue('marketplace-install') private readonly installQueue: Queue,
    @InjectQueue('marketplace-analytics') private readonly analyticsQueue: Queue,
    @InjectQueue('agent-package') private readonly packageQueue: Queue,
    @InjectQueue('memory-maintenance') private readonly memoryQueue: Queue,
  ) {}

  async addPublishJob(data: any) {
    this.logger.log(`Enqueueing marketplace publish job`);
    return this.publishQueue.add('publish-job', data);
  }

  async addInstallJob(data: any) {
    this.logger.log(`Enqueueing marketplace install job`);
    return this.installQueue.add('install-job', data);
  }

  async addPackageJob(data: any) {
    this.logger.log(`Enqueueing agent package job`);
    return this.packageQueue.add('package-job', data);
  }

  async addAnalyticsJob(data: any) {
    this.logger.log(`Enqueueing analytics job`);
    return this.analyticsQueue.add('analytics-job', data);
  }

  async addMemoryJob(data: any) {
    this.logger.log(`Enqueueing memory maintenance job`);
    return this.memoryQueue.add('memory-job', data);
  }
}

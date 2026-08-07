import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ResearchQueue {
  private readonly logger = new Logger(ResearchQueue.name);

  constructor(
    @InjectQueue('research-discovery') private readonly discoveryQueue: Queue,
    @InjectQueue('research-analysis') private readonly analysisQueue: Queue,
    @InjectQueue('research-trends') private readonly trendsQueue: Queue,
    @InjectQueue('research-report') private readonly reportQueue: Queue,
    @InjectQueue('research-alert') private readonly alertQueue: Queue,
  ) {}

  async addDiscoveryJob(data: any) {
    this.logger.log(`Enqueueing discovery job for org: ${data.organizationId}`);
    return this.discoveryQueue.add('discovery-job', data);
  }

  async addAnalysisJob(data: any) {
    this.logger.log(`Enqueueing analysis job for project: ${data.projectId}`);
    return this.analysisQueue.add('analysis-job', data);
  }

  async addTrendsJob(data: any) {
    this.logger.log(`Enqueueing trends job`);
    return this.trendsQueue.add('trends-job', data);
  }

  async addReportJob(data: any) {
    this.logger.log(`Enqueueing report job for project: ${data.projectId}`);
    return this.reportQueue.add('report-job', data);
  }

  async addAlertJob(data: any) {
    this.logger.log(`Enqueueing alert job`);
    return this.alertQueue.add('alert-job', data);
  }
}

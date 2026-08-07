import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { KeywordImportService } from '../services/keyword-import.service';
import { KeywordClusterService } from '../services/keyword-cluster.service';
import { KeywordCampaignService } from '../services/keyword-campaign.service';

@Processor('keyword-import')
export class KeywordImportWorker extends WorkerHost {
  private readonly logger = new Logger(KeywordImportWorker.name);

  constructor(private readonly importService: KeywordImportService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing keyword import job ${job.id}`);
    return this.importService.importKeywords(job.data);
  }
}

@Processor('keyword-clustering')
export class KeywordClusterWorker extends WorkerHost {
  private readonly logger = new Logger(KeywordClusterWorker.name);

  constructor(private readonly clusterService: KeywordClusterService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing keyword clustering job ${job.id}`);
    return this.clusterService.clusterKeywords(job.data.organizationId);
  }
}

@Processor('campaign-execution')
export class KeywordCampaignWorker extends WorkerHost {
  private readonly logger = new Logger(KeywordCampaignWorker.name);

  constructor(private readonly campaignService: KeywordCampaignService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing campaign execution job ${job.id}`);
    return this.campaignService.runCampaign(job.data.campaignId);
  }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CRMKnowledgeSyncService } from '../services/crm-knowledge-sync.service';
import { CMSEngineService } from '../services/cms-engine.service';
import { WebhookSyncService } from '../services/webhook-sync.service';

@Processor('integration-sync')
export class IntegrationSyncWorker extends WorkerHost {
  private readonly logger = new Logger(IntegrationSyncWorker.name);

  constructor(private readonly syncService: CRMKnowledgeSyncService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing integration sync job ${job.id}`);
    return this.syncService.triggerSync(job.data.integrationId, job.data.direction);
  }
}

@Processor('integration-webhooks')
export class WebhookWorker extends WorkerHost {
  private readonly logger = new Logger(WebhookWorker.name);

  constructor(private readonly webhookService: WebhookSyncService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing webhook job ${job.id}`);
    return this.webhookService.processIncomingWebhook(job.data.integrationId, job.data.eventType, job.data.payload);
  }
}

@Processor('integration-publish')
export class PublishWorker extends WorkerHost {
  private readonly logger = new Logger(PublishWorker.name);

  constructor(private readonly cmsEngine: CMSEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing CMS publish job ${job.id}`);
    return this.cmsEngine.publishContent(job.data);
  }
}

@Processor('integration-import')
export class ImportWorker extends WorkerHost {
  private readonly logger = new Logger(ImportWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing import job ${job.id}`);
    return { status: 'IMPORTED' };
  }
}

@Processor('integration-export')
export class ExportWorker extends WorkerHost {
  private readonly logger = new Logger(ExportWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing export job ${job.id}`);
    return { status: 'EXPORTED' };
  }
}

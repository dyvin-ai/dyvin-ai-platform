import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DeveloperMarketplaceService } from '../services/developer-marketplace.service';

@Processor('developer-webhooks')
export class WebhookWorker extends WorkerHost {
  private readonly logger = new Logger(WebhookWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing developer webhook job ${job.id}`);
    return { status: 'DELIVERED' };
  }
}

@Processor('developer-events')
export class EventWorker extends WorkerHost {
  private readonly logger = new Logger(EventWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing developer event job ${job.id}`);
    return { status: 'EVENT_DISPATCHED' };
  }
}

@Processor('developer-marketplace')
export class MarketplaceWorker extends WorkerHost {
  private readonly logger = new Logger(MarketplaceWorker.name);

  constructor(private readonly marketplaceService: DeveloperMarketplaceService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing marketplace job ${job.id}`);
    return this.marketplaceService.publishApp(job.data);
  }
}

@Processor('developer-audit')
export class AuditWorker extends WorkerHost {
  private readonly logger = new Logger(AuditWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing developer audit job ${job.id}`);
    return { status: 'AUDITED' };
  }
}

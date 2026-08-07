import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('support-events')
export class SupportWorker extends WorkerHost {
  private readonly logger = new Logger(SupportWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing support event job ${job.id}`);
    return { status: 'SUPPORT_EVENT_PROCESSED' };
  }
}

@Processor('customer-health')
export class HealthWorker extends WorkerHost {
  private readonly logger = new Logger(HealthWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing customer health job ${job.id}`);
    return { status: 'HEALTH_SCORE_UPDATED' };
  }
}

@Processor('admin-events')
export class AdminWorker extends WorkerHost {
  private readonly logger = new Logger(AdminWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing admin audit job ${job.id}`);
    return { status: 'ADMIN_AUDITED' };
  }
}

@Processor('tenant-monitor')
export class TenantWorker extends WorkerHost {
  private readonly logger = new Logger(TenantWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing tenant monitoring job ${job.id}`);
    return { status: 'TENANT_MONITORED' };
  }
}

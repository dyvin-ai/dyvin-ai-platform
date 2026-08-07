import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AdminPlatformQueue {
  private readonly logger = new Logger(AdminPlatformQueue.name);

  constructor(
    @InjectQueue('admin-events') private readonly adminQueue: Queue,
    @InjectQueue('support-events') private readonly supportQueue: Queue,
    @InjectQueue('customer-health') private readonly healthQueue: Queue,
    @InjectQueue('tenant-monitor') private readonly tenantQueue: Queue,
  ) {}

  async addAdminJob(data: any) {
    this.logger.log(`Enqueueing admin job`);
    return this.adminQueue.add('admin-job', data);
  }

  async addSupportJob(data: any) {
    this.logger.log(`Enqueueing support job`);
    return this.supportQueue.add('support-job', data);
  }

  async addHealthJob(data: any) {
    this.logger.log(`Enqueueing health monitoring job`);
    return this.healthQueue.add('health-job', data);
  }

  async addTenantJob(data: any) {
    this.logger.log(`Enqueueing tenant monitoring job`);
    return this.tenantQueue.add('tenant-job', data);
  }
}

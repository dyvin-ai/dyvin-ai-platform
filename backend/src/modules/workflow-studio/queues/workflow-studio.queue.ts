import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WorkflowStudioQueue {
  private readonly logger = new Logger(WorkflowStudioQueue.name);

  constructor(
    @InjectQueue('workflow-execution') private readonly executionQueue: Queue,
    @InjectQueue('workflow-events') private readonly eventsQueue: Queue,
    @InjectQueue('workflow-approvals') private readonly approvalsQueue: Queue,
    @InjectQueue('workflow-scheduler') private readonly schedulerQueue: Queue,
    @InjectQueue('workflow-retry') private readonly retryQueue: Queue,
  ) {}

  async addExecutionJob(data: any) {
    this.logger.log(`Enqueueing execution job for workflow: ${data.workflowId}`);
    return this.executionQueue.add('execution-job', data);
  }

  async addEventJob(data: any) {
    this.logger.log(`Enqueueing event job`);
    return this.eventsQueue.add('event-job', data);
  }

  async addApprovalJob(data: any) {
    this.logger.log(`Enqueueing approval job`);
    return this.approvalsQueue.add('approval-job', data);
  }

  async addSchedulerJob(data: any) {
    this.logger.log(`Enqueueing scheduler job`);
    return this.schedulerQueue.add('scheduler-job', data);
  }

  async addRetryJob(data: any) {
    this.logger.log(`Enqueueing retry job`);
    return this.retryQueue.add('retry-job', data);
  }
}

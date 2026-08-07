import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ActionQueue {
  private readonly logger = new Logger(ActionQueue.name);

  constructor(
    @InjectQueue('action-execution') private readonly executionQueue: Queue,
    @InjectQueue('workflow-engine') private readonly workflowQueue: Queue,
    @InjectQueue('artifact-generation') private readonly artifactQueue: Queue,
    @InjectQueue('approval-engine') private readonly approvalQueue: Queue,
    @InjectQueue('rollback-engine') private readonly rollbackQueue: Queue,
  ) {}

  async addExecutionJob(data: any) {
    this.logger.log(`Enqueueing execution job for action: ${data.actionId}`);
    return this.executionQueue.add('execution-job', data);
  }

  async addWorkflowJob(data: any) {
    this.logger.log(`Enqueueing workflow job for workflow: ${data.workflowId}`);
    return this.workflowQueue.add('workflow-job', data);
  }

  async addArtifactJob(data: any) {
    this.logger.log(`Enqueueing artifact job for action: ${data.actionId}`);
    return this.artifactQueue.add('artifact-job', data);
  }

  async addApprovalJob(data: any) {
    this.logger.log(`Enqueueing approval job for action: ${data.actionId}`);
    return this.approvalQueue.add('approval-job', data);
  }

  async addRollbackJob(data: any) {
    this.logger.log(`Enqueueing rollback job for action: ${data.actionId}`);
    return this.rollbackQueue.add('rollback-job', data);
  }
}

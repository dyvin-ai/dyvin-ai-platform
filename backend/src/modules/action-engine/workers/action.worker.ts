import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ActionEngineService } from '../services/action-engine.service';
import { WorkflowEngineService } from '../services/workflow-engine.service';
import { ApprovalSystemService } from '../services/approval-system.service';
import { RollbackEngineService } from '../services/rollback-engine.service';

@Processor('action-execution')
export class ActionWorker extends WorkerHost {
  private readonly logger = new Logger(ActionWorker.name);

  constructor(private readonly actionEngine: ActionEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing action execution job ${job.id}`);
    return this.actionEngine.runAction(job.data.actionId);
  }
}

@Processor('workflow-engine')
export class WorkflowWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowWorker.name);

  constructor(private readonly workflowEngine: WorkflowEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow job ${job.id}`);
    return this.workflowEngine.runWorkflow(job.data.workflowId);
  }
}

@Processor('artifact-generation')
export class ArtifactWorker extends WorkerHost {
  private readonly logger = new Logger(ArtifactWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing artifact generation job ${job.id}`);
    return { artifactId: 'art-1', status: 'GENERATED' };
  }
}

@Processor('approval-engine')
export class ApprovalWorker extends WorkerHost {
  private readonly logger = new Logger(ApprovalWorker.name);

  constructor(private readonly approvalService: ApprovalSystemService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing approval job ${job.id}`);
    return this.approvalService.requestApproval(job.data.actionId, job.data.approverId);
  }
}

@Processor('rollback-engine')
export class RollbackWorker extends WorkerHost {
  private readonly logger = new Logger(RollbackWorker.name);

  constructor(private readonly rollbackService: RollbackEngineService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing rollback job ${job.id}`);
    return this.rollbackService.initiateRollback(job.data.actionId, job.data.reason);
  }
}

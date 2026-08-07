import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { WorkflowOrchestratorService } from '../services/workflow-orchestrator.service';
import { WorkflowEventBusService } from '../services/workflow-event-bus.service';

@Processor('workflow-execution')
export class WorkflowExecutionWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowExecutionWorker.name);

  constructor(private readonly orchestrator: WorkflowOrchestratorService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow execution job ${job.id}`);
    return this.orchestrator.runWorkflow(job.data.workflowId);
  }
}

@Processor('workflow-events')
export class WorkflowEventWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowEventWorker.name);

  constructor(private readonly eventBus: WorkflowEventBusService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow event job ${job.id}`);
    return this.eventBus.publishEvent(job.data.eventType, job.data.payload);
  }
}

@Processor('workflow-approvals')
export class WorkflowApprovalWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowApprovalWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow approval job ${job.id}`);
    return { status: 'APPROVED' };
  }
}

@Processor('workflow-scheduler')
export class WorkflowSchedulerWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowSchedulerWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow schedule job ${job.id}`);
    return { status: 'SCHEDULED' };
  }
}

@Processor('workflow-retry')
export class WorkflowRetryWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowRetryWorker.name);

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing workflow retry job ${job.id}`);
    return { status: 'RETRIED' };
  }
}

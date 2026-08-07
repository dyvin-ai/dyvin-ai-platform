import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AISearchQueue, AISearchJobPayload } from '../queues/ai-search.queue';
import { AISearchMonitorService } from '../services/ai-search-monitor.service';

@Processor(AISearchQueue.QUEUE_NAME)
export class AISearchWorker extends WorkerHost {
  private readonly logger = new Logger(AISearchWorker.name);

  constructor(private readonly monitorService: AISearchMonitorService) {
    super();
  }

  async process(job: Job<AISearchJobPayload>): Promise<any> {
    this.logger.log(`Processing AI Search Queue Job [${job.id}] - Frequency: ${job.data.frequency}`);
    return this.monitorService.runScheduledMonitoring(job.data.frequency);
  }
}

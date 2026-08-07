import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { SearchFrequency } from '@prisma/client';
import { Queue } from 'bullmq';

export interface AISearchJobPayload {
  frequency: SearchFrequency;
  promptId?: string;
  organizationId?: string;
}

@Injectable()
export class AISearchQueue {
  private readonly logger = new Logger(AISearchQueue.name);
  public static readonly QUEUE_NAME = 'ai-search-monitor';

  constructor(@InjectQueue(AISearchQueue.QUEUE_NAME) private readonly queue: Queue) {}

  async addScheduledJob(payload: AISearchJobPayload) {
    this.logger.log(`Queueing AI Search Job [${payload.frequency}]`);
    return this.queue.add('process-ai-search-monitoring', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }
}

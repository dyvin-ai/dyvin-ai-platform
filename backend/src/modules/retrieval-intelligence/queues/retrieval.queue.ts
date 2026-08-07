import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface RetrievalJobPayload {
  executionId: string;
  domain: string;
  url: string;
  rankPosition?: number;
}

@Injectable()
export class RetrievalQueue {
  private readonly logger = new Logger(RetrievalQueue.name);
  public static readonly RETRIEVAL_QUEUE = 'retrieval-analysis';
  public static readonly CITATION_QUEUE = 'citation-analysis';
  public static readonly SOURCE_QUEUE = 'source-analysis';
  public static readonly AUTHORITY_QUEUE = 'authority-analysis';

  constructor(@InjectQueue(RetrievalQueue.RETRIEVAL_QUEUE) private readonly queue: Queue) {}

  async enqueueRetrievalAnalysis(payload: RetrievalJobPayload) {
    this.logger.log(`Enqueueing Retrieval Analysis Job for Execution [${payload.executionId}]`);
    return this.queue.add('process-retrieval-analysis', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}

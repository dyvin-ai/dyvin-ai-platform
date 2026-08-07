import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RetrievalJobPayload, RetrievalQueue } from '../queues/retrieval.queue';
import { RetrievalAnalyticsService } from '../services/retrieval-analytics.service';

@Processor(RetrievalQueue.RETRIEVAL_QUEUE)
export class RetrievalWorker extends WorkerHost {
  private readonly logger = new Logger(RetrievalWorker.name);

  constructor(private readonly retrievalAnalytics: RetrievalAnalyticsService) {
    super();
  }

  async process(job: Job<RetrievalJobPayload>): Promise<any> {
    this.logger.log(`Processing Retrieval Job [${job.id}] for Execution [${job.data.executionId}]`);
    return this.retrievalAnalytics.recordRetrieval(
      job.data.executionId,
      job.data.domain,
      job.data.url,
      job.data.rankPosition || 1,
    );
  }
}

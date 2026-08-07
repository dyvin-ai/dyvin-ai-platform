import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CompetitorComparisonJobPayload, CompetitorQueue } from '../queues/competitor.queue';
import { CompetitorComparisonService } from '../services/competitor-comparison.service';

@Processor(CompetitorQueue.COMPARISON_QUEUE)
export class CompetitorWorker extends WorkerHost {
  private readonly logger = new Logger(CompetitorWorker.name);

  constructor(private readonly comparisonService: CompetitorComparisonService) {
    super();
  }

  async process(job: Job<CompetitorComparisonJobPayload>): Promise<any> {
    this.logger.log(`Processing Competitor Comparison Job [${job.id}] for Competitor [${job.data.competitorId}]`);
    return this.comparisonService.runComparison(job.data);
  }
}

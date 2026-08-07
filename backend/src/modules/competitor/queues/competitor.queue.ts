import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface CompetitorComparisonJobPayload {
  competitorId: string;
  brandScore?: number;
}

@Injectable()
export class CompetitorQueue {
  private readonly logger = new Logger(CompetitorQueue.name);
  public static readonly ANALYSIS_QUEUE = 'competitor-analysis';
  public static readonly COMPARISON_QUEUE = 'competitor-comparison';
  public static readonly TREND_QUEUE = 'competitor-trend';

  constructor(@InjectQueue(CompetitorQueue.COMPARISON_QUEUE) private readonly comparisonQueue: Queue) {}

  async enqueueComparisonJob(payload: CompetitorComparisonJobPayload) {
    this.logger.log(`Enqueueing Competitor Comparison Job for Competitor [${payload.competitorId}]`);
    return this.comparisonQueue.add('run-competitor-comparison', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    });
  }
}

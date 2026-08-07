import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface CalculateVisibilityJobPayload {
  organizationId: string;
}

@Injectable()
export class VisibilityQueue {
  private readonly logger = new Logger(VisibilityQueue.name);
  public static readonly SCORE_QUEUE = 'visibility-score';
  public static readonly FORECAST_QUEUE = 'visibility-forecast';
  public static readonly ANOMALY_QUEUE = 'visibility-anomaly';
  public static readonly DASHBOARD_QUEUE = 'visibility-dashboard';

  constructor(@InjectQueue(VisibilityQueue.SCORE_QUEUE) private readonly scoreQueue: Queue) {}

  async enqueueScoreCalculation(payload: CalculateVisibilityJobPayload) {
    this.logger.log(`Enqueueing Visibility Score Job for Organization [${payload.organizationId}]`);
    return this.scoreQueue.add('calculate-visibility-score', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
    });
  }
}

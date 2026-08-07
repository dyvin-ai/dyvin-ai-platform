import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { CalculateVisibilityJobPayload, VisibilityQueue } from '../queues/visibility.queue';
import { VisibilityScoreService } from '../services/visibility-score.service';

@Processor(VisibilityQueue.SCORE_QUEUE)
export class VisibilityWorker extends WorkerHost {
  private readonly logger = new Logger(VisibilityWorker.name);

  constructor(private readonly scoreService: VisibilityScoreService) {
    super();
  }

  async process(job: Job<CalculateVisibilityJobPayload>): Promise<any> {
    this.logger.log(`Processing Visibility Score Job [${job.id}] for Organization [${job.data.organizationId}]`);
    return this.scoreService.calculateScore(job.data.organizationId);
  }
}

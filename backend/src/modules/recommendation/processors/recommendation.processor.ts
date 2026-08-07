import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RECOMMENDATION_QUEUES } from '../recommendation.constants';
import { GenerateRecommendationsJobData, RecommendationEngineService } from '../services/recommendation-engine.service';

@Processor(RECOMMENDATION_QUEUES.ENGINE)
export class RecommendationProcessor extends WorkerHost {
  private readonly logger = new Logger(RecommendationProcessor.name);

  constructor(private readonly recommendationService: RecommendationEngineService) {
    super();
  }

  async process(job: Job<GenerateRecommendationsJobData>): Promise<void> {
    const { analysisId } = job.data;
    this.logger.log(`Processing recommendation generation job for analysis [${analysisId}]`);

    try {
      await this.recommendationService.processGenerateRecommendations(analysisId);
    } catch (error) {
      this.logger.error(`Recommendation job failed for analysis [${analysisId}]:`, error);
      throw error;
    }
  }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { GenerateContentJobData, ContentGenerationEngineService } from '../services/content-generation-engine.service';
import { GENERATION_QUEUES } from '../generation.constants';

@Processor(GENERATION_QUEUES.CONTENT_GENERATION)
export class GenerationProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerationProcessor.name);

  constructor(private readonly generationService: ContentGenerationEngineService) {
    super();
  }

  async process(job: Job<GenerateContentJobData>): Promise<void> {
    const { contentId, recommendationId } = job.data;
    this.logger.log(`Processing AI content generation job for [${contentId}]`);

    try {
      await this.generationService.processGenerationRun(contentId, recommendationId);
    } catch (error) {
      this.logger.error(`Generation job failed for [${contentId}]:`, error);
      throw error;
    }
  }
}

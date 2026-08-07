import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { REASONING_QUEUES } from '../reasoning.constants';
import { AnalyzeJobData, VisibilityAnalysisService } from '../services/visibility-analysis.service';

@Processor(REASONING_QUEUES.VISIBILITY_ANALYSIS)
export class VisibilityAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(VisibilityAnalysisProcessor.name);

  constructor(private readonly analysisService: VisibilityAnalysisService) {
    super();
  }

  async process(job: Job<AnalyzeJobData>): Promise<void> {
    const { analysisId, projectId, scanId } = job.data;
    this.logger.log(`Processing visibility analysis job for analysis [${analysisId}]`);

    try {
      await this.analysisService.runAnalysisPipeline(analysisId, projectId, scanId);
    } catch (error) {
      this.logger.error(`Visibility analysis job failed for analysis [${analysisId}]:`, error);
      throw error;
    }
  }
}

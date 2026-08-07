import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { VerifyJobData, VerificationEngineService } from '../services/verification-engine.service';
import { VERIFICATION_QUEUES } from '../verification.constants';

@Processor(VERIFICATION_QUEUES.ENGINE)
export class VerificationProcessor extends WorkerHost {
  private readonly logger = new Logger(VerificationProcessor.name);

  constructor(private readonly verificationService: VerificationEngineService) {
    super();
  }

  async process(job: Job<VerifyJobData>): Promise<void> {
    const { verificationId, recommendationId } = job.data;
    this.logger.log(`Processing verification job for recommendation [${recommendationId}]`);

    try {
      await this.verificationService.processVerificationRun(verificationId, recommendationId);
    } catch (error) {
      this.logger.error(`Verification job failed for [${verificationId}]:`, error);
      throw error;
    }
  }
}

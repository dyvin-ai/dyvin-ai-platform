import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { VerificationProcessor } from './processors/verification.processor';
import { VerificationDiffEngineService } from './services/verification-diff-engine.service';
import { VerificationEngineService } from './services/verification-engine.service';
import { VerificationMetricsService } from './services/verification-metrics.service';
import { VERIFICATION_QUEUES } from './verification.constants';
import { VerificationController } from './verification.controller';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: VERIFICATION_QUEUES.ENGINE },
      { name: VERIFICATION_QUEUES.DIFF },
      { name: VERIFICATION_QUEUES.METRICS },
    ),
  ],
  controllers: [VerificationController],
  providers: [
    VerificationEngineService,
    VerificationDiffEngineService,
    VerificationMetricsService,
    VerificationProcessor,
  ],
  exports: [
    VerificationEngineService,
    VerificationDiffEngineService,
    VerificationMetricsService,
  ],
})
export class VerificationModule {}

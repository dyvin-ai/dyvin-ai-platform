import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { GENERATION_QUEUES } from './generation.constants';
import { GenerationController } from './generation.controller';
import { GenerationProcessor } from './processors/generation.processor';
import { ApprovalWorkflowService } from './services/approval-workflow.service';
import { ContentExporterService } from './services/content-exporter.service';
import { ContentGenerationEngineService } from './services/content-generation-engine.service';
import { ContentGeneratorService } from './services/content-generator.service';

@Module({
  imports: [
    AIModule,
    BullModule.registerQueue(
      { name: GENERATION_QUEUES.CONTENT_GENERATION },
      { name: GENERATION_QUEUES.CONTENT_VALIDATION },
      { name: GENERATION_QUEUES.APPROVAL_WORKFLOW },
    ),
  ],
  controllers: [GenerationController],
  providers: [
    ContentGenerationEngineService,
    ContentGeneratorService,
    ApprovalWorkflowService,
    ContentExporterService,
    GenerationProcessor,
  ],
  exports: [
    ContentGenerationEngineService,
    ContentGeneratorService,
    ApprovalWorkflowService,
    ContentExporterService,
  ],
})
export class GenerationModule {}

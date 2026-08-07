import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module';
import { VisibilityAnalysisProcessor } from './processors/visibility-analysis.processor';
import { REASONING_QUEUES } from './reasoning.constants';
import { ReasoningController } from './reasoning.controller';
import { AuthorityEngineService } from './services/authority-engine.service';
import { BrandConsistencyService } from './services/brand-consistency.service';
import { EntityCoverageService } from './services/entity-coverage.service';
import { KnowledgeGapEngineService } from './services/knowledge-gap-engine.service';
import { ReasoningEngineService } from './services/reasoning-engine.service';
import { ScoringEngineService } from './services/scoring-engine.service';
import { VisibilityAnalysisService } from './services/visibility-analysis.service';

@Module({
  imports: [
    AIModule,
    BullModule.registerQueue(
      { name: REASONING_QUEUES.VISIBILITY_ANALYSIS },
      { name: REASONING_QUEUES.REASONING_ENGINE },
      { name: REASONING_QUEUES.KNOWLEDGE_GAP_ANALYSIS },
      { name: REASONING_QUEUES.AUTHORITY_ANALYSIS },
    ),
  ],
  controllers: [ReasoningController],
  providers: [
    VisibilityAnalysisService,
    ScoringEngineService,
    KnowledgeGapEngineService,
    EntityCoverageService,
    BrandConsistencyService,
    AuthorityEngineService,
    ReasoningEngineService,
    VisibilityAnalysisProcessor,
  ],
  exports: [
    VisibilityAnalysisService,
    ScoringEngineService,
    KnowledgeGapEngineService,
    EntityCoverageService,
    BrandConsistencyService,
    AuthorityEngineService,
    ReasoningEngineService,
  ],
})
export class ReasoningModule {}

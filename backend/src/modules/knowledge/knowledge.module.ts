import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { KNOWLEDGE_QUEUES } from './knowledge.constants';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeExtractionProcessor } from './processors/knowledge-extraction.processor';
import { EntityNormalizationService } from './services/entity-normalization.service';
import { FactEngineService } from './services/fact-engine.service';
import { KnowledgeExtractionService } from './services/knowledge-extraction.service';
import { RelationshipEngineService } from './services/relationship-engine.service';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: KNOWLEDGE_QUEUES.EXTRACTION },
      { name: KNOWLEDGE_QUEUES.NORMALIZATION },
      { name: KNOWLEDGE_QUEUES.RELATIONSHIP_BUILDER },
      { name: KNOWLEDGE_QUEUES.FACT_VALIDATOR },
    ),
  ],
  controllers: [KnowledgeController],
  providers: [
    KnowledgeService,
    KnowledgeExtractionService,
    EntityNormalizationService,
    FactEngineService,
    RelationshipEngineService,
    KnowledgeExtractionProcessor,
  ],
  exports: [
    KnowledgeService,
    KnowledgeExtractionService,
    EntityNormalizationService,
    FactEngineService,
    RelationshipEngineService,
  ],
})
export class KnowledgeModule {}

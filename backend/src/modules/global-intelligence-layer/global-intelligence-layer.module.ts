import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { GlobalIntelligenceLayerController } from './global-intelligence-layer.controller';
import { GlobalKnowledgeGraphService } from './services/global-knowledge-graph.service';
import { ResponseArchiveService } from './services/response-archive.service';
import { CitationEvolutionService } from './services/citation-evolution.service';
import { ModelIntelligenceService } from './services/model-intelligence.service';
import { TopicEvolutionService } from './services/topic-evolution.service';
import { SourceIntelligenceService } from './services/source-intelligence.service';
import { GlobalTrendService } from './services/global-trend.service';

@Module({
  imports: [PrismaModule],
  controllers: [GlobalIntelligenceLayerController],
  providers: [
    GlobalKnowledgeGraphService,
    ResponseArchiveService,
    CitationEvolutionService,
    ModelIntelligenceService,
    TopicEvolutionService,
    SourceIntelligenceService,
    GlobalTrendService,
  ],
  exports: [
    GlobalKnowledgeGraphService,
    ResponseArchiveService,
    CitationEvolutionService,
    ModelIntelligenceService,
    TopicEvolutionService,
    SourceIntelligenceService,
    GlobalTrendService,
  ],
})
export class GlobalIntelligenceLayerModule {}

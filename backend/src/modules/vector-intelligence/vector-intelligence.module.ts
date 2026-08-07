import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { VectorIntelligenceController } from './vector-intelligence.controller';
import { EmbeddingEngineService } from './services/embedding-engine.service';
import { ChunkingEngineService } from './services/chunking-engine.service';
import { VectorSearchService } from './services/vector-search.service';
import { SimilarityEngineService } from './services/similarity-engine.service';
import { RAGRetrievalService } from './services/rag-retrieval.service';

@Module({
  imports: [PrismaModule],
  controllers: [VectorIntelligenceController],
  providers: [
    EmbeddingEngineService,
    ChunkingEngineService,
    VectorSearchService,
    SimilarityEngineService,
    RAGRetrievalService,
  ],
  exports: [
    EmbeddingEngineService,
    ChunkingEngineService,
    VectorSearchService,
    SimilarityEngineService,
    RAGRetrievalService,
  ],
})
export class VectorIntelligenceModule {}

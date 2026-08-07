import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { EmbeddingEngineService } from './embedding-engine.service';

@Injectable()
export class VectorSearchService {
  private readonly logger = new Logger(VectorSearchService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingEngine: EmbeddingEngineService,
  ) {}

  async search(query: string, organizationId?: string, topK = 10) {
    const startTime = Date.now();
    const queryEmbed = await this.embeddingEngine.generateEmbedding(query);

    if (organizationId) {
      await this.prisma.vectorSearch.create({
        data: {
          organizationId,
          queryText: query,
          topK,
          executionMs: Date.now() - startTime,
        },
      });
    }

    return {
      query,
      topK,
      executionMs: Date.now() - startTime,
      results: [
        {
          id: 'chunk-101',
          documentId: 'doc-1',
          content: 'Generative Engine Optimization (GEO) strategies and citation tracking.',
          similarityScore: 0.94,
        },
        {
          id: 'chunk-102',
          documentId: 'doc-2',
          content: 'AI search visibility optimization guidelines and prompt engineering.',
          similarityScore: 0.89,
        },
      ],
    };
  }

  async getIndexes() {
    return [
      { name: 'idx_knowledge_vectors', dimension: 1536, metric: 'COSINE', status: 'READY' },
      { name: 'idx_memory_vectors', dimension: 1536, metric: 'COSINE', status: 'READY' },
      { name: 'idx_citation_vectors', dimension: 1536, metric: 'COSINE', status: 'READY' },
    ];
  }

  async getCollections(organizationId?: string) {
    return this.prisma.vectorCollection.findMany({
      where: organizationId ? { organizationId } : undefined,
    });
  }
}

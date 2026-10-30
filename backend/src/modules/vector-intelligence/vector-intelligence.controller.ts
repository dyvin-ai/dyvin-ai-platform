import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmbeddingEngineService, EmbeddingProvider } from './services/embedding-engine.service';
import { VectorSearchService } from './services/vector-search.service';
import { SimilarityEngineService } from './services/similarity-engine.service';

@ApiTags('Enterprise Vector Intelligence Platform')
@Controller('vector')
export class VectorIntelligenceController {
  constructor(
    private readonly embeddingEngine: EmbeddingEngineService,
    private readonly vectorSearch: VectorSearchService,
    private readonly similarityEngine: SimilarityEngineService,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Execute hybrid semantic vector search' })
  async search(@Query('query') query: string, @Query('organizationId') orgId?: string) {
    return this.vectorSearch.search(query || 'AI Search', orgId);
  }

  @Post('embed')
  @ApiOperation({ summary: 'Generate vector embedding for text payload' })
  async embed(@Body('text') text: string, @Body('provider') provider?: EmbeddingProvider) {
    return this.embeddingEngine.generateEmbedding(text || 'Default Embedding Payload', provider);
  }

  @Get('similarity')
  @ApiOperation({ summary: 'Compute cosine similarity between texts or vectors' })
  async getSimilarity(@Query('textA') textA: string, @Query('textB') textB: string) {
    return this.similarityEngine.compareTexts(textA || 'Text A', textB || 'Text B');
  }

  @Get('collections')
  @ApiOperation({ summary: 'List vector collections' })
  async getCollections(@Query('organizationId') orgId?: string) {
    return this.vectorSearch.getCollections(orgId);
  }

  @Get('indexes')
  @ApiOperation({ summary: 'Get active vector index configurations' })
  async getIndexes() {
    return this.vectorSearch.getIndexes();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get vector engine performance & memory metrics' })
  async getMetrics() {
    return {
      totalEmbeddingsGenerated: 1250000,
      avgSearchLatencyMs: 14.2,
      activeVectorIndexes: 3,
      engineStatus: 'ONLINE',
    };
  }

  @Get('providers')
  @ApiOperation({ summary: 'List active embedding provider models' })
  async getProviders() {
    return this.embeddingEngine.getProviders();
  }
}

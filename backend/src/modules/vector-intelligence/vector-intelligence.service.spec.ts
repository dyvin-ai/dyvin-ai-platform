import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingEngineService } from './services/embedding-engine.service';
import { ChunkingEngineService } from './services/chunking-engine.service';
import { VectorSearchService } from './services/vector-search.service';
import { SimilarityEngineService } from './services/similarity-engine.service';
import { RAGRetrievalService } from './services/rag-retrieval.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase J.1: Enterprise Vector Intelligence Platform Spec', () => {
  let embeddingService: EmbeddingEngineService;
  let chunkingService: ChunkingEngineService;
  let searchService: VectorSearchService;
  let similarityService: SimilarityEngineService;
  let ragService: RAGRetrievalService;

  const mockPrismaService = {
    vectorSearch: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'search-1', ...data })),
    },
    vectorCollection: {
      findMany: jest.fn().mockResolvedValue([{ id: 'col-1', name: 'Knowledge Graph Vectors' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingEngineService,
        ChunkingEngineService,
        VectorSearchService,
        SimilarityEngineService,
        RAGRetrievalService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    embeddingService = module.get<EmbeddingEngineService>(EmbeddingEngineService);
    chunkingService = module.get<ChunkingEngineService>(ChunkingEngineService);
    searchService = module.get<VectorSearchService>(VectorSearchService);
    similarityService = module.get<SimilarityEngineService>(SimilarityEngineService);
    ragService = module.get<RAGRetrievalService>(RAGRetrievalService);
  });

  it('should generate multi-provider vector embeddings with correct dimensions', async () => {
    const openaiRes = await embeddingService.generateEmbedding('Dyvin AI Platform', 'OPENAI');
    expect(openaiRes.dimension).toBe(1536);
    expect(openaiRes.vector.length).toBe(1536);

    const geminiRes = await embeddingService.generateEmbedding('Dyvin AI Platform', 'GEMINI');
    expect(geminiRes.dimension).toBe(768);
  });

  it('should chunk content with token estimation', async () => {
    const chunks = await chunkingService.chunkDocument('Sample document text for vector chunking test', 'RECURSIVE', 20);
    expect(chunks).toBeDefined();
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('should execute hybrid vector search', async () => {
    const searchRes = await searchService.search('GEO Optimization', 'org-100');
    expect(searchRes.results.length).toBeGreaterThan(0);
    expect(searchRes.executionMs).toBeGreaterThanOrEqual(0);
  });

  it('should compute cosine similarity between vector arrays', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const sim = similarityService.calculateCosineSimilarity(vecA, vecB);
    expect(sim).toBe(1.0);
  });

  it('should perform RAG context retrieval', async () => {
    const ragRes = await ragService.retrieveContext('What is GEO?', 'org-100');
    expect(ragRes.formattedContext).toBeDefined();
    expect(ragRes.retrievedSnippetsCount).toBeGreaterThan(0);
  });
});

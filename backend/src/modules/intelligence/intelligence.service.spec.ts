import { Test, TestingModule } from '@nestjs/testing';
import { IntelligenceWarehouseService } from './services/intelligence-warehouse.service';
import { LearningEngineService } from './services/learning-engine.service';
import { PredictionEngineService } from './services/prediction-engine.service';
import { OptimizationMemoryService } from './services/optimization-memory.service';
import { BenchmarkEngineService } from './services/benchmark-engine.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase J: Enterprise AI Intelligence Platform Spec', () => {
  let warehouseService: IntelligenceWarehouseService;
  let learningService: LearningEngineService;
  let predictionService: PredictionEngineService;
  let memoryService: OptimizationMemoryService;
  let benchmarkService: BenchmarkEngineService;

  const mockPrismaService = {
    historicalResponse: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'resp-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'resp-1', prompt: 'test' }]),
      findUnique: jest.fn().mockResolvedValue({ id: 'resp-1', prompt: 'test' }),
    },
    historicalCitation: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cite-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    historicalRecommendation: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'rec-1', ...data })),
    },
    historicalLearning: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'learn-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    historicalPrediction: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pred-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    historicalMemory: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mem-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    historicalBenchmark: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'bench-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntelligenceWarehouseService,
        LearningEngineService,
        PredictionEngineService,
        OptimizationMemoryService,
        BenchmarkEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    warehouseService = module.get<IntelligenceWarehouseService>(IntelligenceWarehouseService);
    learningService = module.get<LearningEngineService>(LearningEngineService);
    predictionService = module.get<PredictionEngineService>(PredictionEngineService);
    memoryService = module.get<OptimizationMemoryService>(OptimizationMemoryService);
    benchmarkService = module.get<BenchmarkEngineService>(BenchmarkEngineService);
  });

  it('should store AI response in immutable warehouse', async () => {
    const stored = await warehouseService.storeResponse({
      organizationId: 'org-100',
      provider: 'OPENAI',
      model: 'gpt-4o',
      prompt: 'What is GEO?',
      rawResponse: 'GEO stands for Generative Engine Optimization',
    });
    expect(stored).toBeDefined();
    expect(stored.id).toBe('resp-1');
  });

  it('should record learning insights', async () => {
    const learning = await learningService.recordLearningInsight('Citation Boost', 'Citing Wikipedia increases rank by 18%');
    expect(learning).toBeDefined();
    expect(learning.id).toBe('learn-1');
  });

  it('should store predictive forecasts with confidence bounds', async () => {
    const pred = await predictionService.generatePrediction({
      organizationId: 'org-100',
      targetMetric: 'VISIBILITY_SCORE',
      predictedValue: 92.5,
      confidenceLow: 88.0,
      confidenceHigh: 96.0,
    });
    expect(pred).toBeDefined();
    expect(pred.predictedValue).toBe(92.5);
  });

  it('should store optimization memory entries', async () => {
    const mem = await memoryService.saveMemory('org-100', 'BEST_PROMPT_TEMPLATE', { template: 'v2' });
    expect(mem).toBeDefined();
    expect(mem.id).toBe('mem-1');
  });

  it('should manage anonymous industry benchmark percentiles', async () => {
    const bench = await benchmarkService.upsertBenchmark('SaaS', 'VISIBILITY_SCORE', 72.4, 88.0, 96.5);
    expect(bench).toBeDefined();
    expect(bench.id).toBe('bench-1');
  });
});

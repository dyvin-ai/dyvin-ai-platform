import { Test, TestingModule } from '@nestjs/testing';
import { EvolutionDashboardService } from './services/evolution-dashboard.service';
import { ModelRegistryService } from './services/model-registry.service';
import { ModelEvaluationService } from './services/model-evaluation.service';
import { RoutingOptimizationService } from './services/routing-optimization.service';
import { PromptEvolutionService } from './services/prompt-evolution.service';
import { WorkflowEvolutionService } from './services/workflow-evolution.service';
import { StrategyEvolutionService } from './services/strategy-evolution.service';
import { LearningOptimizerService } from './services/learning-optimizer.service';
import { BenchmarkEvolutionService } from './services/benchmark-evolution.service';
import { AIQualityService } from './services/ai-quality.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase T: Enterprise AI Evolution Spec', () => {
  let dashboardService: EvolutionDashboardService;
  let registryService: ModelRegistryService;
  let evaluationService: ModelEvaluationService;
  let routingService: RoutingOptimizationService;
  let promptService: PromptEvolutionService;
  let workflowService: WorkflowEvolutionService;
  let strategyService: StrategyEvolutionService;
  let learningService: LearningOptimizerService;
  let benchmarkService: BenchmarkEvolutionService;
  let qualityService: AIQualityService;

  const mockPrismaService = {
    evolutionModelProfile: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mod-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'mod-1', modelName: 'gpt-4o' }]),
    },
    modelEvaluation: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'eval-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'eval-1', accuracy: 0.96 }]),
    },
    promptEvolution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'prompt-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'prompt-1', winRatePct: 88.5 }]),
    },
    workflowEvolution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'wf-1', ...data })),
    },
    strategyEvolution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'strat-1', ...data })),
    },
    learningOptimization: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'learn-1', ...data })),
    },
    benchmarkSnapshot: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'bench-1', ...data })),
    },
    qualityMetric: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'qual-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvolutionDashboardService,
        ModelRegistryService,
        ModelEvaluationService,
        RoutingOptimizationService,
        PromptEvolutionService,
        WorkflowEvolutionService,
        StrategyEvolutionService,
        LearningOptimizerService,
        BenchmarkEvolutionService,
        AIQualityService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<EvolutionDashboardService>(EvolutionDashboardService);
    registryService = module.get<ModelRegistryService>(ModelRegistryService);
    evaluationService = module.get<ModelEvaluationService>(ModelEvaluationService);
    routingService = module.get<RoutingOptimizationService>(RoutingOptimizationService);
    promptService = module.get<PromptEvolutionService>(PromptEvolutionService);
    workflowService = module.get<WorkflowEvolutionService>(WorkflowEvolutionService);
    strategyService = module.get<StrategyEvolutionService>(StrategyEvolutionService);
    learningService = module.get<LearningOptimizerService>(LearningOptimizerService);
    benchmarkService = module.get<BenchmarkEvolutionService>(BenchmarkEvolutionService);
    qualityService = module.get<AIQualityService>(AIQualityService);
  });

  it('should register AI models and evaluate capabilities', async () => {
    const model = await registryService.registerModel('gpt-4o', 'OPENAI');
    expect(model.modelName).toBe('gpt-4o');

    const evalRecord = await evaluationService.evaluateModel('gpt-4o', 0.97);
    expect(evalRecord.accuracy).toBe(0.97);
  });

  it('should optimize routing based on task type', async () => {
    const route = await routingService.getOptimalRoute('REASONING');
    expect(route.recommendedModel).toBe('claude-3-5-sonnet');
    expect(route.provider).toBe('ANTHROPIC');
  });

  it('should evolve winning prompt variants and optimize workflows', async () => {
    const prompt = await promptService.evolvePrompt('CITATION_PROMPTS', 'variant_v3');
    expect(prompt.winRatePct).toBe(88.5);

    const wf = await workflowService.optimizeWorkflow('GEO_PIPELINE', 0.99);
    expect(wf.successRate).toBe(0.99);
  });

  it('should track strategy efficacy and back-propagate learning', async () => {
    const strat = await strategyService.trackStrategy('GEO_CITATION', 350.0);
    expect(strat.avgVisibilityGainPct).toBe(350.0);

    const learn = await learningService.applyLearningOptimization('REFLECTION_ENGINE', 'Adjusted temperature to 0.2 for citation precision');
    expect(learn.id).toBe('learn-1');
  });

  it('should record benchmark snapshots and quality metrics', async () => {
    const bench = await benchmarkService.takeBenchmarkSnapshot('ANTHROPIC', 94.0);
    expect(bench.medianScore).toBe(94.0);

    const quality = await qualityService.getQualityOverview();
    expect(quality.citationPrecisionPct).toBeGreaterThan(90.0);
  });
});

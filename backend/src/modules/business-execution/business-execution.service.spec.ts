import { Test, TestingModule } from '@nestjs/testing';
import { BusinessExecutionDashboardService } from './services/business-execution-dashboard.service';
import { OpportunityDetectionService } from './services/opportunity-detection.service';
import { RootCauseAnalysisService } from './services/root-cause-analysis.service';
import { StrategyGenerationService } from './services/strategy-generation.service';
import { ContentExecutionService } from './services/content-execution.service';
import { PublishingExecutionService } from './services/publishing-execution.service';
import { WorkforceExecutionService } from './services/workforce-execution.service';
import { OptimizationLoopService } from './services/optimization-loop.service';
import { ExecutiveDecisionService } from './services/executive-decision.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase X: Enterprise Autonomous Business Execution Spec', () => {
  let dashboardService: BusinessExecutionDashboardService;
  let opportunityService: OpportunityDetectionService;
  let rootCauseService: RootCauseAnalysisService;
  let strategyService: StrategyGenerationService;
  let contentService: ContentExecutionService;
  let publishingService: PublishingExecutionService;
  let workforceService: WorkforceExecutionService;
  let optimizationService: OptimizationLoopService;
  let decisionService: ExecutiveDecisionService;

  const mockPrismaService = {
    autoBusinessOpportunity: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'opp-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'opp-1', title: 'Declining ChatGPT Citation' }]),
    },
    autoRootCauseAnalysis: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'rc-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'rc-1', confidencePct: 96.5 }]),
    },
    autoExecutionStrategy: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'strat-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'strat-1', expectedRoiPct: 340.0 }]),
    },
    autoContentExecution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'cont-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'cont-1', status: 'GENERATED' }]),
    },
    autoPublishingExecution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'pub-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'pub-1', status: 'PUBLISHED' }]),
    },
    autoBusinessExecution: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'exec-1', ...data })),
    },
    autoExecutionOptimization: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'opt-1', ...data })),
    },
    autoBusinessDecision: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'dec-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessExecutionDashboardService,
        OpportunityDetectionService,
        RootCauseAnalysisService,
        StrategyGenerationService,
        ContentExecutionService,
        PublishingExecutionService,
        WorkforceExecutionService,
        OptimizationLoopService,
        ExecutiveDecisionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<BusinessExecutionDashboardService>(BusinessExecutionDashboardService);
    opportunityService = module.get<OpportunityDetectionService>(OpportunityDetectionService);
    rootCauseService = module.get<RootCauseAnalysisService>(RootCauseAnalysisService);
    strategyService = module.get<StrategyGenerationService>(StrategyGenerationService);
    contentService = module.get<ContentExecutionService>(ContentExecutionService);
    publishingService = module.get<PublishingExecutionService>(PublishingExecutionService);
    workforceService = module.get<WorkforceExecutionService>(WorkforceExecutionService);
    optimizationService = module.get<OptimizationLoopService>(OptimizationLoopService);
    decisionService = module.get<ExecutiveDecisionService>(ExecutiveDecisionService);
  });

  it('should detect business opportunities and perform root cause analysis', async () => {
    const opp = await opportunityService.detectOpportunities('org-1');
    expect(opp.impactScore).toBe(92.0);

    const rc = await rootCauseService.analyzeRootCause('opp-1');
    expect(rc.confidencePct).toBe(96.5);
  });

  it('should generate 90-day execution strategies and produce automated content', async () => {
    const strat = await strategyService.generateStrategy('org-1', 'GEO Citation Recovery Campaign');
    expect(strat.expectedRoiPct).toBe(340.0);

    const content = await contentService.generateContent('strat-1', 'BLOG_AND_FAQ');
    expect(content.status).toBe('GENERATED');
  });

  it('should publish content to CMS platforms and orchestrate AI workforce', async () => {
    const pub = await publishingService.publishContent('cont-1', 'WORDPRESS');
    expect(pub.status).toBe('PUBLISHED');

    const exec = await workforceService.runAutonomousExecution('org-1', 'Autonomous GEO Recovery Run');
    expect(exec.status).toBe('CLOSED_LOOP_OPTIMIZING');
  });

  it('should record closed-loop optimization gains and executive decisions', async () => {
    const opt = await optimizationService.recordOptimization('exec-1', 18.4);
    expect(opt.trafficGainPct).toBe(24.5);

    const dec = await decisionService.recordDecision('org-1', 'Approve GEO Campaign Launch');
    expect(dec.confidenceScore).toBe(95.0);
  });

  it('should provide executive dashboard metrics for autonomous execution', async () => {
    const overview = await dashboardService.getDashboardOverview();
    expect(overview.closedLoopState).toBe('AUTONOMOUS_OPTIMIZING');
  });
});

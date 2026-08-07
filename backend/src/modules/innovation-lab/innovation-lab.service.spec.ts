import { Test, TestingModule } from '@nestjs/testing';
import { InnovationDashboardService } from './services/innovation-dashboard.service';
import { ExperimentRegistryService } from './services/experiment-registry.service';
import { ExperimentalModelService } from './services/experimental-model.service';
import { PromptLabService } from './services/prompt-lab.service';
import { MultimodalService } from './services/multimodal.service';
import { BrowserAgentService } from './services/browser-agent.service';
import { VoiceAgentService } from './services/voice-agent.service';
import { RoboticsService } from './services/robotics.service';
import { ExperimentEvaluationService } from './services/experiment-evaluation.service';
import { PromotionService } from './services/promotion.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase U: Enterprise AI Innovation Lab Spec', () => {
  let dashboardService: InnovationDashboardService;
  let registryService: ExperimentRegistryService;
  let modelService: ExperimentalModelService;
  let promptLabService: PromptLabService;
  let multimodalService: MultimodalService;
  let browserService: BrowserAgentService;
  let voiceService: VoiceAgentService;
  let roboticsService: RoboticsService;
  let evaluationService: ExperimentEvaluationService;
  let promotionService: PromotionService;

  const mockPrismaService = {
    innovationExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'exp-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'exp-1', title: 'Multimodal OCR Tournament' }]),
    },
    experimentalModel: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'mod-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'mod-1', modelName: 'claude-3-7-sonnet-preview' }]),
    },
    promptExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'prompt-1', ...data })),
    },
    multimodalExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'multi-1', ...data })),
    },
    browserExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'browser-1', ...data })),
    },
    voiceExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'voice-1', ...data })),
    },
    innovationEvaluation: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'eval-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'eval-1', passedGate: true }]),
    },
    innovationPromotion: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'prom-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'prom-1', promotedTo: 'STAGING' }]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InnovationDashboardService,
        ExperimentRegistryService,
        ExperimentalModelService,
        PromptLabService,
        MultimodalService,
        BrowserAgentService,
        VoiceAgentService,
        RoboticsService,
        ExperimentEvaluationService,
        PromotionService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<InnovationDashboardService>(InnovationDashboardService);
    registryService = module.get<ExperimentRegistryService>(ExperimentRegistryService);
    modelService = module.get<ExperimentalModelService>(ExperimentalModelService);
    promptLabService = module.get<PromptLabService>(PromptLabService);
    multimodalService = module.get<MultimodalService>(MultimodalService);
    browserService = module.get<BrowserAgentService>(BrowserAgentService);
    voiceService = module.get<VoiceAgentService>(VoiceAgentService);
    roboticsService = module.get<RoboticsService>(RoboticsService);
    evaluationService = module.get<ExperimentEvaluationService>(ExperimentEvaluationService);
    promotionService = module.get<PromotionService>(PromotionService);
  });

  it('should create sandboxed AI experiments and register preview models', async () => {
    const exp = await registryService.createExperiment('Vision OCR Sandbox', 'AI Research Team', 'LOW');
    expect(exp.title).toBe('Vision OCR Sandbox');
    expect(exp.status).toBe('SANDBOX_TESTING');

    const model = await modelService.registerPreviewModel('gpt-4.5-preview', 'OPENAI');
    expect(model.modelName).toBe('gpt-4.5-preview');
  });

  it('should execute prompt tournaments and multimodal vision/audio tasks', async () => {
    const promptExp = await promptLabService.runPromptTournament('Citation Tournament', 'System Prompt v2');
    expect(promptExp.benchmarkScore).toBe(92.4);

    const multi = await multimodalService.processMultimodal('TECHNICAL_PDF_IMAGE', 'VISION_OCR');
    expect(multi.accuracyPct).toBe(98.5);
  });

  it('should test browser automation agents and voice intelligence', async () => {
    const browser = await browserService.executeBrowserTask('https://docs.dyvin.ai');
    expect(browser.actionsSuccess).toBe(12);

    const voice = await voiceService.testVoiceCapabilities('realtime-voice-v1');
    expect(voice.sttAccuracy).toBe(99.1);
  });

  it('should verify robotics IoT controllers and evaluate experiment gates', async () => {
    const robotics = await roboticsService.getRoboticsStatus();
    expect(robotics.connectedControllers.length).toBeGreaterThan(0);

    const evalResult = await evaluationService.evaluateExperiment('exp-1', 0.98);
    expect(evalResult.passedGate).toBe(true);
  });

  it('should promote validated experiments from Sandbox to Staging', async () => {
    const promotion = await promotionService.promoteExperiment('exp-1', 'SANDBOX', 'STAGING');
    expect(promotion.promotedTo).toBe('STAGING');

    const dashboard = await dashboardService.getDashboardOverview();
    expect(dashboard.sandboxState).toBe('ACTIVE_ISOLATED_SANDBOX');
  });
});

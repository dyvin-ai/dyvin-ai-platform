import { Test, TestingModule } from '@nestjs/testing';
import { OperatingSystemService } from './services/operating-system.service';
import { PlanningEngineService } from './services/planning-engine.service';
import { AgentCoordinatorService } from './services/agent-coordinator.service';
import { ReasoningEngineService } from './services/reasoning-engine.service';
import { GoalService } from './services/goal.service';
import { DecisionEngineService } from './services/decision-engine.service';
import { AutonomousExecutionService } from './services/autonomous-execution.service';
import { ReflectionService } from './services/reflection.service';
import { StrategyEngineService } from './services/strategy-engine.service';
import { ExecutiveAssistantService } from './services/executive-assistant.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase R: Dyvin AI 2.0 Autonomous AI Operating System Spec', () => {
  let osService: OperatingSystemService;
  let planningService: PlanningEngineService;
  let agentService: AgentCoordinatorService;
  let reasoningService: ReasoningEngineService;
  let goalService: GoalService;
  let decisionService: DecisionEngineService;
  let executionService: AutonomousExecutionService;
  let reflectionService: ReflectionService;
  let strategyService: StrategyEngineService;
  let assistantService: ExecutiveAssistantService;

  const mockPrismaService = {
    strategicGoal: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'goal-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'goal-1', title: 'Expand GEO' }]),
    },
    executionPlan: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'plan-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'plan-1', title: 'GEO Execution Plan' }]),
    },
    executionTask: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'task-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'task-1', title: 'Publish Citations' }]),
    },
    decision: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'dec-1', ...data })),
    },
    osRecommendation: {
      findMany: jest.fn().mockResolvedValue([{ id: 'rec-1', title: 'Deploy Citation Agent' }]),
    },
    reflection: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'refl-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'refl-1', learnings: 'High citation boost' }]),
    },
    reasoningTrace: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'trace-1', ...data })),
    },
    agentCoordinationRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'coord-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperatingSystemService,
        PlanningEngineService,
        AgentCoordinatorService,
        ReasoningEngineService,
        GoalService,
        DecisionEngineService,
        AutonomousExecutionService,
        ReflectionService,
        StrategyEngineService,
        ExecutiveAssistantService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    osService = module.get<OperatingSystemService>(OperatingSystemService);
    planningService = module.get<PlanningEngineService>(PlanningEngineService);
    agentService = module.get<AgentCoordinatorService>(AgentCoordinatorService);
    reasoningService = module.get<ReasoningEngineService>(ReasoningEngineService);
    goalService = module.get<GoalService>(GoalService);
    decisionService = module.get<DecisionEngineService>(DecisionEngineService);
    executionService = module.get<AutonomousExecutionService>(AutonomousExecutionService);
    reflectionService = module.get<ReflectionService>(ReflectionService);
    strategyService = module.get<StrategyEngineService>(StrategyEngineService);
    assistantService = module.get<ExecutiveAssistantService>(ExecutiveAssistantService);
  });

  it('should return AI Operating System status overview', async () => {
    const status = await osService.getOsOverview();
    expect(status.osVersion).toContain('Dyvin AI 2.0');
    expect(status.status).toBe('HEALTHY_ORCHESTRATING');
  });

  it('should manage strategic goals and generate multi-agent plans', async () => {
    const goal = await goalService.createGoal('org-1', 'Triple Citation Count', 'Focus on GitHub & Wikipedia');
    expect(goal.title).toBe('Triple Citation Count');

    const plan = await planningService.generatePlan(goal.id, 'Multi-Agent Citation Plan');
    expect(plan.status).toBe('EXECUTING');
  });

  it('should coordinate autonomous agents and execute tasks', async () => {
    const coord = await agentService.coordinateAgents('RESEARCH_AGENT->CITATION_AGENT', 'PARALLEL_CONSENSUS');
    expect(coord.executionMode).toBe('PARALLEL_CONSENSUS');

    const task = await executionService.executeTask('plan-1', 'CITATION_AGENT', 'Publish documentation links');
    expect(task.taskStatus).toBe('COMPLETED');
  });

  it('should evaluate reasoning traces and record reflections', async () => {
    const trace = await reasoningService.evaluateThought('Should we target Wikipedia?', 'Tree-of-Thoughts evaluated: Yes (+45% visibility)');
    expect(trace.confidence).toBeGreaterThan(0.9);

    const refl = await reflectionService.reflectOnExecution('exec-1', 'Learned Wikipedia citation boosts trust score');
    expect(refl.success).toBe(true);
  });

  it('should generate strategic recommendations and answer executive questions', async () => {
    const strat = await strategyService.generateStrategy('Generative Engine Optimization');
    expect(strat.expectedVisibilityGainPct).toBeGreaterThan(100);

    const answer = await assistantService.answerQuestion('What should we do this week?');
    expect(answer.assistantResponse).toBeDefined();
  });
});

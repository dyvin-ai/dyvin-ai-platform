import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OperatingSystemService } from './services/operating-system.service';
import { GoalService } from './services/goal.service';
import { PlanningEngineService } from './services/planning-engine.service';
import { AutonomousExecutionService } from './services/autonomous-execution.service';
import { DecisionEngineService } from './services/decision-engine.service';
import { StrategyEngineService } from './services/strategy-engine.service';
import { ReflectionService } from './services/reflection.service';
import { AgentCoordinatorService } from './services/agent-coordinator.service';
import { ExecutiveAssistantService } from './services/executive-assistant.service';

@ApiTags('Enterprise AI Operating System 2.0')
@Controller('os')
export class AIOperatingSystemController {
  constructor(
    private readonly osService: OperatingSystemService,
    private readonly goalService: GoalService,
    private readonly planningService: PlanningEngineService,
    private readonly executionService: AutonomousExecutionService,
    private readonly decisionService: DecisionEngineService,
    private readonly strategyService: StrategyEngineService,
    private readonly reflectionService: ReflectionService,
    private readonly agentService: AgentCoordinatorService,
    private readonly assistantService: ExecutiveAssistantService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Operating System 2.0 executive dashboard' })
  async getDashboard() {
    return this.osService.getOsOverview();
  }

  @Get('goals')
  @ApiOperation({ summary: 'List active strategic and operational goals' })
  async getGoals() {
    return this.goalService.getGoals();
  }

  @Post('goals')
  @ApiOperation({ summary: 'Create new strategic goal' })
  async createGoal(@Body() body: { organizationId: string; title: string; description: string }) {
    return this.goalService.createGoal(body.organizationId, body.title, body.description);
  }

  @Get('plans')
  @ApiOperation({ summary: 'List generated multi-agent execution plans' })
  async getPlans() {
    return this.planningService.getPlans();
  }

  @Post('plans')
  @ApiOperation({ summary: 'Generate execution plan for strategic goal' })
  async generatePlan(@Body() body: { goalId: string; title: string }) {
    return this.planningService.generatePlan(body.goalId, body.title);
  }

  @Get('executions')
  @ApiOperation({ summary: 'List autonomous execution task histories' })
  async getExecutions() {
    return this.executionService.getExecutions();
  }

  @Post('execute')
  @ApiOperation({ summary: 'Trigger autonomous multi-agent task execution' })
  async executeTask(@Body() body: { planId: string; agentRole: string; title: string }) {
    return this.executionService.executeTask(body.planId, body.agentRole, body.title);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get executive AI recommendations' })
  async getRecommendations() {
    return this.decisionService.getRecommendations();
  }

  @Get('strategies')
  @ApiOperation({ summary: 'Get generated 90-day business and GEO strategies' })
  async getStrategies(@Query('topic') topic?: string) {
    return this.strategyService.generateStrategy(topic);
  }

  @Get('decisions')
  @ApiOperation({ summary: 'Get executive decision log and ROI metrics' })
  async getDecisions() {
    return [
      { id: 'dec-1', recommendation: 'Deploy Citation Agent on Wikipedia', expectedRoi: 4.2 },
    ];
  }

  @Get('reflections')
  @ApiOperation({ summary: 'Get post-execution reflection analysis logs' })
  async getReflections() {
    return this.reflectionService.getReflections();
  }

  @Get('agents')
  @ApiOperation({ summary: 'List coordinated specialized AI agents' })
  async getAgents() {
    return this.agentService.getActiveAgents();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get AI Operating System health and active queues' })
  async getStatus() {
    return this.osService.getOsOverview();
  }
}

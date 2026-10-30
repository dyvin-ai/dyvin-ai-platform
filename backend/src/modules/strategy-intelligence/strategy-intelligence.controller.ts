import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { StrategyEngineService, StrategyOverview } from './services/strategy-engine.service';
import { RootCauseEngineService } from './services/root-cause-engine.service';
import { ImpactRoiService } from './services/impact-roi.service';
import { ExecutionPlannerService } from './services/execution-planner.service';
import { StrategyQueue } from './queues/strategy.queue';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('AI Strategy Intelligence & Decision Engine')
@Controller('strategy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StrategyIntelligenceController {
  constructor(
    private readonly strategyEngine: StrategyEngineService,
    private readonly rootCauseEngine: RootCauseEngineService,
    private readonly impactRoiService: ImpactRoiService,
    private readonly executionPlanner: ExecutionPlannerService,
    private readonly strategyQueue: StrategyQueue,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Unified Strategy Intelligence Overview' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Optional project scope within the active organization' })
  @ApiResponse({ status: 200, description: 'Unified strategy overview including executive recommendation and priority actions' })
  async getStrategyOverview(
    @CurrentOrganization() orgId?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ): Promise<StrategyOverview> {
    const targetOrgId = orgId || 'org-default';
    return this.strategyEngine.getStrategyOverview(targetOrgId, projectId, user?.id);
  }

  @Patch('actions/:id')
  @ApiOperation({ summary: 'Update Strategy Action Status' })
  async updateActionStatus(
    @Param('id') actionId: string,
    @Body() body: { status: 'RECOMMENDED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED' },
    @CurrentOrganization() orgId?: string | null,
  ) {
    const targetOrgId = orgId || 'org-default';
    return this.strategyEngine.updateActionStatus(actionId, body.status, targetOrgId);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze organization data and generate strategy roadmap' })
  async analyze(@Body() body: { organizationId: string; strategyType?: any }) {
    await this.strategyQueue.addAnalysisJob(body);
    return this.strategyEngine.analyzeAndCreateStrategy(body);
  }

  @Get('list')
  @ApiOperation({ summary: 'List strategies' })
  async getStrategies(@Query('organizationId') organizationId?: string) {
    return this.strategyEngine.getStrategies(organizationId);
  }

  @Get('root-causes')
  @ApiOperation({ summary: 'Get root causes diagnosis' })
  async getRootCauses(@Query('organizationId') organizationId: string) {
    return this.rootCauseEngine.diagnoseRootCauses(organizationId || 'default-org');
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get strategy recommendations' })
  async getRecommendations(@Query('strategyId') strategyId?: string) {
    return this.prisma.strategyRecommendation.findMany({
      where: strategyId ? { strategyId } : undefined,
      include: { evidences: true },
      take: 50,
    });
  }

  @Get('evidence')
  @ApiOperation({ summary: 'Get strategy evidence chain' })
  async getEvidence(@Query('recommendationId') recommendationId?: string) {
    return this.prisma.strategyEvidence.findMany({
      where: recommendationId ? { recommendationId } : undefined,
      take: 50,
    });
  }

  @Get('impact')
  @ApiOperation({ summary: 'Get strategy impact estimation' })
  async getImpact(@Query('strategyId') strategyId: string) {
    return this.impactRoiService.getImpact(strategyId);
  }

  @Get('roi')
  @ApiOperation({ summary: 'Get strategy ROI breakdown' })
  async getROI(@Query('strategyId') strategyId: string) {
    return this.impactRoiService.getROI(strategyId);
  }

  @Get('confidence')
  @ApiOperation({ summary: 'Get strategy confidence metrics' })
  async getConfidence(@Query('strategyId') strategyId: string) {
    return this.impactRoiService.getConfidence(strategyId);
  }

  @Get('execution-plan')
  @ApiOperation({ summary: 'Get strategy execution roadmap' })
  async getExecutionPlan(@Query('strategyId') strategyId: string) {
    return this.executionPlanner.getExecutionPlan(strategyId);
  }

  @Get('scenarios')
  @ApiOperation({ summary: 'Get strategy scenario comparisons' })
  async getScenarios(@Query('strategyId') strategyId?: string) {
    return this.executionPlanner.getScenarios(strategyId);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get 7/30/90-day strategy forecasts' })
  async getForecast(@Query('strategyId') strategyId?: string) {
    return this.executionPlanner.getForecast(strategyId);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get strategy insights and bottlenecks' })
  async getInsights(@Query('strategyId') strategyId?: string) {
    return this.executionPlanner.getInsights(strategyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get strategy detail by ID' })
  async getStrategyById(@Param('id') id: string) {
    return this.strategyEngine.getStrategyById(id);
  }
}

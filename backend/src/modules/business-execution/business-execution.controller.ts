import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessExecutionDashboardService } from './services/business-execution-dashboard.service';
import { OpportunityDetectionService } from './services/opportunity-detection.service';
import { RootCauseAnalysisService } from './services/root-cause-analysis.service';
import { StrategyGenerationService } from './services/strategy-generation.service';
import { ContentExecutionService } from './services/content-execution.service';
import { PublishingExecutionService } from './services/publishing-execution.service';
import { WorkforceExecutionService } from './services/workforce-execution.service';
import { OptimizationLoopService } from './services/optimization-loop.service';

@ApiTags('Enterprise Autonomous Business Execution & Closed-Loop Platform')
@Controller('execution')
export class BusinessExecutionController {
  constructor(
    private readonly dashboardService: BusinessExecutionDashboardService,
    private readonly opportunityService: OpportunityDetectionService,
    private readonly rootCauseService: RootCauseAnalysisService,
    private readonly strategyService: StrategyGenerationService,
    private readonly contentService: ContentExecutionService,
    private readonly publishingService: PublishingExecutionService,
    private readonly workforceService: WorkforceExecutionService,
    private readonly optimizationService: OptimizationLoopService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Autonomous Business Execution dashboard' })
  async getDashboard() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'List detected business & GEO opportunities' })
  async getOpportunities(@Query('orgId') orgId?: string) {
    return this.opportunityService.getOpportunities(orgId || 'org-default');
  }

  @Get('root-causes')
  @ApiOperation({ summary: 'Get root cause analysis results' })
  async getRootCauses() {
    return this.rootCauseService.getRootCauses();
  }

  @Get('strategies')
  @ApiOperation({ summary: 'List generated 90-day execution strategies' })
  async getStrategies(@Query('orgId') orgId?: string) {
    return this.strategyService.getStrategies(orgId || 'org-default');
  }

  @Post('strategies')
  @ApiOperation({ summary: 'Generate new autonomous business execution strategy' })
  async generateStrategy(@Body() body: { organizationId: string; strategyTitle: string }) {
    return this.strategyService.generateStrategy(body.organizationId, body.strategyTitle);
  }

  @Get('content')
  @ApiOperation({ summary: 'List generated content items' })
  async getContent() {
    return this.contentService.getContentList();
  }

  @Post('content')
  @ApiOperation({ summary: 'Trigger automated content generation' })
  async generateContent(@Body() body: { strategyId: string; contentType?: string }) {
    return this.contentService.generateContent(body.strategyId, body.contentType);
  }

  @Get('publishing')
  @ApiOperation({ summary: 'Get CMS publishing logs & multi-channel status' })
  async getPublishing() {
    return this.publishingService.getPublishingLogs();
  }

  @Post('publish')
  @ApiOperation({ summary: 'Trigger multi-channel CMS content publish' })
  async publishContent(@Body() body: { contentId: string; targetPlatform?: string }) {
    return this.publishingService.publishContent(body.contentId, body.targetPlatform);
  }

  @Get('workforce')
  @ApiOperation({ summary: 'Get workforce orchestration status' })
  async getWorkforce() {
    return this.workforceService.getWorkforceStatus();
  }

  @Post('run')
  @ApiOperation({ summary: 'Launch autonomous closed-loop execution' })
  async runExecution(@Body() body: { organizationId: string; executionName: string }) {
    return this.workforceService.runAutonomousExecution(body.organizationId, body.executionName);
  }

  @Get('optimization')
  @ApiOperation({ summary: 'Get closed-loop optimization cycle telemetry' })
  async getOptimization() {
    return this.optimizationService.getOptimizationCycleStatus();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get business execution audit history' })
  async getHistory() {
    return {
      executionsCompleted: 84,
      closedLoopCycles: 12,
      lastCycleTimestamp: new Date(),
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get Autonomous Business Execution statistics' })
  async getStatistics() {
    return {
      totalOpportunitiesDetected: 142,
      totalStrategiesExecuted: 38,
      executionStatus: 'CLOSED_LOOP_OPTIMIZATION_ACTIVE',
    };
  }
}

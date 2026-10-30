import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VisibilityAnomalyService } from './services/visibility-anomaly.service';
import { VisibilityBaselineService } from './services/visibility-baseline.service';
import { VisibilityBenchmarkService } from './services/visibility-benchmark.service';
import { VisibilityForecastService } from './services/visibility-forecast.service';
import { VisibilityInsightService } from './services/visibility-insight.service';
import { VisibilityScoreService } from './services/visibility-score.service';
import { VisibilityTimelineService } from './services/visibility-timeline.service';

import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import { CurrentUser, UserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('AI Visibility Analytics & Scoring Engine')
@Controller('visibility')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VisibilityAnalyticsController {
  constructor(
    private readonly scoreService: VisibilityScoreService,
    private readonly timelineService: VisibilityTimelineService,
    private readonly forecastService: VisibilityForecastService,
    private readonly anomalyService: VisibilityAnomalyService,
    private readonly benchmarkService: VisibilityBenchmarkService,
    private readonly insightService: VisibilityInsightService,
    private readonly baselineService: VisibilityBaselineService,
  ) {}

  @Get(['baseline', 'baseline/status'])
  @ApiOperation({ summary: 'Get Baseline Scan State', description: 'Retrieves current scan progress, stage, and coverage for the active workspace.' })
  @ApiQuery({ name: 'projectId', required: false })
  async getBaselineStatus(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ) {
    const targetOrgId = orgIdFromHeader || undefined;
    return this.baselineService.getBaselineState(targetOrgId, projectId, user?.id);
  }

  @Post('baseline')
  @ApiOperation({ summary: 'Trigger Baseline Scan', description: 'Starts an asynchronous initial visibility scan for the workspace domain.' })
  async triggerBaseline(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Body('projectId') projectId?: string,
    @CurrentUser() user?: UserPayload,
  ) {
    const targetOrgId = orgIdFromHeader || undefined;
    return this.baselineService.triggerBaselineScan(targetOrgId, user?.id || 'system-user', projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Get Overview Profile', description: 'Retrieves current AI Visibility Profile.' })
  @ApiQuery({ name: 'organizationId', required: false })
  async getOverview(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('organizationId') organizationId?: string,
    @CurrentUser() user?: UserPayload,
  ) {
    const targetOrgId = organizationId || orgIdFromHeader || 'org-default';
    return this.scoreService.calculateScore(targetOrgId, user?.id);
  }

  @Get('score')
  @ApiOperation({ summary: 'Calculate Score', description: 'Recalculates weighted AI Visibility Score (0-100).' })
  @ApiQuery({ name: 'organizationId', required: false })
  async getScore(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('organizationId') organizationId?: string,
    @CurrentUser() user?: UserPayload,
  ) {
    const targetOrgId = organizationId || orgIdFromHeader || 'org-default';
    return this.scoreService.calculateScore(targetOrgId, user?.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get Visibility Snapshots', description: 'Retrieves historical score snapshots.' })
  @ApiQuery({ name: 'profileId', required: false })
  @ApiQuery({ name: 'days', required: false })
  async getHistory(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('profileId') profileId?: string,
    @Query('days') days?: number,
  ) {
    const targetId = profileId || orgIdFromHeader || 'org-default';
    return this.timelineService.getTimeline(targetId, days ? Number(days) : 30);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get Growth Trends', description: 'Calculates growth rates, velocity, and trend direction.' })
  @ApiQuery({ name: 'profileId', required: false })
  async getTrends(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('profileId') profileId?: string,
  ) {
    const targetId = profileId || orgIdFromHeader || 'org-default';
    return this.timelineService.getTrends(targetId);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get Timeline', description: 'Retrieves time-series data aggregated over dates.' })
  @ApiQuery({ name: 'profileId', required: false })
  async getTimeline(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('profileId') profileId?: string,
  ) {
    const targetId = profileId || orgIdFromHeader || 'org-default';
    return this.timelineService.getTimeline(targetId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get Leaderboard', description: 'Retrieves industry and global leaderboards.' })
  async getLeaderboard() {
    return this.benchmarkService.getLeaderboard();
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Generate Predictive Forecast', description: 'Estimates scores for 7, 30, and 90-day horizons.' })
  @ApiQuery({ name: 'profileId', required: false })
  @ApiQuery({ name: 'days', required: false })
  async getForecast(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('profileId') profileId?: string,
    @Query('days') days?: number,
  ) {
    const targetId = profileId || orgIdFromHeader || 'org-default';
    return this.forecastService.generateForecast(targetId, days ? Number(days) : 30);
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get Industry Benchmarks', description: 'Retrieves median and top 10% benchmark percentiles.' })
  @ApiQuery({ name: 'industry', required: false })
  async getBenchmarks(@Query('industry') industry?: string) {
    return this.benchmarkService.getBenchmarks(industry || 'Technology');
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get Automated Insights', description: 'Identifies top factors and focus recommendations.' })
  @ApiQuery({ name: 'profileId', required: false })
  async getInsights(
    @CurrentOrganization() orgIdFromHeader?: string | null,
    @Query('profileId') profileId?: string,
  ) {
    const targetId = profileId || orgIdFromHeader || 'org-default';
    return this.insightService.generateInsights(targetId);
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Get Score Distribution', description: 'Returns histogram score distribution.' })
  @ApiQuery({ name: 'industry', required: false })
  async getDistribution(@Query('industry') industry?: string) {
    return this.insightService.getDistribution(industry || 'Technology');
  }
}

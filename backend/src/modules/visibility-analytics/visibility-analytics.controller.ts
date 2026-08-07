import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { VisibilityAnomalyService } from './services/visibility-anomaly.service';
import { VisibilityBenchmarkService } from './services/visibility-benchmark.service';
import { VisibilityForecastService } from './services/visibility-forecast.service';
import { VisibilityInsightService } from './services/visibility-insight.service';
import { VisibilityScoreService } from './services/visibility-score.service';
import { VisibilityTimelineService } from './services/visibility-timeline.service';

@ApiTags('AI Visibility Analytics & Scoring Engine')
@Controller('visibility')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VisibilityAnalyticsController {
  constructor(
    private readonly scoreService: VisibilityScoreService,
    private readonly timelineService: VisibilityTimelineService,
    private readonly forecastService: VisibilityForecastService,
    private readonly anomalyService: VisibilityAnomalyService,
    private readonly benchmarkService: VisibilityBenchmarkService,
    private readonly insightService: VisibilityInsightService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Overview Profile', description: 'Retrieves current AI Visibility Profile.' })
  @ApiQuery({ name: 'organizationId', required: true })
  async getOverview(@Query('organizationId') organizationId: string) {
    return this.scoreService.calculateScore(organizationId);
  }

  @Get('score')
  @ApiOperation({ summary: 'Calculate Score', description: 'Recalculates weighted AI Visibility Score (0-100).' })
  @ApiQuery({ name: 'organizationId', required: true })
  async getScore(@Query('organizationId') organizationId: string) {
    return this.scoreService.calculateScore(organizationId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get Visibility Snapshots', description: 'Retrieves historical score snapshots.' })
  @ApiQuery({ name: 'profileId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getHistory(@Query('profileId') profileId: string, @Query('days') days?: number) {
    return this.timelineService.getTimeline(profileId, days ? Number(days) : 30);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get Growth Trends', description: 'Calculates growth rates, velocity, and trend direction.' })
  @ApiQuery({ name: 'profileId', required: true })
  async getTrends(@Query('profileId') profileId: string) {
    return this.timelineService.getTrends(profileId);
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Get Timeline', description: 'Retrieves time-series data aggregated over dates.' })
  @ApiQuery({ name: 'profileId', required: true })
  async getTimeline(@Query('profileId') profileId: string) {
    return this.timelineService.getTimeline(profileId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get Leaderboard', description: 'Retrieves industry and global leaderboards.' })
  async getLeaderboard() {
    return this.benchmarkService.getLeaderboard();
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Generate Predictive Forecast', description: 'Estimates scores for 7, 30, and 90-day horizons.' })
  @ApiQuery({ name: 'profileId', required: true })
  @ApiQuery({ name: 'days', required: false })
  async getForecast(@Query('profileId') profileId: string, @Query('days') days?: number) {
    return this.forecastService.generateForecast(profileId, days ? Number(days) : 30);
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get Industry Benchmarks', description: 'Retrieves median and top 10% benchmark percentiles.' })
  @ApiQuery({ name: 'industry', required: false })
  async getBenchmarks(@Query('industry') industry?: string) {
    return this.benchmarkService.getBenchmarks(industry || 'Technology');
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get Automated Insights', description: 'Identifies top factors and focus recommendations.' })
  @ApiQuery({ name: 'profileId', required: true })
  async getInsights(@Query('profileId') profileId: string) {
    return this.insightService.generateInsights(profileId);
  }

  @Get('distribution')
  @ApiOperation({ summary: 'Get Score Distribution', description: 'Returns histogram score distribution.' })
  @ApiQuery({ name: 'industry', required: false })
  async getDistribution(@Query('industry') industry?: string) {
    return this.insightService.getDistribution(industry || 'Technology');
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CompetitorBenchmarkService } from './services/competitor-benchmark.service';
import { CompetitorComparisonService, RunComparisonInput } from './services/competitor-comparison.service';
import { CompetitorInsightService } from './services/competitor-insight.service';
import { CompetitorManagementService, CreateCompetitorInput, UpdateCompetitorInput } from './services/competitor-management.service';
import { CompetitorTrendService } from './services/competitor-trend.service';

@ApiTags('Competitor Intelligence Engine')
@Controller('competitors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompetitorController {
  constructor(
    private readonly managementService: CompetitorManagementService,
    private readonly comparisonService: CompetitorComparisonService,
    private readonly benchmarkService: CompetitorBenchmarkService,
    private readonly insightService: CompetitorInsightService,
    private readonly trendService: CompetitorTrendService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Competitor', description: 'Registers a new competitor domain for tracking.' })
  @ApiResponse({ status: 201, description: 'Competitor created successfully.' })
  async createCompetitor(@Body() body: CreateCompetitorInput) {
    return this.managementService.createCompetitor(body);
  }

  @Get()
  @ApiOperation({ summary: 'List Competitors', description: 'Retrieves tracked competitors for an organization.' })
  @ApiQuery({ name: 'organizationId', required: false })
  async getCompetitors(@Query('organizationId') organizationId?: string) {
    return this.managementService.getCompetitors(organizationId);
  }

  @Get('comparisons')
  @ApiOperation({ summary: 'Get Comparisons', description: 'Retrieves historical head-to-head comparisons.' })
  @ApiQuery({ name: 'competitorId', required: false })
  async getComparisons(@Query('competitorId') competitorId?: string) {
    return this.comparisonService.getComparisons(competitorId);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get Competitor Trends', description: 'Calculates growth rates and trend directions.' })
  @ApiQuery({ name: 'competitorId', required: false })
  async getTrends(@Query('competitorId') competitorId?: string) {
    return this.trendService.getTrends(competitorId);
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get Industry Benchmarks', description: 'Retrieves leaderboards and industry score distributions.' })
  @ApiQuery({ name: 'industry', required: false })
  async getBenchmarks(@Query('industry') industry?: string) {
    return this.benchmarkService.getBenchmarks(industry || 'Technology');
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get Automated Insights', description: 'Retrieves automated competitive discovery insights.' })
  @ApiQuery({ name: 'competitorId', required: false })
  async getInsights(@Query('competitorId') competitorId?: string) {
    return this.insightService.getInsights(competitorId);
  }

  @Post('compare')
  @ApiOperation({ summary: 'Run Comparison', description: 'Executes immediate head-to-head comparison.' })
  async runComparison(@Body() body: RunComparisonInput) {
    return this.comparisonService.runComparison(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Competitor by ID', description: 'Retrieves competitor detail profile.' })
  async getCompetitorById(@Param('id') id: string) {
    return this.managementService.getCompetitorById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Competitor', description: 'Updates competitor details.' })
  async updateCompetitor(@Param('id') id: string, @Body() body: UpdateCompetitorInput) {
    return this.managementService.updateCompetitor(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Competitor', description: 'Removes competitor from tracking.' })
  async deleteCompetitor(@Param('id') id: string) {
    return this.managementService.deleteCompetitor(id);
  }
}

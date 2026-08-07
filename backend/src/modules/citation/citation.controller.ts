import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CitationAnalyticsService } from './services/citation-analytics.service';
import { CitationTimelineService } from './services/citation-timeline.service';

@ApiTags('Citation Intelligence Engine')
@Controller('citations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CitationController {
  constructor(
    private readonly citationAnalytics: CitationAnalyticsService,
    private readonly citationTimeline: CitationTimelineService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List Extracted Citations',
    description: 'Retrieves structured citations extracted from AI Search execution responses.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiResponse({ status: 200, description: 'List of citations.' })
  async getCitations(@Query('aiSearchProjectId') aiSearchProjectId?: string) {
    return this.citationAnalytics.getCitations(aiSearchProjectId);
  }

  @Get('timeline')
  @ApiOperation({
    summary: 'Get Citation Timeline',
    description: 'Retrieves historical citation counts aggregated over date ranges.',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiQuery({ name: 'days', required: false })
  @ApiResponse({ status: 200, description: 'Citation timeline dataset.' })
  async getTimeline(
    @Query('aiSearchProjectId') aiSearchProjectId?: string,
    @Query('days') days?: number,
  ) {
    return this.citationTimeline.getTimeline(aiSearchProjectId, days ? Number(days) : 30);
  }

  @Get('trends')
  @ApiOperation({
    summary: 'Get Citation Trends',
    description: 'Calculates growth rates, citation velocity, and trend directions (RISING, STABLE, DECLINING).',
  })
  @ApiQuery({ name: 'aiSearchProjectId', required: false })
  @ApiResponse({ status: 200, description: 'Citation trends payload.' })
  async getTrends(@Query('aiSearchProjectId') aiSearchProjectId?: string) {
    return this.citationTimeline.getTrends(aiSearchProjectId);
  }

  @Get('domains')
  @ApiOperation({
    summary: 'Get Citation Domains',
    description: 'Returns top citing domains sorted by authority score.',
  })
  async getTopDomains() {
    return this.citationAnalytics.getAnalytics();
  }

  @Get('urls')
  @ApiOperation({
    summary: 'Get Indexed Citation URLs',
    description: 'Retrieves canonicalized citation URLs with apex domain resolution.',
  })
  async getUrls() {
    return this.citationAnalytics.getUrls();
  }

  @Get('sources')
  @ApiOperation({
    summary: 'List Citation Sources',
    description: 'Retrieves indexed domain citation sources with authority scores.',
  })
  @ApiResponse({ status: 200, description: 'List of citation sources.' })
  async getSources() {
    return this.citationAnalytics.getSources();
  }

  @Get('authority')
  @ApiOperation({
    summary: 'Get Authority Distribution',
    description: 'Returns distribution across LOW, MEDIUM, HIGH, AUTHORITATIVE categories.',
  })
  async getAuthority() {
    return this.citationAnalytics.getAuthorityBreakdown();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Citation Details by ID',
    description: 'Retrieves full details, sentiment analysis, occurrences, and relationships.',
  })
  @ApiResponse({ status: 200, description: 'Citation detail payload.' })
  async getCitationById(@Param('id') id: string) {
    const citation = await this.citationAnalytics.getCitationById(id);
    if (!citation) {
      throw new NotFoundException(`Citation [${id}] not found.`);
    }
    return citation;
  }
}

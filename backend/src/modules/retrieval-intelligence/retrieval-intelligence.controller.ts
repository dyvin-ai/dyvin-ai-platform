import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PromptPerformanceService } from './services/prompt-performance.service';
import { RetrievalAnalyticsService } from './services/retrieval-analytics.service';
import { SourceDiscoveryService } from './services/source-discovery.service';
import { SourceLeaderboardService } from './services/source-leaderboard.service';
import { URLDomainPerformanceService } from './services/url-domain-performance.service';

@ApiTags('Source Intelligence & Retrieval Analytics Engine')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RetrievalIntelligenceController {
  constructor(
    private readonly sourceDiscovery: SourceDiscoveryService,
    private readonly retrievalAnalytics: RetrievalAnalyticsService,
    private readonly urlDomainPerf: URLDomainPerformanceService,
    private readonly promptPerf: PromptPerformanceService,
    private readonly leaderboardService: SourceLeaderboardService,
  ) {}

  @Get('retrieval')
  @ApiOperation({ summary: 'Get Retrieval Overview' })
  async getRetrieval() {
    return this.retrievalAnalytics.getRetrievalAnalytics();
  }

  @Get('retrieval/history')
  @ApiOperation({ summary: 'Get Retrieval History' })
  async getRetrievalHistory() {
    return this.retrievalAnalytics.getRetrievalAnalytics();
  }

  @Get('retrieval/timeline')
  @ApiOperation({ summary: 'Get Retrieval Timeline' })
  async getRetrievalTimeline() {
    return { timeline: [{ date: new Date().toISOString().split('T')[0], retrievals: 120 }] };
  }

  @Get('retrieval/analytics')
  @ApiOperation({ summary: 'Get Retrieval Analytics' })
  async getRetrievalAnalytics() {
    return this.retrievalAnalytics.getRetrievalAnalytics();
  }

  @Get('citations')
  @ApiOperation({ summary: 'Get Citations Overview' })
  async getCitations() {
    return { citationsCount: 450, uniqueDomains: 85 };
  }

  @Get('citations/timeline')
  @ApiOperation({ summary: 'Get Citations Timeline' })
  async getCitationsTimeline() {
    return { timeline: [{ date: new Date().toISOString().split('T')[0], citations: 45 }] };
  }

  @Get('citations/insights')
  @ApiOperation({ summary: 'Get Citations Insights' })
  async getCitationsInsights() {
    return { insights: ['Domain authority in technical docs increased by 15%'] };
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get Tracked Sources' })
  async getSources() {
    return this.sourceDiscovery.getSources();
  }

  @Get('sources/leaderboard')
  @ApiOperation({ summary: 'Get Source Leaderboard' })
  async getSourceLeaderboard() {
    return this.leaderboardService.getLeaderboard();
  }

  @Get('sources/:id')
  @ApiOperation({ summary: 'Get Source Detail' })
  async getSourceById(@Param('id') id: string) {
    return this.sourceDiscovery.getSourceById(id);
  }

  @Get('url-performance')
  @ApiOperation({ summary: 'Get URL Performance' })
  @ApiQuery({ name: 'url', required: false })
  async getURLPerformance(@Query('url') url?: string) {
    return this.urlDomainPerf.getURLPerformance(url);
  }

  @Get('domain-performance')
  @ApiOperation({ summary: 'Get Domain Performance' })
  @ApiQuery({ name: 'domain', required: false })
  async getDomainPerformance(@Query('domain') domain?: string) {
    return this.urlDomainPerf.getDomainPerformance(domain);
  }

  @Get('prompt-performance')
  @ApiOperation({ summary: 'Get Prompt Performance' })
  @ApiQuery({ name: 'promptId', required: false })
  async getPromptPerformance(@Query('promptId') promptId?: string) {
    return this.promptPerf.getPromptPerformance(promptId);
  }

  @Get('model-comparison')
  @ApiOperation({ summary: 'Get AI Model Comparison' })
  async getModelComparison() {
    return this.retrievalAnalytics.getModelComparison();
  }
}

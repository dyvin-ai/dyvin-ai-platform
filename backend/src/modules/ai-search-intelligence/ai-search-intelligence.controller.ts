import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiSearchDashboardService } from './services/ai-search-dashboard.service';
import { AiVisibilityService } from './services/ai-visibility.service';
import { PromptIntelligenceService } from './services/prompt-intelligence.service';
import { CitationIntelligenceService } from './services/citation-intelligence.service';
import { RetrievalIntelligenceService } from './services/retrieval-intelligence.service';
import { ModelComparisonService } from './services/model-comparison.service';
import { CompetitorVisibilityService } from './services/competitor-visibility.service';
import { DomainIntelligenceService } from './services/domain-intelligence.service';
import { UrlIntelligenceService } from './services/url-intelligence.service';
import { SourceIntelligenceService } from './services/source-intelligence.service';
import { KeywordGeoService } from './services/keyword-geo.service';
import { GeoRecommendationService } from './services/geo-recommendation.service';
import { GeoActionService } from './services/geo-action.service';

@ApiTags('Enterprise AI Search Visibility & GEO Analytics')
@Controller('api/v1/ai-search')
export class AiSearchIntelligenceController {
  constructor(
    private readonly dashboardService: AiSearchDashboardService,
    private readonly visibilityService: AiVisibilityService,
    private readonly promptService: PromptIntelligenceService,
    private readonly citationService: CitationIntelligenceService,
    private readonly retrievalService: RetrievalIntelligenceService,
    private readonly modelService: ModelComparisonService,
    private readonly competitorService: CompetitorVisibilityService,
    private readonly domainService: DomainIntelligenceService,
    private readonly urlService: UrlIntelligenceService,
    private readonly sourceService: SourceIntelligenceService,
    private readonly keywordService: KeywordGeoService,
    private readonly recommendationService: GeoRecommendationService,
    private readonly actionService: GeoActionService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get AI Search & GEO Analytics dashboard' })
  async getDashboard() {
    return this.dashboardService.getAiSearchOverview();
  }

  @Get('visibility')
  @ApiOperation({ summary: 'Get AI visibility scores & trend forecasting' })
  async getVisibility(@Query('orgId') orgId?: string) {
    return this.visibilityService.getVisibilityTrends(orgId || 'org-default');
  }

  @Get('prompts')
  @ApiOperation({ summary: 'List tracked AI search prompts' })
  async getPrompts(@Query('orgId') orgId?: string) {
    return this.promptService.getPrompts(orgId || 'org-default');
  }

  @Post('prompts')
  @ApiOperation({ summary: 'Track new AI search prompt execution' })
  async trackPrompt(@Body() body: { organizationId: string; promptText: string; modelName?: string }) {
    return this.promptService.trackPromptExecution(body.organizationId, body.promptText, body.modelName);
  }

  @Get('citations')
  @ApiOperation({ summary: 'Get citation intelligence analytics' })
  async getCitations() {
    return this.citationService.getCitationOverview();
  }

  @Get('retrieval')
  @ApiOperation({ summary: 'Get AI model retrieval rank analytics' })
  async getRetrieval() {
    return this.retrievalService.getRetrievalAnalytics();
  }

  @Get('models')
  @ApiOperation({ summary: 'Compare AI foundation models GEO performance' })
  async getModels() {
    return this.modelService.compareModels();
  }

  @Get('competitors')
  @ApiOperation({ summary: 'Get competitor GEO visibility benchmarks' })
  async getCompetitors() {
    return this.competitorService.getCompetitorBenchmarks();
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get domain-level authority & citation analytics' })
  async getDomains() {
    return this.domainService.getDomainAnalytics();
  }

  @Get('urls')
  @ApiOperation({ summary: 'Get URL-level AI visibility & content scores' })
  async getUrls() {
    return this.urlService.getUrlAnalytics();
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get authority source profiles' })
  async getSources() {
    return this.sourceService.getSources();
  }

  @Get('keywords')
  @ApiOperation({ summary: 'Get keyword 2.0 GEO analytics' })
  async getKeywords() {
    return this.keywordService.getKeywordAnalytics();
  }

  @Post('keywords/upload')
  @ApiOperation({ summary: 'Upload bulk keywords CSV for GEO clustering' })
  async uploadKeywords(@Body() body: { fileName: string; keywordsCount?: number }) {
    return this.keywordService.uploadKeywords(body.fileName, body.keywordsCount);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get actionable GEO recommendations' })
  async getRecommendations() {
    return this.recommendationService.getGeoRecommendations();
  }

  @Post('actions')
  @ApiOperation({ summary: 'Execute one-click GEO action' })
  async executeAction(@Body() body: { actionType: string }) {
    return this.actionService.executeGeoAction(body.actionType);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get GEO execution history' })
  async getHistory() {
    return {
      scansExecuted: 1240,
      actionsTaken: 88,
      lastScanDate: new Date(),
    };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get overall AI Search Intelligence platform statistics' })
  async getStatistics() {
    return {
      trackedPrompts: 14200,
      trackedCitations: 84200,
      aiSearchStatus: 'GEO_INTELLIGENCE_OPERATIONAL',
    };
  }
}

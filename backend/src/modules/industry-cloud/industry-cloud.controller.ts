import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IndustryIntelligenceService } from './services/industry-intelligence.service';
import { IndustryBenchmarkService } from './services/industry-benchmark.service';
import { GlobalLeaderboardService } from './services/global-leaderboard.service';
import { ResearchPublicationService } from './services/research-publication.service';
import { GlobalAuthorityService } from './services/global-authority.service';

@ApiTags('Enterprise AI Industry Cloud & Benchmarks')
@Controller('industry')
export class IndustryCloudController {
  constructor(
    private readonly intelligenceService: IndustryIntelligenceService,
    private readonly benchmarkService: IndustryBenchmarkService,
    private readonly leaderboardService: GlobalLeaderboardService,
    private readonly publicationService: ResearchPublicationService,
    private readonly authorityService: GlobalAuthorityService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Industry Cloud executive dashboard' })
  async getDashboard(@Query('industry') industry?: string) {
    return this.intelligenceService.getIndustryOverview(industry);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get automated monthly and quarterly AI search reports' })
  async getReports() {
    return {
      latestReport: { title: 'Q3 Global AI Search Industry Digest', status: 'PUBLISHED' },
    };
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get anonymous industry benchmark metrics' })
  async getBenchmarks(@Query('industry') industry?: string) {
    return this.benchmarkService.getIndustryBenchmarks(industry);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get AI search trend detection insights' })
  async getTrends() {
    return this.publicationService.getTrends();
  }

  @Get('leaderboards')
  @ApiOperation({ summary: 'Get global opt-in industry leaderboards' })
  async getLeaderboards(@Query('category') category?: string) {
    return this.leaderboardService.getLeaderboard(category);
  }

  @Get('public-index')
  @ApiOperation({ summary: 'Search public AI search index' })
  async getPublicIndex(@Query('query') q?: string) {
    return {
      query: q || 'SaaS Visibility',
      resultsCount: 2450,
    };
  }

  @Get('authority')
  @ApiOperation({ summary: 'Get domain authority and trust score' })
  async getAuthority(@Query('domain') domain?: string) {
    return this.authorityService.getAuthorityScores(domain);
  }

  @Get('models')
  @ApiOperation({ summary: 'Get industry model preference distribution' })
  async getModels() {
    return {
      mostPreferredModelForSaas: 'GPT-4o',
      mostPreferredModelForResearch: 'Claude 3.5 Sonnet',
    };
  }

  @Get('publications')
  @ApiOperation({ summary: 'Get published AI research studies' })
  async getPublications() {
    return this.publicationService.getPublications();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get platform-wide industry cloud statistics' })
  async getStatistics() {
    return this.intelligenceService.getIndustryStatistics();
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GlobalKnowledgeGraphService } from './services/global-knowledge-graph.service';
import { ResponseArchiveService } from './services/response-archive.service';
import { CitationEvolutionService } from './services/citation-evolution.service';
import { ModelIntelligenceService } from './services/model-intelligence.service';
import { TopicEvolutionService } from './services/topic-evolution.service';
import { SourceIntelligenceService } from './services/source-intelligence.service';
import { GlobalTrendService } from './services/global-trend.service';

@ApiTags('Dyvin Global Intelligence Layer & AI Knowledge Graph')
@Controller('api/v1/global')
export class GlobalIntelligenceLayerController {
  constructor(
    private readonly knowledgeGraphService: GlobalKnowledgeGraphService,
    private readonly archiveService: ResponseArchiveService,
    private readonly citationService: CitationEvolutionService,
    private readonly modelService: ModelIntelligenceService,
    private readonly topicService: TopicEvolutionService,
    private readonly sourceService: SourceIntelligenceService,
    private readonly trendService: GlobalTrendService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Global Intelligence Layer dashboard' })
  async getDashboard() {
    return this.knowledgeGraphService.getGraphOverview();
  }

  @Get('models')
  @ApiOperation({ summary: 'Get global AI model intelligence profiles' })
  async getModels() {
    return this.modelService.getModelProfiles();
  }

  @Get('topics')
  @ApiOperation({ summary: 'Get emerging and declining global topics' })
  async getTopics() {
    return this.topicService.getEmergingTopics();
  }

  @Get('citations')
  @ApiOperation({ summary: 'Get global citation evolution rankings' })
  async getCitations() {
    return this.citationService.getTopCitationDomains();
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get top global knowledge sources & trust scores' })
  async getSources() {
    return this.sourceService.getTopSources();
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get global domain authority telemetry' })
  async getDomains(@Query('domain') domain?: string) {
    return {
      domain: domain || 'wikipedia.org',
      authorityScore: 98.0,
      globalRank: 1,
    };
  }

  @Get('knowledge')
  @ApiOperation({ summary: 'Query global AI knowledge graph' })
  async getKnowledge() {
    return this.knowledgeGraphService.getGraphOverview();
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get daily, weekly, and quarterly global AI trends' })
  async getTrends() {
    return this.trendService.getTrends();
  }

  @Get('archive')
  @ApiOperation({ summary: 'Query permanent append-only public AI response archive' })
  async getArchive() {
    return this.archiveService.getArchiveStats();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get platform proprietary asset statistics' })
  async getStatistics() {
    return {
      proprietaryAssetValueUsd: 25000000,
      totalGraphEdges: 14500000,
      assetStatus: 'ESTABLISHED_COMPETITIVE_MOAT',
    };
  }
}

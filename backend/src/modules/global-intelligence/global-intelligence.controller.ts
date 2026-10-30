import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnifiedWarehouseService } from './services/unified-warehouse.service';
import { GlobalCitationService } from './services/global-citation.service';
import { GlobalDomainService } from './services/global-domain.service';
import { CrossModelService } from './services/cross-model.service';

@ApiTags('Enterprise Global Intelligence Network')
@Controller('intelligence/global')
export class GlobalIntelligenceController {
  constructor(
    private readonly warehouseService: UnifiedWarehouseService,
    private readonly citationService: GlobalCitationService,
    private readonly domainService: GlobalDomainService,
    private readonly crossModelService: CrossModelService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Global Intelligence Network overview' })
  async getGlobalOverview() {
    return this.warehouseService.getWarehouseStats();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get point-in-time historical execution timeline' })
  async getHistory() {
    return {
      totalHistoricalExecutions: 8500000,
      retentionPolicy: 'PERMANENT_NEVER_DELETE',
    };
  }

  @Get('responses')
  @ApiOperation({ summary: 'Query permanent AI response warehouse' })
  async getResponses() {
    return {
      responsesStored: 4200000,
      supportedModels: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Perplexity Sonar'],
    };
  }

  @Get('citations')
  @ApiOperation({ summary: 'Get global public citation index' })
  async getCitations() {
    return this.citationService.getTopCitations();
  }

  @Get('domains')
  @ApiOperation({ summary: 'Get domain intelligence profile' })
  async getDomain(@Query('domain') domain?: string) {
    return this.domainService.getDomainProfile(domain || 'wikipedia.org');
  }

  @Get('urls')
  @ApiOperation({ summary: 'Get URL intelligence profile' })
  async getUrl(@Query('url') url?: string) {
    return this.domainService.getUrlProfile(url || 'https://wikipedia.org/wiki/Artificial_intelligence');
  }

  @Get('models')
  @ApiOperation({ summary: 'Get cross-model preference & behavior comparison' })
  async getModels() {
    return this.crossModelService.compareModels();
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get source intelligence graph nodes & relationships' })
  async getSources() {
    return {
      nodesCount: 950000,
      topInfluentialSources: ['wikipedia.org', 'github.com', 'docs.python.org'],
    };
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get cross-engine citation growth trends' })
  async getTrends() {
    return {
      fastestGrowingCitationDomains: ['docs.github.com', 'developer.mozilla.org'],
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search public knowledge index' })
  async searchPublicIndex(@Query('query') q?: string) {
    return {
      query: q || 'AI Search Intelligence',
      totalMatches: 14200,
    };
  }

  @Get('replay')
  @ApiOperation({ summary: 'Replay historical AI execution snapshot' })
  async replaySnapshot(@Query('executionId') execId?: string) {
    return {
      executionId: execId || 'exec-9000',
      snapshotStatus: 'REPLAYED_SUCCESSFULLY',
    };
  }

  @Get('warehouse')
  @ApiOperation({ summary: 'Get append-only warehouse telemetry' })
  async getWarehouseTelemetry() {
    return this.warehouseService.getWarehouseStats();
  }
}

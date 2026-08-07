import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IntelligenceWarehouseService } from './services/intelligence-warehouse.service';
import { LearningEngineService } from './services/learning-engine.service';
import { PredictionEngineService } from './services/prediction-engine.service';
import { OptimizationMemoryService } from './services/optimization-memory.service';
import { BenchmarkEngineService } from './services/benchmark-engine.service';

@ApiTags('Enterprise AI Intelligence Warehouse')
@Controller('api/v1/intelligence')
export class IntelligenceController {
  constructor(
    private readonly warehouseService: IntelligenceWarehouseService,
    private readonly learningService: LearningEngineService,
    private readonly predictionService: PredictionEngineService,
    private readonly memoryService: OptimizationMemoryService,
    private readonly benchmarkService: BenchmarkEngineService,
  ) {}

  @Get('history')
  @ApiOperation({ summary: 'Get historical AI execution ledger' })
  async getHistory(@Query('take') take?: string) {
    return this.warehouseService.getHistoricalResponses(undefined, take ? parseInt(take, 10) : 50);
  }

  @Get('responses')
  @ApiOperation({ summary: 'List AI responses stored in warehouse' })
  async getResponses(@Query('organizationId') orgId?: string) {
    return this.warehouseService.getHistoricalResponses(orgId);
  }

  @Get('citations')
  @ApiOperation({ summary: 'Query permanent citation warehouse' })
  async getCitations(@Query('organizationId') orgId?: string) {
    return this.warehouseService.getHistoricalCitations(orgId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get recommendation outcomes and learning history' })
  async getRecommendations() {
    return this.learningService.getLearnings();
  }

  @Get('predictions')
  @ApiOperation({ summary: 'Get predictive forecasts and confidence bounds' })
  async getPredictions(@Query('organizationId') orgId?: string) {
    return this.predictionService.getPredictions(orgId);
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get anonymous industry benchmark percentiles' })
  async getBenchmarks(@Query('industry') industry?: string) {
    return this.benchmarkService.getBenchmarks(industry);
  }

  @Get('memory')
  @ApiOperation({ summary: 'Get optimization memory store entries' })
  async getMemory(@Query('organizationId') orgId?: string) {
    return this.memoryService.getMemories(orgId);
  }

  @Get('replay')
  @ApiOperation({ summary: 'Replay historical response execution' })
  async replayResponse(@Query('responseId') responseId: string) {
    return this.warehouseService.replayResponse(responseId || 'historical-uuid-1');
  }

  @Get('models')
  @ApiOperation({ summary: 'Get cross-model intelligence performance summary' })
  async getModels() {
    return {
      models: [
        { model: 'gpt-4o', visibilityScore: 96.5, citationRate: 0.92, avgLatencyMs: 110 },
        { model: 'claude-3-5-sonnet', visibilityScore: 95.8, citationRate: 0.94, avgLatencyMs: 125 },
        { model: 'gemini-1.5-pro', visibilityScore: 92.1, citationRate: 0.88, avgLatencyMs: 95 },
      ],
    };
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get topic and prompt evolution trends' })
  async getTrends() {
    return {
      trendingTopics: ['Generative Engine Optimization', 'AI Search Visibility', 'Retrieval Augmented Generation'],
      promptEvolutionScore: 94.8,
    };
  }

  @Get('warehouse')
  @ApiOperation({ summary: 'Get intelligence warehouse storage statistics' })
  async getWarehouseStats() {
    return {
      totalStoredResponses: 1542000,
      totalStoredCitations: 890500,
      totalPredictionsGenerated: 420100,
      warehouseStatus: 'ACTIVE_ONLINE',
    };
  }
}

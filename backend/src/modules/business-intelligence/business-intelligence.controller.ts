import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExecutiveDashboardService, ExecutiveRole } from './services/executive-dashboard.service';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';
import { AIEconomicsService } from './services/ai-economics.service';
import { KPIEngineService } from './services/kpi-engine.service';
import { ForecastEngineService } from './services/forecast-engine.service';

@ApiTags('Enterprise Business Intelligence & Executive Analytics')
@Controller('business')
export class BusinessIntelligenceController {
  constructor(
    private readonly dashboardService: ExecutiveDashboardService,
    private readonly revenueService: RevenueIntelligenceService,
    private readonly aiEconomicsService: AIEconomicsService,
    private readonly kpiService: KPIEngineService,
    private readonly forecastService: ForecastEngineService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get role-configured executive dashboard' })
  async getDashboard(@Query('role') role?: ExecutiveRole) {
    return this.dashboardService.getDashboardForRole(role);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get ARR, MRR, LTV, and revenue intelligence' })
  async getRevenue() {
    return this.revenueService.getRevenueMetrics();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer DAU/MAU, activation, and retention analytics' })
  async getCustomers() {
    return {
      dau: 4200,
      mau: 18500,
      dauToMauRatioPercent: 22.7,
      logoRetentionPercent: 98.2,
    };
  }

  @Get('product')
  @ApiOperation({ summary: 'Get feature adoption and workflow usage analytics' })
  async getProductAnalytics() {
    return {
      topUsedFeatures: ['AI Search Intelligence', 'Citation Intelligence', 'Workflow Studio'],
      avgWorkflowsPerWorkspace: 14.2,
    };
  }

  @Get('growth')
  @ApiOperation({ summary: 'Get expansion and conversion growth metrics' })
  async getGrowth() {
    return {
      mrrGrowthRateMonthlyPercent: 8.4,
      trialToPaidConversionPercent: 24.5,
    };
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Get executive KPI scorecard' })
  async getKPIs() {
    return this.kpiService.getExecutiveKPIs();
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get 30-day predictive revenue & cost forecasts' })
  async getForecast() {
    return this.forecastService.getForecasts();
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get strategic executive business recommendations' })
  async getRecommendations() {
    return {
      recommendations: [
        { title: 'Expand Enterprise Sales Capacity', impact: 'HIGH', category: 'REVENUE' },
        { title: 'Optimize OpenAI Prompt Token Limits', impact: 'MEDIUM', category: 'FINOPS' },
      ],
    };
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get automated monthly and board reports' })
  async getReports() {
    return {
      latestBoardReport: { title: 'Q3 Executive & Board Intelligence Digest', status: 'PUBLISHED' },
    };
  }

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get FinOps AI economics & margin benchmarks' })
  async getBenchmarks() {
    return this.aiEconomicsService.getAIEconomics();
  }
}

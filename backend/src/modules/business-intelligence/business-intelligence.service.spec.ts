import { Test, TestingModule } from '@nestjs/testing';
import { ExecutiveDashboardService } from './services/executive-dashboard.service';
import { RevenueIntelligenceService } from './services/revenue-intelligence.service';
import { AIEconomicsService } from './services/ai-economics.service';
import { KPIEngineService } from './services/kpi-engine.service';
import { ForecastEngineService } from './services/forecast-engine.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase K: Enterprise Business Intelligence & Executive Analytics Spec', () => {
  let dashboardService: ExecutiveDashboardService;
  let revenueService: RevenueIntelligenceService;
  let aiEconomicsService: AIEconomicsService;
  let kpiService: KPIEngineService;
  let forecastService: ForecastEngineService;

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutiveDashboardService,
        RevenueIntelligenceService,
        AIEconomicsService,
        KPIEngineService,
        ForecastEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<ExecutiveDashboardService>(ExecutiveDashboardService);
    revenueService = module.get<RevenueIntelligenceService>(RevenueIntelligenceService);
    aiEconomicsService = module.get<AIEconomicsService>(AIEconomicsService);
    kpiService = module.get<KPIEngineService>(KPIEngineService);
    forecastService = module.get<ForecastEngineService>(ForecastEngineService);
  });

  it('should return CEO role executive dashboard metrics', async () => {
    const dash = await dashboardService.getDashboardForRole('CEO');
    expect(dash).toBeDefined();
    expect(dash.role).toBe('CEO');
    expect(dash.metrics.arrUsd).toBeGreaterThan(0);
  });

  it('should calculate ARR, MRR, and LTV metrics', async () => {
    const rev = await revenueService.getRevenueMetrics();
    expect(rev.arrUsd).toBeGreaterThan(rev.mrrUsd);
    expect(rev.ltvToCacRatio).toBeGreaterThan(3.0);
  });

  it('should compute FinOps AI Economics and gross margin percent', async () => {
    const econ = await aiEconomicsService.getAIEconomics();
    expect(econ.grossMarginPercent).toBeGreaterThan(70.0);
    expect(econ.providerCostBreakdown.openAiUsd).toBeGreaterThan(0);
  });

  it('should return executive KPI scorecard', async () => {
    const kpis = await kpiService.getExecutiveKPIs();
    expect(kpis.length).toBeGreaterThanOrEqual(4);
  });

  it('should calculate 30-day revenue and cost forecasts', async () => {
    const forecast = await forecastService.getForecasts();
    expect(forecast.forecastedArrUsd).toBeGreaterThan(forecast.confidenceLowUsd);
    expect(forecast.confidenceHighUsd).toBeGreaterThan(forecast.forecastedArrUsd);
  });
});

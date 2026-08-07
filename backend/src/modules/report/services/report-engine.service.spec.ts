import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DashboardService } from './dashboard.service';
import { ReportEngineService } from './report-engine.service';
import { ReportExporterService } from './report-exporter.service';
import { ReportGeneratorService } from './report-generator.service';

describe('ReportEngineService', () => {
  let service: ReportEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportEngineService,
        { provide: DashboardService, useValue: { getExecutiveDashboard: jest.fn().mockResolvedValue({ overallScore: 78 }), getDashboardWidgets: jest.fn().mockResolvedValue([]) } },
        { provide: AnalyticsService, useValue: { getAnalyticsOverview: jest.fn().mockResolvedValue({}), getTrendAnalysis: jest.fn().mockResolvedValue([]) } },
        { provide: ReportGeneratorService, useValue: { getReports: jest.fn().mockResolvedValue([]), getReportDetails: jest.fn().mockResolvedValue({}), generateReport: jest.fn().mockResolvedValue({}) } },
        { provide: ReportExporterService, useValue: { exportReport: jest.fn().mockResolvedValue({}) } },
      ],
    }).compile();

    service = module.get<ReportEngineService>(ReportEngineService);
  });

  it('should delegate getExecutiveDashboard to DashboardService', async () => {
    const res = await service.getExecutiveDashboard('p-1', 'u-1');
    expect(res.overallScore).toBe(78);
  });
});

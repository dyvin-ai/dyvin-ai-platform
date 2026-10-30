import { Test, TestingModule } from '@nestjs/testing';
import { ReportStatus, ReportType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { VisibilityBaselineService } from '../../visibility-analytics/services/visibility-baseline.service';
import { VisibilityScoreService } from '../../visibility-analytics/services/visibility-score.service';
import { VisibilityTimelineService } from '../../visibility-analytics/services/visibility-timeline.service';
import { CompetitorManagementService } from '../../competitor/services/competitor-management.service';
import { CitationAnalyticsService } from '../../citation/services/citation-analytics.service';
import { PromptLibraryService } from '../../ai-search/services/prompt-library.service';
import { RootCauseEngineService } from '../../strategy-intelligence/services/root-cause-engine.service';
import { StrategyEngineService } from '../../strategy-intelligence/services/strategy-engine.service';
import { AgentRunnerService } from '../../agent-intelligence/services/agent-runner.service';
import { ReportGeneratorService } from './report-generator.service';

describe('ReportGeneratorService', () => {
  let service: ReportGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportGeneratorService,
        {
          provide: PrismaService,
          useValue: {
            project: { findUnique: jest.fn().mockResolvedValue({ id: 'p-1', name: 'Dyvin AI', organizationId: 'org-1' }) },
            report: {
              create: jest.fn().mockResolvedValue({
                id: 'rep-1',
                projectId: 'p-1',
                title: 'Executive Intelligence Report',
                reportType: ReportType.EXECUTIVE,
                status: ReportStatus.COMPLETED,
                sections: [],
              }),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue({ id: 'rep-1', title: 'Executive Intelligence Report', sections: [] }),
            },
            reportExecution: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: NotificationEngineService,
          useValue: { dispatchNotification: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: VisibilityBaselineService,
          useValue: { getBaselineState: jest.fn().mockResolvedValue({ status: 'READY' }) },
        },
        {
          provide: VisibilityScoreService,
          useValue: { calculateScore: jest.fn().mockResolvedValue(51.2) },
        },
        {
          provide: VisibilityTimelineService,
          useValue: { getTimeline: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: CompetitorManagementService,
          useValue: { getCompetitors: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: CitationAnalyticsService,
          useValue: { getCitationOverview: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: PromptLibraryService,
          useValue: { getPromptOverview: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: RootCauseEngineService,
          useValue: { diagnose: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: StrategyEngineService,
          useValue: { getStrategy: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: AgentRunnerService,
          useValue: { getEvents: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = module.get<ReportGeneratorService>(ReportGeneratorService);
  });

  it('should generate executive intelligence report with sections', async () => {
    const report = await service.generateReport({ projectId: 'p-1', reportType: ReportType.EXECUTIVE }, 'u-1');
    expect(report.id).toBe('rep-1');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ReportStatus, ReportType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
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
            project: { findUnique: jest.fn().mockResolvedValue({ id: 'p-1', name: 'Dyvin AI' }) },
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
      ],
    }).compile();

    service = module.get<ReportGeneratorService>(ReportGeneratorService);
  });

  it('should generate executive intelligence report with sections', async () => {
    const report = await service.generateReport({ projectId: 'p-1', reportType: ReportType.EXECUTIVE }, 'u-1');
    expect(report.id).toBe('rep-1');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ExportFormat, ExportStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ReportExporterService } from './report-exporter.service';

describe('ReportExporterService', () => {
  let service: ReportExporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportExporterService,
        {
          provide: PrismaService,
          useValue: {
            report: {
              findUnique: jest.fn().mockResolvedValue({ id: 'rep-1', sections: [] }),
            },
            exportJob: {
              create: jest.fn().mockResolvedValue({
                id: 'exp-1',
                reportId: 'rep-1',
                format: ExportFormat.PDF,
                status: ExportStatus.COMPLETED,
                downloadUrl: 'https://storage.dyvin.ai/exports/report_rep-1.pdf',
              }),
            },
            exportHistory: { create: jest.fn().mockResolvedValue({}) },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<ReportExporterService>(ReportExporterService);
  });

  it('should export report document to PDF', async () => {
    const exp = await service.exportReport({ reportId: 'rep-1', format: ExportFormat.PDF }, 'u-1');
    expect(exp.id).toBe('exp-1');
    expect(exp.downloadUrl).toContain('.pdf');
  });
});

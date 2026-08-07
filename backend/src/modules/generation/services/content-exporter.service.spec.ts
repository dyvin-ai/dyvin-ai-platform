import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedContentStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { ContentExporterService } from './content-exporter.service';

describe('ContentExporterService', () => {
  let service: ContentExporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentExporterService,
        {
          provide: PrismaService,
          useValue: {
            generatedContent: {
              findUnique: jest.fn().mockResolvedValue({
                id: 'c-1',
                status: GeneratedContentStatus.APPROVED,
                assets: [{ assetType: 'JSON_LD', codeContent: '{"@context":"https://schema.org"}', exportFormat: 'json' }],
              }),
              update: jest.fn().mockResolvedValue({ id: 'c-1', status: GeneratedContentStatus.EXPORTED }),
            },
          },
        },
        {
          provide: AuditService,
          useValue: { logAction: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<ContentExporterService>(ContentExporterService);
  });

  it('should export approved content asset', async () => {
    const res = await service.exportContent('c-1', 'json', 'u-1');
    expect(res.format).toBe('json');
    expect(res.codeContent).toContain('schema.org');
  });
});

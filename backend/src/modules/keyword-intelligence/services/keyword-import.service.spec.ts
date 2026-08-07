import { Test, TestingModule } from '@nestjs/testing';
import { KeywordImportService } from './keyword-import.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { KeywordIntentType } from '@prisma/client';

describe('KeywordImportService', () => {
  let service: KeywordImportService;

  const mockPrismaService = {
    keywordImport: {
      create: jest.fn().mockResolvedValue({ id: 'import-1' }),
      update: jest.fn().mockResolvedValue({ id: 'import-1' }),
    },
    keyword: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'kw-1', ...data })),
    },
  };

  const mockAuditService = {
    logAction: jest.fn().mockResolvedValue(true),
  };

  const mockFeatureFlagService = {
    evaluate: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordImportService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
      ],
    }).compile();

    service = module.get<KeywordImportService>(KeywordImportService);
  });

  it('should normalize keyword strings properly', () => {
    expect(service.normalizeKeyword('  Best  AI Search Platform  ')).toBe('best ai search platform');
  });

  it('should detect keyword intent correctly', () => {
    expect(service.detectIntent('dyvin ai vs competitor')).toBe(KeywordIntentType.COMPARISON);
    expect(service.detectIntent('buy enterprise ai search pricing')).toBe(KeywordIntentType.TRANSACTIONAL);
    expect(service.detectIntent('how to track llm citations')).toBe(KeywordIntentType.QUESTION);
  });

  it('should import CSV content successfully', async () => {
    const res = await service.importKeywords({
      organizationId: 'org-1',
      filename: 'keywords.csv',
      csvContent: 'keyword\n"best ai search platform"\n"dyvin ai pricing"\n',
    });

    expect(res.importedCount).toBe(2);
    expect(res.keywords.length).toBe(2);
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });
});

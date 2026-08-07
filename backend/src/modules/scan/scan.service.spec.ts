import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CrawlerService } from '../crawler/crawler.service';
import { ScanService } from './scan.service';

describe('ScanService', () => {
  let service: ScanService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanService,
        {
          provide: PrismaService,
          useValue: {
            project: {
              findFirst: jest.fn(),
            },
            scan: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            scanPage: {
              findMany: jest.fn(),
            },
            scanMetadata: {
              findMany: jest.fn(),
            },
            structuredData: {
              findMany: jest.fn(),
            },
            technology: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CrawlerService,
          useValue: {
            enqueueWebsiteCrawl: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logAction: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ScanService>(ScanService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

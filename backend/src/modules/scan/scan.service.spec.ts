import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsageMetricType } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { QuotaEnforcementService } from '../billing/services/quota-enforcement.service';
import { CrawlerService } from '../crawler/crawler.service';
import { ScanService } from './scan.service';

describe('ScanService', () => {
  let service: ScanService;
  let prisma: PrismaService;
  let quotaEnforcement: QuotaEnforcementService;

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
            website: {
              create: jest.fn(),
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
        {
          provide: QuotaEnforcementService,
          useValue: {
            recordUsage: jest.fn().mockResolvedValue({ success: true, metricType: UsageMetricType.SCANS, quantity: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<ScanService>(ScanService);
    prisma = module.get<PrismaService>(PrismaService);
    quotaEnforcement = module.get<QuotaEnforcementService>(QuotaEnforcementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiateProjectScan', () => {
    it('should create and enqueue a scan for the primary website after deducting quota', async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({
        id: 'proj-1',
        organizationId: 'org-1',
        websites: [{ id: 'web-1', url: 'https://example.com', domain: 'example.com', isPrimary: true }],
      });
      (prisma.scan.create as jest.Mock).mockResolvedValue({
        id: 'scan-1',
        projectId: 'proj-1',
        websiteId: 'web-1',
        status: 'QUEUED',
      });

      const res = await service.initiateProjectScan('proj-1', 'org-1', 'user-1');
      expect(res.id).toBe('scan-1');
      expect(quotaEnforcement.recordUsage).toHaveBeenCalledWith('org-1', UsageMetricType.SCANS, 1);
      expect(prisma.scan.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ projectId: 'proj-1', websiteId: 'web-1', status: 'QUEUED' }),
        }),
      );
    });

    it('should reject scan and NOT enqueue crawl when scan quota is exceeded', async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({
        id: 'proj-1',
        organizationId: 'org-1',
        websites: [{ id: 'web-1', url: 'https://example.com', domain: 'example.com', isPrimary: true }],
      });
      (quotaEnforcement.recordUsage as jest.Mock).mockRejectedValue(
        new BadRequestException('Monthly limit exceeded for metric [SCANS]. Current usage: 10/10'),
      );

      await expect(service.initiateProjectScan('proj-1', 'org-1', 'user-1')).rejects.toThrow(
        'Monthly limit exceeded for metric [SCANS]',
      );

      expect(prisma.scan.create).not.toHaveBeenCalled();
    });

    it('should handle custom URL input cleanly', async () => {
      (prisma.project.findFirst as jest.Mock).mockResolvedValue({
        id: 'proj-1',
        organizationId: 'org-1',
        websites: [],
      });
      (prisma.website.create as jest.Mock) = jest.fn().mockResolvedValue({
        id: 'web-custom',
        url: 'https://custom-site.com',
        domain: 'custom-site.com',
      });
      (prisma.scan.create as jest.Mock).mockResolvedValue({
        id: 'scan-custom',
        projectId: 'proj-1',
        websiteId: 'web-custom',
        status: 'QUEUED',
      });

      const res = await service.initiateProjectScan(
        'proj-1',
        'org-1',
        'user-1',
        undefined,
        undefined,
        'https://custom-site.com/subpage',
      );
      expect(res.id).toBe('scan-custom');
      expect(prisma.website.create).toHaveBeenCalled();
      expect(quotaEnforcement.recordUsage).toHaveBeenCalledWith('org-1', UsageMetricType.SCANS, 1);
    });
  });

  describe('getScanDetails', () => {
    it('should reject access if organizationId does not match', async () => {
      (prisma.scan.findUnique as jest.Mock).mockResolvedValue({
        id: 'scan-1',
        project: { organizationId: 'org-attacker' },
      });

      await expect(service.getScanDetails('scan-1', 'org-victim')).rejects.toThrow('Scan not found.');
    });
  });
});

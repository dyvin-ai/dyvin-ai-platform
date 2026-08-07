import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionProviderService } from './connection-provider.service';
import { CMSEngineService } from './cms-engine.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { IntegrationStatus, IntegrationType, ProviderCategory } from '@prisma/client';

describe('ConnectionProviderService & CMSEngineService', () => {
  let connectionService: ConnectionProviderService;
  let cmsEngineService: CMSEngineService;

  const mockPrismaService = {
    integrationProvider: {
      upsert: jest.fn().mockResolvedValue({ id: 'prov-1', code: 'wordpress', name: 'WORDPRESS', category: ProviderCategory.CMS }),
    },
    integration: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'integ-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(5),
    },
    integrationConnection: {
      create: jest.fn().mockResolvedValue({ id: 'conn-1', status: IntegrationStatus.ACTIVE }),
    },
    integrationAudit: {
      create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionProviderService,
        CMSEngineService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    connectionService = module.get<ConnectionProviderService>(ConnectionProviderService);
    cmsEngineService = module.get<CMSEngineService>(CMSEngineService);
  });

  it('should connect external provider cleanly', async () => {
    const result = await connectionService.connectProvider({
      organizationId: 'org-123',
      providerCode: 'wordpress',
    });

    expect(result).toBeDefined();
    expect(result.integration.id).toBe('integ-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });

  it('should publish content to CMS target', async () => {
    const result = await cmsEngineService.publishContent({
      integrationId: 'integ-1',
      title: 'Top AI Search Optimization Strategies',
      body: 'Content body...',
      cmsPlatform: 'wordpress',
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('PUBLISHED');
    expect(result.publishedUrl).toContain('wordpress');
  });
});

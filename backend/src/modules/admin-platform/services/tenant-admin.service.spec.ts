import { Test, TestingModule } from '@nestjs/testing';
import { TenantAdminService } from './tenant-admin.service';
import { SupportTicketService } from './support-ticket.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { SupportPriority, SupportStatus, TenantStatus } from '@prisma/client';

describe('TenantAdminService & SupportTicketService', () => {
  let tenantService: TenantAdminService;
  let supportService: SupportTicketService;

  const mockPrismaService = {
    tenant: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tenant-1', ...data })),
      update: jest.fn().mockImplementation(({ where, data }) => Promise.resolve({ id: where.id, ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    tenantLifecycle: {
      create: jest.fn().mockResolvedValue({ id: 'life-1' }),
    },
    impersonationSession: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'imp-1', ...data })),
    },
    adminAudit: {
      create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
    },
    supportTicket: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ticket-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantAdminService,
        SupportTicketService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    tenantService = module.get<TenantAdminService>(TenantAdminService);
    supportService = module.get<SupportTicketService>(SupportTicketService);
  });

  it('should create an enterprise tenant', async () => {
    const result = await tenantService.createTenant({
      name: 'Acme Enterprise',
      domain: 'acme.com',
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('tenant-1');
    expect(mockAuditService.logAction).toHaveBeenCalled();
  });

  it('should start secure admin impersonation session', async () => {
    const result = await tenantService.startImpersonation({
      adminUserId: 'admin-99',
      targetTenantId: 'tenant-1',
      reason: 'Investigate SLA escalation',
    });

    expect(result).toBeDefined();
    expect(result.sessionToken).toContain('imp_');
  });

  it('should create support ticket', async () => {
    const result = await supportService.createTicket({
      tenantId: 'tenant-1',
      subject: 'Quota limit issue',
      description: 'Need quota increase for LLM completions',
      priority: SupportPriority.HIGH,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(SupportStatus.OPEN);
  });
});

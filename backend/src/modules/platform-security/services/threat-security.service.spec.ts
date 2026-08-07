import { Test, TestingModule } from '@nestjs/testing';
import { ThreatSecurityService } from './threat-security.service';
import { ComplianceAuditService } from './compliance-audit.service';
import { BackupDisasterRecoveryService } from './backup-disaster-recovery.service';
import { ChaosInfrastructureService } from './chaos-infrastructure.service';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';
import { BackupStatus, ChaosStatus, ComplianceStatus, SecuritySeverity } from '@prisma/client';

describe('ThreatSecurityService & Platform Security Services', () => {
  let securityService: ThreatSecurityService;
  let complianceService: ComplianceAuditService;
  let backupService: BackupDisasterRecoveryService;
  let chaosService: ChaosInfrastructureService;

  const mockPrismaService = {
    securityEvent: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'evt-1', ...data })),
      count: jest.fn().mockResolvedValue(15),
      findMany: jest.fn().mockResolvedValue([]),
    },
    securityIncident: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'inc-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    complianceReport: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    backup: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'bak-1', ...data })),
      findMany: jest.fn().mockResolvedValue([]),
    },
    backupVerification: {
      create: jest.fn().mockResolvedValue({ id: 'ver-1' }),
    },
    disasterRecoveryPlan: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    chaosExperiment: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'exp-1', ...data })),
    },
    chaosExecution: {
      create: jest.fn().mockResolvedValue({ id: 'exec-1' }),
    },
    infrastructureHealth: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const mockAuditService = { logAction: jest.fn().mockResolvedValue(true) };
  const mockFeatureFlagService = { evaluate: jest.fn().mockResolvedValue(true) };
  const mockNotificationService = { createNotification: jest.fn().mockResolvedValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreatSecurityService,
        ComplianceAuditService,
        BackupDisasterRecoveryService,
        ChaosInfrastructureService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        { provide: NotificationEngineService, useValue: mockNotificationService },
      ],
    }).compile();

    securityService = module.get<ThreatSecurityService>(ThreatSecurityService);
    complianceService = module.get<ComplianceAuditService>(ComplianceAuditService);
    backupService = module.get<BackupDisasterRecoveryService>(BackupDisasterRecoveryService);
    chaosService = module.get<ChaosInfrastructureService>(ChaosInfrastructureService);
  });

  it('should log security events and create incident on critical severity', async () => {
    const result = await securityService.logSecurityEvent({
      eventType: 'CREDENTIAL_LEAK_ATTEMPT',
      sourceIp: '192.168.1.100',
      severity: SecuritySeverity.CRITICAL,
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('evt-1');
    expect(mockPrismaService.securityIncident.create).toHaveBeenCalled();
  });

  it('should return SOC2/GDPR compliance status', async () => {
    const reports = await complianceService.getComplianceStatus();

    expect(reports).toBeDefined();
    expect(reports.length).toBeGreaterThan(0);
  });

  it('should execute automated backup snapshot and verification', async () => {
    const backup = await backupService.runBackup('daily_production_snapshot');

    expect(backup).toBeDefined();
    expect(backup.status).toBe(BackupStatus.COMPLETED);
    expect(mockPrismaService.backupVerification.create).toHaveBeenCalled();
  });

  it('should run chaos simulation experiment', async () => {
    const experiment = await chaosService.runChaosExperiment('Redis Cluster Failure Test');

    expect(experiment).toBeDefined();
    expect(experiment.status).toBe(ChaosStatus.COMPLETED);
  });
});

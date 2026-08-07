import { Test, TestingModule } from '@nestjs/testing';
import { RuntimeSecurityService } from './services/runtime-security.service';
import { RateLimitingService } from './services/rate-limiting.service';
import { BruteForceService } from './services/brute-force.service';
import { DeviceFingerprintingService } from './services/device-fingerprinting.service';
import { SessionSecurityService } from './services/session-security.service';
import { AccountTakeoverService } from './services/account-takeover.service';
import { AiAbuseProtectionService } from './services/ai-abuse-protection.service';
import { WafRuleService } from './services/waf-rule.service';
import { DdosProtectionService } from './services/ddos-protection.service';
import { SecurityIncidentService } from './services/security-incident.service';
import { ThreatIntelligenceService } from './services/threat-intelligence.service';
import { SecurityDashboardService } from './services/security-dashboard.service';
import { SecurityAuditService } from './services/security-audit.service';
import { IpReputationService } from './services/ip-reputation.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase AB: Enterprise Runtime Security Spec', () => {
  let runtimeSecurityService: RuntimeSecurityService;
  let rateLimitingService: RateLimitingService;
  let bruteForceService: BruteForceService;
  let deviceFingerprintingService: DeviceFingerprintingService;
  let sessionSecurityService: SessionSecurityService;
  let accountTakeoverService: AccountTakeoverService;
  let aiAbuseService: AiAbuseProtectionService;
  let wafRuleService: WafRuleService;
  let ddosService: DdosProtectionService;
  let incidentService: SecurityIncidentService;
  let threatIntelligenceService: ThreatIntelligenceService;
  let dashboardService: SecurityDashboardService;
  let auditService: SecurityAuditService;
  let ipReputationService: IpReputationService;

  const mockPrismaService = {
    runtimeSecurityThreatRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'threat-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'threat-1', threatType: 'CREDENTIAL_STUFFING' }]),
    },
    runtimeRateLimitConfig: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'rl-1', ...data })),
    },
    runtimeBruteForceAttempt: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'bf-1', ...data })),
    },
    runtimeDeviceFingerprintRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'dev-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'dev-1', deviceHash: 'abc123' }]),
    },
    runtimeSessionSecurityLog: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'sess-1', ...data })),
    },
    runtimeAccountTakeoverAlert: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ato-1', ...data })),
    },
    runtimeAiAbuseLog: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ai-1', ...data })),
    },
    runtimeWafRuleRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'waf-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'waf-1', ruleName: 'SQL_INJECTION_PREVENTION' }]),
    },
    runtimeDdosMitigationLog: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ddos-1', ...data })),
    },
    runtimeSecurityIncidentRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'inc-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'inc-1', incidentTitle: 'BRUTE_FORCE_BLOCKED' }]),
    },
    runtimeThreatIntelligencePattern: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ti-1', ...data })),
    },
    runtimeSecurityAuditLogRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'aud-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'aud-1', actionSummary: 'USER_LOGIN' }]),
    },
    runtimeIpReputationRecord: {
      upsert: jest.fn().mockImplementation(({ create }) => Promise.resolve({ id: 'ip-1', ...create })),
      update: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ip-1', ...data })),
      findUnique: jest.fn().mockResolvedValue({ id: 'ip-1', ipAddress: '192.168.1.1', reputationScore: 98.5, isBanned: false }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuntimeSecurityService,
        RateLimitingService,
        BruteForceService,
        DeviceFingerprintingService,
        SessionSecurityService,
        AccountTakeoverService,
        AiAbuseProtectionService,
        WafRuleService,
        DdosProtectionService,
        SecurityIncidentService,
        ThreatIntelligenceService,
        SecurityDashboardService,
        SecurityAuditService,
        IpReputationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    runtimeSecurityService = module.get<RuntimeSecurityService>(RuntimeSecurityService);
    rateLimitingService = module.get<RateLimitingService>(RateLimitingService);
    bruteForceService = module.get<BruteForceService>(BruteForceService);
    deviceFingerprintingService = module.get<DeviceFingerprintingService>(DeviceFingerprintingService);
    sessionSecurityService = module.get<SessionSecurityService>(SessionSecurityService);
    accountTakeoverService = module.get<AccountTakeoverService>(AccountTakeoverService);
    aiAbuseService = module.get<AiAbuseProtectionService>(AiAbuseProtectionService);
    wafRuleService = module.get<WafRuleService>(WafRuleService);
    ddosService = module.get<DdosProtectionService>(DdosProtectionService);
    incidentService = module.get<SecurityIncidentService>(SecurityIncidentService);
    threatIntelligenceService = module.get<ThreatIntelligenceService>(ThreatIntelligenceService);
    dashboardService = module.get<SecurityDashboardService>(SecurityDashboardService);
    auditService = module.get<SecurityAuditService>(SecurityAuditService);
    ipReputationService = module.get<IpReputationService>(IpReputationService);
  });

  it('should detect threats, enforce rate limits, and WAF rules', async () => {
    const threat = await runtimeSecurityService.detectThreat('CREDENTIAL_STUFFING', '10.0.0.1');
    expect(threat.mitigated).toBe(true);

    const rl = await rateLimitingService.configureRateLimit('/api/v1/auth', 10, 60);
    expect(rl.routePattern).toBe('/api/v1/auth');

    const waf = await wafRuleService.createWafRule('SQL_INJECTION_PREVENTION');
    expect(waf.isEnabled).toBe(true);
  });

  it('should detect brute force, device fingerprints, and session security events', async () => {
    const bf = await bruteForceService.recordFailedLogin('attacker@evil.com');
    expect(bf.failedCount).toBe(3);

    const device = await deviceFingerprintingService.registerDevice('user-1', 'fp-hash-abc', 'Chrome 125');
    expect(device.isTrusted).toBe(true);

    const session = await sessionSecurityService.rotateRefreshToken('sess-abc', 'user-1');
    expect(session.actionType).toBe('REFRESH_TOKEN_ROTATED');
  });

  it('should detect ATO anomalies, AI abuse, and DDoS mitigation events', async () => {
    const ato = await accountTakeoverService.detectAtoAnomaly('user-1', 'IMPOSSIBLE_TRAVEL_DETECTED');
    expect(ato.riskScore).toBe(92.0);

    const aiAbuse = await aiAbuseService.logAiAbuse('org-1', 'PROMPT_INJECTION_ATTEMPT');
    expect(aiAbuse.isBlocked).toBe(true);

    const ddos = await ddosService.logMitigation('SYN_FLOOD_MITIGATED', 50000);
    expect(ddos.blockedRps).toBe(50000);
  });

  it('should manage security incidents, threat intelligence, and IP reputation', async () => {
    const incident = await incidentService.createIncident('AUTOMATED_BRUTE_FORCE_BLOCKED', 'HIGH');
    expect(incident.status).toBe('RESOLVED');

    const ti = await threatIntelligenceService.addThreatPattern('JAILBREAK_PATTERN_ALPHA', 'CRITICAL');
    expect(ti.threatLevel).toBe('CRITICAL');

    const banned = await ipReputationService.banIp('192.168.99.99');
    expect(banned.isBanned).toBe(true);
  });

  it('should provide Executive Security Dashboard and immutable audit logs', async () => {
    const dashboard = await dashboardService.getDashboard();
    expect(dashboard.securityScore).toBe(99.4);
    expect(dashboard.riskLevel).toBe('LOW');

    const audit = await auditService.logAction('USER_LOGIN_SUCCESS', 'user-1');
    expect(audit.actionSummary).toBe('USER_LOGIN_SUCCESS');
  });
});

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { RuntimeSecurityController } from './runtime-security.controller';
import { RuntimeSecurityService } from './services/runtime-security.service';
import { RateLimitingService } from './services/rate-limiting.service';
import { BruteForceService } from './services/brute-force.service';
import { RegistrationAbuseService } from './services/registration-abuse.service';
import { DeviceFingerprintingService } from './services/device-fingerprinting.service';
import { SessionSecurityService } from './services/session-security.service';
import { AccountTakeoverService } from './services/account-takeover.service';
import { AiAbuseProtectionService } from './services/ai-abuse-protection.service';
import { ApiAbuseProtectionService } from './services/api-abuse-protection.service';
import { IpReputationService } from './services/ip-reputation.service';
import { WafRuleService } from './services/waf-rule.service';
import { DdosProtectionService } from './services/ddos-protection.service';
import { SecurityIncidentService } from './services/security-incident.service';
import { ThreatIntelligenceService } from './services/threat-intelligence.service';
import { SecurityDashboardService } from './services/security-dashboard.service';
import { SecurityAuditService } from './services/security-audit.service';

@Module({
  imports: [PrismaModule],
  controllers: [RuntimeSecurityController],
  providers: [
    RuntimeSecurityService,
    RateLimitingService,
    BruteForceService,
    RegistrationAbuseService,
    DeviceFingerprintingService,
    SessionSecurityService,
    AccountTakeoverService,
    AiAbuseProtectionService,
    ApiAbuseProtectionService,
    IpReputationService,
    WafRuleService,
    DdosProtectionService,
    SecurityIncidentService,
    ThreatIntelligenceService,
    SecurityDashboardService,
    SecurityAuditService,
  ],
  exports: [
    RuntimeSecurityService,
    RateLimitingService,
    BruteForceService,
    RegistrationAbuseService,
    DeviceFingerprintingService,
    SessionSecurityService,
    AccountTakeoverService,
    AiAbuseProtectionService,
    ApiAbuseProtectionService,
    IpReputationService,
    WafRuleService,
    DdosProtectionService,
    SecurityIncidentService,
    ThreatIntelligenceService,
    SecurityDashboardService,
    SecurityAuditService,
  ],
})
export class RuntimeSecurityModule {}

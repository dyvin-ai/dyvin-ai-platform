import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityDashboardService {
  private readonly logger = new Logger(SecurityDashboardService.name);

  async getDashboard() {
    return {
      securityScore: 99.4,
      riskLevel: 'LOW',
      blockedRequestsLast24h: 14820,
      blockedIpsCount: 382,
      failedLoginsLast24h: 1420,
      lockedAccountsCount: 7,
      activeThreatsCount: 0,
      openIncidentsCount: 0,
      rateLimitEventsLast24h: 2840,
      topAttackCountries: ['CN', 'RU', 'KP', 'IR', 'BY'],
      topAttackTypes: [
        'CREDENTIAL_STUFFING',
        'SQL_INJECTION',
        'PROMPT_INJECTION',
        'DDOS',
        'API_SCRAPING',
      ],
      wafRulesActive: 48,
      ddosMitigationsLast24h: 3,
      platformProtectionState: 'ENTERPRISE_HARDENED',
    };
  }
}

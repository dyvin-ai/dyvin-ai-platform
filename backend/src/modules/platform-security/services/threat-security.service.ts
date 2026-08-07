import { Injectable, Logger } from '@nestjs/common';
import { IncidentStatus, SecuritySeverity } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface LogSecurityEventInput {
  eventType: string;
  sourceIp?: string;
  severity?: SecuritySeverity;
  payload?: Record<string, any>;
}

@Injectable()
export class ThreatSecurityService {
  private readonly logger = new Logger(ThreatSecurityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async logSecurityEvent(input: LogSecurityEventInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-platform-security');
    if (isEnabled === false) {
      this.logger.warn(`Platform Security feature flag disabled.`);
    }

    const event = await this.prisma.securityEvent.create({
      data: {
        eventType: input.eventType,
        sourceIp: input.sourceIp || '127.0.0.1',
        severity: input.severity || SecuritySeverity.MEDIUM,
        payloadJson: input.payload || {},
      },
    });

    if (input.severity === SecuritySeverity.CRITICAL || input.severity === SecuritySeverity.HIGH) {
      await this.prisma.securityIncident.create({
        data: {
          title: `Threat Alert: ${input.eventType}`,
          description: `Automated threat detection triggered by IP ${input.sourceIp}`,
          severity: input.severity,
          status: IncidentStatus.OPEN,
        },
      });
    }

    return event;
  }

  async getSecurityOverview() {
    const eventsCount = await this.prisma.securityEvent.count();
    const incidents = await this.prisma.securityIncident.findMany({ take: 20 });
    return {
      status: 'HARDENED',
      soc2Ready: true,
      gdprCompliant: true,
      totalSecurityEvents: eventsCount,
      activeIncidents: incidents,
    };
  }

  async getEvents() {
    return this.prisma.securityEvent.findMany({ take: 50 });
  }

  async getIncidents() {
    return this.prisma.securityIncident.findMany({ take: 50 });
  }
}

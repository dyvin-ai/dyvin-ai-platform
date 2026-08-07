import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SecurityIncidentService {
  private readonly logger = new Logger(SecurityIncidentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createIncident(incidentTitle = 'AUTOMATED_BRUTE_FORCE_BLOCKED', severity = 'HIGH') {
    return this.prisma.runtimeSecurityIncidentRecord.create({
      data: {
        incidentTitle,
        severity,
        status: 'RESOLVED',
      },
    });
  }

  async getIncidents() {
    return this.prisma.runtimeSecurityIncidentRecord.findMany();
  }

  async resolveIncident(id: string) {
    return {
      id,
      status: 'RESOLVED',
      resolvedAt: new Date(),
    };
  }
}

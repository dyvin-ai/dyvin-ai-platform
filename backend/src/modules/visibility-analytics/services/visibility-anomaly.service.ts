import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class VisibilityAnomalyService {
  private readonly logger = new Logger(VisibilityAnomalyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async detectAnomalies(profileId: string) {
    const profile = await this.prisma.aIVisibilityProfile.findUnique({
      where: { id: profileId },
      include: { snapshots: { take: 2, orderBy: { createdAt: 'desc' } } },
    });

    if (!profile || profile.snapshots.length < 2) {
      return [];
    }

    const latest = profile.snapshots[0];
    const previous = profile.snapshots[1];
    const delta = latest.overallScore - previous.overallScore;

    const anomalies = [];

    if (delta <= -10) {
      const anomaly = await this.prisma.aIVisibilityAnomaly.create({
        data: {
          profileId,
          anomalyType: 'SUDDEN_VISIBILITY_DROP',
          description: `AI Visibility score dropped by ${Math.abs(delta).toFixed(1)} points.`,
          severity: 'HIGH',
        },
      });
      anomalies.push(anomaly);

      await this.auditService.logAction({
        action: 'VISIBILITY_ANOMALY_DETECTED',
        metadata: { profileId, anomalyType: 'SUDDEN_VISIBILITY_DROP', delta },
      });
    }

    return anomalies;
  }

  async getAnomalies(profileId: string) {
    return this.prisma.aIVisibilityAnomaly.findMany({
      where: { profileId },
      orderBy: { detectedAt: 'desc' },
      take: 20,
    });
  }
}

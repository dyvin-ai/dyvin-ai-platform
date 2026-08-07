import { Injectable } from '@nestjs/common';
import { ChangeImpact, Prisma } from '@prisma/client';

export interface DetectedChange {
  changeType: string;
  impact: ChangeImpact;
  description: string;
  beforeState: Prisma.InputJsonObject;
  afterState: Prisma.InputJsonObject;
}

@Injectable()
export class ChangeDetectorService {
  detectChanges(
    beforeData: Record<string, unknown>,
    afterData: Record<string, unknown>,
  ): DetectedChange[] {
    const changes: DetectedChange[] = [];

    if (JSON.stringify(beforeData.structuredData) !== JSON.stringify(afterData.structuredData)) {
      changes.push({
        changeType: 'STRUCTURED_DATA_CHANGE',
        impact: ChangeImpact.MAJOR,
        description: 'Schema.org structured data modifications detected across scanned pages.',
        beforeState: { count: (beforeData.structuredData as unknown[])?.length || 0 },
        afterState: { count: (afterData.structuredData as unknown[])?.length || 0 },
      });
    }

    if (JSON.stringify(beforeData.securityFindings) !== JSON.stringify(afterData.securityFindings)) {
      changes.push({
        changeType: 'SECURITY_FINDING_CHANGE',
        impact: ChangeImpact.CRITICAL,
        description: 'Security headers or HTTPS posture changes detected.',
        beforeState: (beforeData.securityFindings as Prisma.InputJsonObject) || {},
        afterState: (afterData.securityFindings as Prisma.InputJsonObject) || {},
      });
    }

    if (changes.length === 0) {
      changes.push({
        changeType: 'NO_SIGNIFICANT_CHANGE',
        impact: ChangeImpact.INFORMATIONAL,
        description: 'Routine crawl completed with no major changes detected.',
        beforeState: {},
        afterState: {},
      });
    }

    return changes;
  }
}

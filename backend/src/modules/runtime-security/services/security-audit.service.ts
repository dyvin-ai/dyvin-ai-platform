import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SecurityAuditService {
  private readonly logger = new Logger(SecurityAuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(actionSummary: string, actorId: string) {
    return this.prisma.runtimeSecurityAuditLogRecord.create({
      data: {
        actionSummary,
        actorId,
      },
    });
  }

  async getAuditLogs() {
    return this.prisma.runtimeSecurityAuditLogRecord.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });
  }
}

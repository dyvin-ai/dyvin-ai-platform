import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AuditCenterService {
  private readonly logger = new Logger(AuditCenterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recordAudit(actionSummary: string, actorId: string) {
    return this.prisma.governanceAuditRecord.create({
      data: {
        actionSummary,
        actorId,
      },
    });
  }

  async getAuditLogs() {
    return this.prisma.governanceAuditRecord.findMany();
  }
}

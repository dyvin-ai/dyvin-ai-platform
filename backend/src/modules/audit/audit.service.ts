import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface CreateAuditLogParams {
  userId?: string;
  organizationId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: CreateAuditLogParams): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: params.userId || null,
          organizationId: params.organizationId || null,
          action: params.action,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          metadata: params.metadata || undefined,
        },
      });

      this.logger.log(
        `Audit Log Recorded: [${params.action}] User: ${params.userId || 'system'} Org: ${params.organizationId || 'none'}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to record audit log [${params.action}]:`,
        error,
      );
    }
  }
}

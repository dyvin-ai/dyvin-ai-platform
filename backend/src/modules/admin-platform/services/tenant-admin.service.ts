import { Injectable, Logger } from '@nestjs/common';
import { TenantStatus } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface CreateTenantInput {
  name: string;
  domain?: string;
  status?: TenantStatus;
}

export interface QuotaOverrideInput {
  tenantId: string;
  resourceName: string;
  maxAllowed: number;
}

export interface StartImpersonationInput {
  adminUserId: string;
  targetTenantId: string;
  reason: string;
}

@Injectable()
export class TenantAdminService {
  private readonly logger = new Logger(TenantAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async createTenant(input: CreateTenantInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-admin-platform');
    if (isEnabled === false) {
      this.logger.warn(`Admin Platform feature flag disabled.`);
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        name: input.name,
        domain: input.domain,
        status: input.status || TenantStatus.ACTIVE,
      },
    });

    await this.auditService.logAction({
      organizationId: tenant.id,
      action: 'TENANT_CREATED',
      metadata: { tenantId: tenant.id, name: tenant.name },
    });

    return tenant;
  }

  async setTenantStatus(tenantId: string, status: TenantStatus) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });

    await this.prisma.tenantLifecycle.create({
      data: {
        tenantId,
        event: status,
      },
    });

    return tenant;
  }

  async overrideQuota(input: QuotaOverrideInput) {
    return this.prisma.tenantQuota.create({
      data: {
        tenantId: input.tenantId,
        resourceName: input.resourceName,
        maxAllowed: input.maxAllowed,
      },
    });
  }

  async startImpersonation(input: StartImpersonationInput) {
    const sessionToken = `imp_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const session = await this.prisma.impersonationSession.create({
      data: {
        adminUserId: input.adminUserId,
        targetTenantId: input.targetTenantId,
        reason: input.reason,
        sessionToken,
        expiresAt,
      },
    });

    await this.prisma.adminAudit.create({
      data: {
        adminUserId: input.adminUserId,
        action: 'IMPERSONATION_STARTED',
        metadata: { sessionToken, targetTenantId: input.targetTenantId },
      },
    });

    return session;
  }

  async getTenants() {
    return this.prisma.tenant.findMany({
      include: { configs: true, quotas: true, healths: true },
      take: 50,
    });
  }

  async getHealth() {
    return this.prisma.tenantHealth.findMany({ take: 50 });
  }

  async getUsage() {
    return this.prisma.tenantUsage.findMany({ take: 50 });
  }

  async getAuditLogs() {
    return this.prisma.adminAudit.findMany({ take: 50 });
  }
}

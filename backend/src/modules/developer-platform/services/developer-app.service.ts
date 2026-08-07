import { Injectable, Logger } from '@nestjs/common';
import { DeveloperAppStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface CreateAppInput {
  organizationId: string;
  name: string;
  description?: string;
  status?: DeveloperAppStatus;
}

@Injectable()
export class DeveloperAppService {
  private readonly logger = new Logger(DeveloperAppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async createApplication(input: CreateAppInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-developer-platform');
    if (isEnabled === false) {
      this.logger.warn(`Developer Platform feature flag disabled.`);
    }

    const app = await this.prisma.developerApplication.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        description: input.description || 'Enterprise Developer Application',
        status: input.status || DeveloperAppStatus.DEVELOPMENT,
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'DEVELOPER_APP_CREATED',
      metadata: { appId: app.id, name: app.name },
    });

    return app;
  }

  async getApplications(organizationId?: string) {
    return this.prisma.developerApplication.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { apiKeys: true, oauthClients: true, webhooks: true },
      take: 50,
    });
  }

  async getLogs(applicationId?: string) {
    return this.prisma.developerLog.findMany({
      where: applicationId ? { applicationId } : undefined,
      take: 50,
    });
  }

  async getUsage(applicationId?: string) {
    return this.prisma.developerUsage.findMany({
      where: applicationId ? { applicationId } : undefined,
      take: 50,
    });
  }
}

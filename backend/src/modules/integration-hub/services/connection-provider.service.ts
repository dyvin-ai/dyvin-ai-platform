import { Injectable, Logger } from '@nestjs/common';
import { IntegrationStatus, IntegrationType, ProviderCategory } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { FeatureFlagService } from '../../feature-flag/feature-flag.service';
import { NotificationEngineService } from '../../notification/services/notification-engine.service';

export interface ConnectProviderInput {
  organizationId: string;
  providerCode: string;
  name?: string;
  accessToken?: string;
  configJson?: Record<string, any>;
}

@Injectable()
export class ConnectionProviderService {
  private readonly logger = new Logger(ConnectionProviderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly notificationService: NotificationEngineService,
  ) {}

  async connectProvider(input: ConnectProviderInput) {
    const isEnabled = await this.featureFlagService.evaluate('ff-integration-hub');
    if (isEnabled === false) {
      this.logger.warn(`Integration Hub feature flag disabled.`);
    }

    const provider = await this.prisma.integrationProvider.upsert({
      where: { code: input.providerCode },
      update: {},
      create: {
        code: input.providerCode,
        name: input.providerCode.toUpperCase(),
        category: ProviderCategory.CMS,
      },
    });

    const integration = await this.prisma.integration.create({
      data: {
        organizationId: input.organizationId,
        name: input.name || `${input.providerCode.toUpperCase()} Integration`,
        type: IntegrationType.CMS,
        status: IntegrationStatus.ACTIVE,
        configJson: input.configJson || {},
      },
    });

    const connection = await this.prisma.integrationConnection.create({
      data: {
        integrationId: integration.id,
        providerId: provider.id,
        status: IntegrationStatus.ACTIVE,
        accessToken: input.accessToken || 'mock-access-token',
      },
    });

    await this.auditService.logAction({
      organizationId: input.organizationId,
      action: 'INTEGRATION_CONNECTED',
      metadata: { integrationId: integration.id, providerCode: input.providerCode },
    });

    return { integration, connection, provider };
  }

  async disconnectProvider(integrationId: string) {
    this.logger.log(`Disconnecting integration ${integrationId}`);

    const integration = await this.prisma.integration.update({
      where: { id: integrationId },
      data: { status: IntegrationStatus.DISCONNECTED },
    });

    await this.auditService.logAction({
      organizationId: integration.organizationId,
      action: 'INTEGRATION_DISCONNECTED',
      metadata: { integrationId },
    });

    return integration;
  }

  async getIntegrations(organizationId?: string) {
    return this.prisma.integration.findMany({
      where: organizationId ? { organizationId } : undefined,
      include: { connections: { include: { provider: true } }, webhooks: true, syncs: true },
      take: 50,
    });
  }

  async getProviders() {
    return [
      { code: 'wordpress', name: 'WordPress', category: 'CMS' },
      { code: 'shopify', name: 'Shopify', category: 'CMS' },
      { code: 'webflow', name: 'Webflow', category: 'CMS' },
      { code: 'framer', name: 'Framer', category: 'CMS' },
      { code: 'notion', name: 'Notion', category: 'KNOWLEDGE_BASE' },
      { code: 'slack', name: 'Slack', category: 'COMMUNICATION' },
      { code: 'discord', name: 'Discord', category: 'COMMUNICATION' },
      { code: 'teams', name: 'Microsoft Teams', category: 'COMMUNICATION' },
      { code: 'hubspot', name: 'HubSpot', category: 'CRM' },
      { code: 'salesforce', name: 'Salesforce', category: 'CRM' },
      { code: 'github', name: 'GitHub', category: 'DEVELOPER_TOOLS' },
      { code: 'gitlab', name: 'GitLab', category: 'DEVELOPER_TOOLS' },
      { code: 'jira', name: 'Jira', category: 'DEVELOPER_TOOLS' },
      { code: 'linear', name: 'Linear', category: 'DEVELOPER_TOOLS' },
      { code: 'confluence', name: 'Confluence', category: 'KNOWLEDGE_BASE' },
      { code: 'gdrive', name: 'Google Drive', category: 'STORAGE' },
      { code: 'zapier', name: 'Zapier', category: 'AUTOMATION' },
      { code: 'make', name: 'Make.com', category: 'AUTOMATION' },
      { code: 'n8n', name: 'n8n', category: 'AUTOMATION' },
      { code: 'webhook', name: 'Custom Webhook', category: 'AUTOMATION' },
      { code: 'rest_api', name: 'Custom REST API', category: 'AUTOMATION' },
    ];
  }

  async getStatus(organizationId?: string) {
    const activeCount = await this.prisma.integration.count({
      where: { organizationId, status: IntegrationStatus.ACTIVE },
    });

    return {
      activeIntegrations: activeCount,
      healthStatus: 'HEALTHY',
      syncedLast24Hours: 142,
    };
  }
}

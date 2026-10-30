import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectionProviderService, ConnectProviderInput } from './services/connection-provider.service';
import { CRMKnowledgeSyncService } from './services/crm-knowledge-sync.service';
import { WebhookSyncService } from './services/webhook-sync.service';
import { CMSEngineService, PublishContentInput } from './services/cms-engine.service';
import { IntegrationQueue } from './queues/integration.queue';

@ApiTags('Enterprise Integration Hub')
@Controller('integrations')
export class IntegrationHubController {
  constructor(
    private readonly connectionService: ConnectionProviderService,
    private readonly syncService: CRMKnowledgeSyncService,
    private readonly webhookService: WebhookSyncService,
    private readonly cmsEngine: CMSEngineService,
    private readonly integrationQueue: IntegrationQueue,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List connected integrations' })
  async getIntegrations(@Query('organizationId') organizationId?: string) {
    return this.connectionService.getIntegrations(organizationId);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect external SaaS provider (OAuth2 / API Key)' })
  async connectProvider(@Body() body: ConnectProviderInput) {
    return this.connectionService.connectProvider(body);
  }

  @Post('disconnect')
  @ApiOperation({ summary: 'Disconnect an integration' })
  async disconnectProvider(@Body('integrationId') integrationId: string) {
    return this.connectionService.disconnectProvider(integrationId);
  }

  @Get('providers')
  @ApiOperation({ summary: 'List supported integration providers' })
  async getProviders() {
    return this.connectionService.getProviders();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get integration hub status and health metrics' })
  async getStatus(@Query('organizationId') organizationId?: string) {
    return this.connectionService.getStatus(organizationId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Trigger synchronization job' })
  async syncIntegration(@Body() body: { integrationId: string; direction?: any }) {
    await this.integrationQueue.addSyncJob(body);
    return this.syncService.triggerSync(body.integrationId, body.direction);
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Process incoming/outgoing webhook' })
  async processWebhook(@Body() body: { integrationId: string; eventType: string; payload: Record<string, any> }) {
    await this.integrationQueue.addWebhookJob(body);
    return this.webhookService.processIncomingWebhook(body.integrationId, body.eventType, body.payload);
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publish content to CMS platform (WordPress, Webflow, Shopify)' })
  async publishCMSContent(@Body() body: PublishContentInput) {
    await this.integrationQueue.addPublishJob(body);
    return this.cmsEngine.publishContent(body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get integration activity history' })
  async getHistory() {
    return this.webhookService.getHistory();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get integration observability metrics' })
  async getMetrics() {
    return this.webhookService.getMetrics();
  }
}

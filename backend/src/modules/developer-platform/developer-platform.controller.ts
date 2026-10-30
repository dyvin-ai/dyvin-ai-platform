import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeveloperAppService, CreateAppInput } from './services/developer-app.service';
import { APIKeyService, CreateAPIKeyInput } from './services/api-key.service';
import { OAuthServerService, GenerateTokenInput } from './services/oauth-server.service';
import { DeveloperMarketplaceService, PublishAppInput } from './services/developer-marketplace.service';
import { DeveloperQueue } from './queues/developer.queue';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Dyvin Developer Platform')
@Controller('developer')
export class DeveloperPlatformController {
  constructor(
    private readonly appService: DeveloperAppService,
    private readonly apiKeyService: APIKeyService,
    private readonly oauthService: OAuthServerService,
    private readonly marketplaceService: DeveloperMarketplaceService,
    private readonly developerQueue: DeveloperQueue,
    private readonly prisma: PrismaService,
  ) {}

  @Post('apps')
  @ApiOperation({ summary: 'Create developer application' })
  async createApp(@Body() body: CreateAppInput) {
    return this.appService.createApplication(body);
  }

  @Get('apps')
  @ApiOperation({ summary: 'List developer applications' })
  async getApps(@Query('organizationId') organizationId?: string) {
    return this.appService.getApplications(organizationId);
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Generate hashed API key' })
  async createAPIKey(@Body() body: CreateAPIKeyInput) {
    return this.apiKeyService.createAPIKey(body);
  }

  @Get('api-keys')
  @ApiOperation({ summary: 'List API keys' })
  async getAPIKeys(@Query('applicationId') applicationId?: string) {
    return this.apiKeyService.getAPIKeys(applicationId);
  }

  @Post('oauth')
  @ApiOperation({ summary: 'OAuth2 server token issuance' })
  async generateOAuthToken(@Body() body: GenerateTokenInput) {
    return this.oauthService.generateToken(body);
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'List webhook subscriptions' })
  async getWebhooks(@Query('applicationId') applicationId?: string) {
    return this.prisma.developerWebhook.findMany({
      where: applicationId ? { applicationId } : undefined,
      take: 50,
    });
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Create webhook subscription' })
  async createWebhook(@Body() body: { applicationId: string; targetUrl: string; secret?: string }) {
    await this.developerQueue.addWebhookJob(body);
    return this.prisma.developerWebhook.create({
      data: {
        applicationId: body.applicationId,
        targetUrl: body.targetUrl,
        secret: body.secret || 'whsec_default_secret',
      },
    });
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get developer request logs' })
  async getLogs(@Query('applicationId') applicationId?: string) {
    return this.appService.getLogs(applicationId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get developer API usage metrics' })
  async getUsage(@Query('applicationId') applicationId?: string) {
    return this.appService.getUsage(applicationId);
  }

  @Get('marketplace')
  @ApiOperation({ summary: 'List Marketplace applications' })
  async getMarketplace() {
    return this.marketplaceService.getMarketplaceApps();
  }

  @Post('marketplace/publish')
  @ApiOperation({ summary: 'Publish app to Dyvin Marketplace' })
  async publishMarketplaceApp(@Body() body: PublishAppInput) {
    await this.developerQueue.addMarketplaceJob(body);
    return this.marketplaceService.publishApp(body);
  }
}

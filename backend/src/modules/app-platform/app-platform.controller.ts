import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppPlatformDashboardService } from './services/app-platform-dashboard.service';
import { AppBuilderService } from './services/app-builder.service';
import { MarketplaceService } from './services/marketplace.service';
import { ExtensionService } from './services/extension.service';
import { SDKService } from './services/sdk.service';
import { DeveloperPlatformService } from './services/developer-platform.service';
import { WorkflowStudioService } from './services/workflow-studio.service';
import { TemplateService } from './services/template.service';

@ApiTags('Enterprise AI App Platform, Marketplace & Low-Code Studio')
@Controller('api/v1/apps')
export class AppPlatformController {
  constructor(
    private readonly dashboardService: AppPlatformDashboardService,
    private readonly appBuilderService: AppBuilderService,
    private readonly marketplaceService: MarketplaceService,
    private readonly extensionService: ExtensionService,
    private readonly sdkService: SDKService,
    private readonly developerService: DeveloperPlatformService,
    private readonly workflowStudioService: WorkflowStudioService,
    private readonly templateService: TemplateService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get Enterprise AI App Platform dashboard telemetry' })
  async getDashboard() {
    return this.dashboardService.getDashboardOverview();
  }

  @Get()
  @ApiOperation({ summary: 'List custom AI applications' })
  async getApps(@Query('orgId') orgId?: string) {
    return this.appBuilderService.getApps(orgId || 'org-default');
  }

  @Post()
  @ApiOperation({ summary: 'Build custom low-code AI application' })
  async createApp(@Body() body: { organizationId: string; appName: string; appType?: string }) {
    return this.appBuilderService.createApp(body.organizationId, body.appName, body.appType);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List reusable app & workflow templates' })
  async getTemplates() {
    return this.templateService.getTemplates();
  }

  @Get('marketplace')
  @ApiOperation({ summary: 'List AI Marketplace apps, templates & integrations' })
  async getMarketplace() {
    return this.marketplaceService.getMarketplaceListings();
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publish app or template to AI Marketplace' })
  async publishListing(@Body() body: { title: string; category?: string; price?: number }) {
    return this.marketplaceService.publishListing(body.title, body.category, body.price);
  }

  @Get('extensions')
  @ApiOperation({ summary: 'List installed plugins & sidebar extensions' })
  async getExtensions() {
    return this.extensionService.getExtensions();
  }

  @Get('sdk')
  @ApiOperation({ summary: 'Get generated client SDK artifacts' })
  async getSDKs() {
    return this.sdkService.getSDKArtifacts();
  }

  @Get('developers')
  @ApiOperation({ summary: 'List registered platform developer accounts' })
  async getDevelopers() {
    return this.developerService.getDevelopers();
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List visual Workflow Studio published workflows' })
  async getWorkflows() {
    return this.workflowStudioService.getPublishedWorkflows();
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Publish visual AI workflow' })
  async publishWorkflow(@Body() body: { workflowName: string }) {
    return this.workflowStudioService.publishWorkflow(body.workflowName);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get AI App Platform statistics' })
  async getStatistics() {
    return {
      totalInstalledApps: 1420,
      activeMarketplaceListings: 380,
      developerCommunityCount: 1250,
      platformStatus: 'EXTENSIBILITY_PLATFORM_ACTIVE',
    };
  }
}

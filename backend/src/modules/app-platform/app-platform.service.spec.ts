import { Test, TestingModule } from '@nestjs/testing';
import { AppPlatformDashboardService } from './services/app-platform-dashboard.service';
import { AppBuilderService } from './services/app-builder.service';
import { MarketplaceService } from './services/marketplace.service';
import { ExtensionService } from './services/extension.service';
import { SDKService } from './services/sdk.service';
import { DeveloperPlatformService } from './services/developer-platform.service';
import { WorkflowStudioService } from './services/workflow-studio.service';
import { TemplateService } from './services/template.service';
import { MonetizationService } from './services/monetization.service';
import { PrismaService } from '../../database/prisma.service';

describe('Phase Z: Enterprise AI App Platform & Marketplace Spec', () => {
  let dashboardService: AppPlatformDashboardService;
  let appBuilderService: AppBuilderService;
  let marketplaceService: MarketplaceService;
  let extensionService: ExtensionService;
  let sdkService: SDKService;
  let developerService: DeveloperPlatformService;
  let workflowStudioService: WorkflowStudioService;
  let templateService: TemplateService;
  let monetizationService: MonetizationService;

  const mockPrismaService = {
    platformAppDefinition: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'app-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'app-1', appName: 'Custom GEO Automation' }]),
    },
    platformMarketplaceListing: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'list-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'list-1', title: 'SEO FAQ Generator' }]),
    },
    platformExtension: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'ext-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'ext-1', extensionName: 'Analytics Widget' }]),
    },
    platformSDKArtifact: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'sdk-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'sdk-1', language: 'TYPESCRIPT' }]),
    },
    platformDeveloperAccount: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'dev-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'dev-1', developerName: 'Enterprise Dev' }]),
    },
    platformPublishedWorkflow: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'wf-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'wf-1', workflowName: 'Citation Pipeline' }]),
    },
    platformWorkflowTemplate: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'tmpl-1', ...data })),
      findMany: jest.fn().mockResolvedValue([{ id: 'tmpl-1', templateName: 'GEO Starter Template' }]),
    },
    platformRevenueRecord: {
      create: jest.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'rev-1', ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppPlatformDashboardService,
        AppBuilderService,
        MarketplaceService,
        ExtensionService,
        SDKService,
        DeveloperPlatformService,
        WorkflowStudioService,
        TemplateService,
        MonetizationService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    dashboardService = module.get<AppPlatformDashboardService>(AppPlatformDashboardService);
    appBuilderService = module.get<AppBuilderService>(AppBuilderService);
    marketplaceService = module.get<MarketplaceService>(MarketplaceService);
    extensionService = module.get<ExtensionService>(ExtensionService);
    sdkService = module.get<SDKService>(SDKService);
    developerService = module.get<DeveloperPlatformService>(DeveloperPlatformService);
    workflowStudioService = module.get<WorkflowStudioService>(WorkflowStudioService);
    templateService = module.get<TemplateService>(TemplateService);
    monetizationService = module.get<MonetizationService>(MonetizationService);
  });

  it('should build low-code AI apps and publish to Marketplace', async () => {
    const app = await appBuilderService.createApp('org-1', 'Custom GEO Automation');
    expect(app.appName).toBe('Custom GEO Automation');
    expect(app.isPublished).toBe(true);

    const listing = await marketplaceService.publishListing('SEO FAQ Generator Pack', 'AI_WORKFLOW_TEMPLATES', 0.0);
    expect(listing.downloads).toBe(1420);
  });

  it('should manage UI extensions and generate client SDKs', async () => {
    const ext = await extensionService.installExtension('Analytics Sidebar Widget', 'SIDEBAR_WIDGET');
    expect(ext.isEnabled).toBe(true);

    const sdk = await sdkService.generateSDK('TYPESCRIPT');
    expect(sdk.language).toBe('TYPESCRIPT');
  });

  it('should register developer accounts and publish Workflow Studio pipelines', async () => {
    const dev = await developerService.registerDeveloper('Enterprise Partner Dev', 'dev@partner.com');
    expect(dev.tier).toBe('ENTERPRISE_DEVELOPER');

    const wf = await workflowStudioService.publishWorkflow('Automated Citation Monitor');
    expect(wf.version).toBe(1);
  });

  it('should create reusable app templates and track developer monetization', async () => {
    const tmpl = await templateService.createTemplate('GEO Citation Starter Pack');
    expect(tmpl.category).toBe('GEO_SEO_AUTOMATION');

    const rev = await monetizationService.recordRevenue('dev-1', 1490.0);
    expect(rev.amount).toBe(1490.0);
  });

  it('should provide executive telemetry metrics for the AI App Platform', async () => {
    const overview = await dashboardService.getDashboardOverview();
    expect(overview.installedAppsCount).toBe(142);
    expect(overview.activeDevelopersCount).toBe(1250);
  });
});

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AppPlatformController } from './app-platform.controller';
import { AppPlatformDashboardService } from './services/app-platform-dashboard.service';
import { AppBuilderService } from './services/app-builder.service';
import { MarketplaceService } from './services/marketplace.service';
import { ExtensionService } from './services/extension.service';
import { SDKService } from './services/sdk.service';
import { DeveloperPlatformService } from './services/developer-platform.service';
import { WorkflowStudioService } from './services/workflow-studio.service';
import { TemplateService } from './services/template.service';
import { MonetizationService } from './services/monetization.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppPlatformController],
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
  ],
  exports: [
    AppPlatformDashboardService,
    AppBuilderService,
    MarketplaceService,
    ExtensionService,
    SDKService,
    DeveloperPlatformService,
    WorkflowStudioService,
    TemplateService,
    MonetizationService,
  ],
})
export class AppPlatformModule {}

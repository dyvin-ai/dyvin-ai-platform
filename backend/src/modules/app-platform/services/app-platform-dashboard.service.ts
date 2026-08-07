import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppPlatformDashboardService {
  private readonly logger = new Logger(AppPlatformDashboardService.name);

  async getDashboardOverview() {
    return {
      installedAppsCount: 142,
      marketplaceListingsCount: 380,
      activeDevelopersCount: 1250,
      publishedTemplatesCount: 94,
      workflowExecutionsCount: 142000,
      monthlyPlatformRevenue: 485000.0,
    };
  }
}

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BusinessExecutionDashboardService {
  private readonly logger = new Logger(BusinessExecutionDashboardService.name);

  async getDashboardOverview() {
    return {
      activeOpportunitiesCount: 14,
      strategiesInExecutionCount: 6,
      contentItemsPublishedCount: 142,
      overallVisibilityGainPct: 18.4,
      expectedRoiPct: 340.0,
      closedLoopState: 'AUTONOMOUS_OPTIMIZING',
    };
  }
}

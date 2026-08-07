import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InnovationDashboardService {
  private readonly logger = new Logger(InnovationDashboardService.name);

  async getDashboardOverview() {
    return {
      sandboxState: 'ACTIVE_ISOLATED_SANDBOX',
      runningExperimentsCount: 18,
      promotionsPendingCount: 4,
      multimodalReadiness: 'READY_FOR_STAGING',
      browserAgentSuccessPct: 98.2,
      voiceLatencyMs: 180.0,
    };
  }
}

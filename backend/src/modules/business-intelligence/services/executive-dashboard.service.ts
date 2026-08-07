import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export type ExecutiveRole = 'CEO' | 'CTO' | 'COO' | 'CFO' | 'GROWTH' | 'PRODUCT' | 'CUSTOMER';

@Injectable()
export class ExecutiveDashboardService {
  private readonly logger = new Logger(ExecutiveDashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDashboardForRole(role: ExecutiveRole = 'CEO') {
    return {
      role,
      generatedAt: new Date(),
      metrics: {
        arrUsd: 14500000,
        mrrUsd: 1208333,
        totalCustomers: 1420,
        activeWorkspaces: 8950,
        aiVisibilityScoreAvg: 94.2,
        grossMarginPercent: 82.5,
        netRetentionRatePercent: 128.4,
      },
      widgets: [
        { title: 'ARR & MRR Growth', type: 'LINE_CHART', status: 'HEALTHY' },
        { title: 'AI Economics & Gross Margin', type: 'DONUT_CHART', status: 'OPTIMAL' },
        { title: 'Customer Health Score Distribution', type: 'BAR_CHART', status: 'HEALTHY' },
      ],
    };
  }
}
